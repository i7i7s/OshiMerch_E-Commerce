<?php

namespace App\Http\Controllers;

use App\Events\DirectMessageSent;
use App\Models\Conversation;
use App\Models\DirectMessage;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConversationController extends Controller
{
    /**
     * Find or create a direct conversation with a user, then render the chat.
     */
    public function show(User $user)
    {
        $currentUser = Auth::user();

        // Can't chat with yourself
        if ($currentUser->id === $user->id) {
            return redirect()->route('chat.index');
        }

        // Find or create conversation
        $conversation = Conversation::between($currentUser->id, $user->id);
        if (!$conversation) {
            $conversation = Conversation::create([
                'user1_id' => $currentUser->id,
                'user2_id' => $user->id,
            ]);
        }

        $conversation->load(['user1:id,name,profile_picture_url,oshi_member_name', 'user2:id,name,profile_picture_url,oshi_member_name']);
        $messages = $conversation->directMessages()->with('sender:id,name,profile_picture_url')->get()
            ->map(fn ($m) => [
                'id'               => $m->id,
                'content'          => $m->content,
                'sender_id'        => $m->sender_id,
                'sender'           => $m->sender,
                'created_at_human' => $m->created_at->diffForHumans(),
            ]);

        $other = $conversation->otherUser($currentUser->id);

        return Inertia::render('Chat/Direct', [
            'conversation' => [
                'id'       => $conversation->id,
                'other'    => [
                    'id'               => $other->id,
                    'name'             => $other->name,
                    'avatar'           => $other->profile_picture_url,
                    'oshi_member_name' => $other->oshi_member_name,
                ],
                'messages' => $messages,
            ],
        ]);
    }

    /**
     * Send a message in a direct conversation.
     */
    public function sendMessage(Request $request, Conversation $conversation)
    {
        $user = Auth::user();

        // Only participants can send
        abort_unless(
            $conversation->user1_id === $user->id || $conversation->user2_id === $user->id,
            403
        );

        $request->validate(['content' => 'required|string|max:2000']);

        $message = DirectMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id'       => $user->id,
            'content'         => $request->content,
        ]);

        // Broadcast to the other participant via WebSocket
        broadcast(new DirectMessageSent($message, $conversation->id))->toOthers();

        // Notify the other user
        $otherId = $conversation->user1_id === $user->id
            ? $conversation->user2_id
            : $conversation->user1_id;
        Notification::newMessage($otherId, $user->name, $conversation->id, $user->id);

        // AJAX (fetch from React) → return JSON with message data
        if ($request->expectsJson()) {
            $message->load('sender:id,name,profile_picture_url');
            return response()->json([
                'message' => [
                    'id'               => $message->id,
                    'content'          => $message->content,
                    'sender_id'        => $message->sender_id,
                    'sender'           => $message->sender?->only(['id', 'name', 'profile_picture_url']),
                    'created_at_human' => $message->created_at->diffForHumans(),
                ],
            ]);
        }

        // Inertia fallback
        return back()->with('success', 'Pesan terkirim.');
    }
}
