<?php

use App\Models\Conversation;
use App\Models\Transaction;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels — OshiMerch
|--------------------------------------------------------------------------
|
| Authorization rules for private and presence WebSocket channels.
| Each callback receives the authenticated user and route parameters.
|
*/

// ─── User Notification Channel ────────────────────────────────────────────────
// Only the owner can listen to their own notifications
Broadcast::channel('notifications.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// ─── Direct Conversation Channel (Private) ────────────────────────────────────
// Only the two participants of a conversation can subscribe
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::find($conversationId);

    if (! $conversation) {
        return false;
    }

    return $conversation->user1_id === $user->id || $conversation->user2_id === $user->id;
});

// ─── Transaction Channel (Private) ───────────────────────────────────────────
// Only the buyer and seller of a transaction can subscribe
Broadcast::channel('transaction.{transactionId}', function ($user, $transactionId) {
    $transaction = Transaction::find($transactionId);

    if (! $transaction) {
        return false;
    }

    return $transaction->buyer_id === $user->id || $transaction->seller_id === $user->id;
});

// ─── Presence Channel for Conversation (Online/Typing) ────────────────────────
// Same auth as conversation but returns user info for presence tracking
Broadcast::channel('presence-conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::find($conversationId);

    if (! $conversation) {
        return false;
    }

    if ($conversation->user1_id === $user->id || $conversation->user2_id === $user->id) {
        return ['id' => $user->id, 'name' => $user->name];
    }

    return false;
});
