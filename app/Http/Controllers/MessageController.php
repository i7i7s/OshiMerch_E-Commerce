<?php

namespace App\Http\Controllers;

use App\Events\TransactionMessageSent;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class MessageController extends Controller
{
    public function store(Request $request, Transaction $transaction): JsonResponse|RedirectResponse
    {
        Gate::authorize('view', $transaction);

        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $message = $transaction->messages()->create([
            'sender_id' => Auth::id(),
            'content'   => $request->content,
        ]);

        // Load sender for broadcast payload
        $message->load('sender:id,name,profile_picture_url');

        // Broadcast to the other participant via WebSocket
        broadcast(new TransactionMessageSent($message, $transaction->id))->toOthers();

        if ($request->expectsJson()) {
            return response()->json([
                'id'         => $message->id,
                'content'    => $message->content,
                'sender_id'  => $message->sender_id,
                'sender'     => $message->sender,
                'created_at' => $message->created_at->toISOString(),
            ]);
        }

        return back();
    }
}
