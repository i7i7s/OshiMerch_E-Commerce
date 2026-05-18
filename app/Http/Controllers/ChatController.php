<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(): Response
    {
        $userId = Auth::id();

        // All transactions where user is buyer or seller, that have messages
        $transactionChats = Transaction::with([
                'listing:id,title,image_path',
                'buyer:id,name,profile_picture_url',
                'seller:id,name,profile_picture_url',
                'messages' => fn ($q) => $q->latest()->limit(1),
                'messages.sender:id,name',
            ])
            ->where(fn ($q) => $q->where('buyer_id', $userId)->orWhere('seller_id', $userId))
            ->has('messages')
            ->latest('updated_at')
            ->get()
            ->map(function (Transaction $t) use ($userId) {
                $partner = $t->buyer_id === $userId ? $t->seller : $t->buyer;
                $lastMsg = $t->messages->first();

                return [
                    'type'            => 'transaction',
                    'id'              => $t->id,
                    'uuid'            => $t->uuid,
                    'payment_status'  => $t->payment_status,
                    'delivery_status' => $t->delivery_status,
                    'listing' => [
                        'id'        => $t->listing->id,
                        'title'     => $t->listing->title,
                        'image_url' => $t->listing->image_url,
                    ],
                    'partner'      => $partner,
                    'last_message' => $lastMsg ? [
                        'content'          => $lastMsg->content,
                        'sender'           => $lastMsg->sender->name,
                        'created_at_human' => $lastMsg->created_at->diffForHumans(),
                        'created_at_ts'    => $lastMsg->created_at->timestamp,
                    ] : null,
                ];
            });

        // Direct message conversations
        $directChats = Conversation::with([
                'user1:id,name,profile_picture_url',
                'user2:id,name,profile_picture_url',
                'directMessages' => fn ($q) => $q->latest()->limit(1),
                'directMessages.sender:id,name',
            ])
            ->where(fn ($q) => $q->where('user1_id', $userId)->orWhere('user2_id', $userId))
            ->has('directMessages')
            ->latest('updated_at')
            ->get()
            ->map(function (Conversation $c) use ($userId) {
                $partner = $c->user1_id === $userId ? $c->user2 : $c->user1;
                $lastMsg = $c->directMessages->first();

                return [
                    'type'    => 'direct',
                    'id'      => $c->id,
                    'partner' => $partner,
                    'last_message' => $lastMsg ? [
                        'content'          => $lastMsg->content,
                        'sender'           => $lastMsg->sender->name,
                        'created_at_human' => $lastMsg->created_at->diffForHumans(),
                        'created_at_ts'    => $lastMsg->created_at->timestamp,
                    ] : null,
                ];
            });

        // Merge and sort by most recent message
        $conversations = $transactionChats
            ->concat($directChats)
            ->sortByDesc(fn ($c) => $c['last_message']['created_at_ts'] ?? 0)
            ->values();

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
        ]);
    }
}
