<?php

namespace App\Http\Controllers;

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
        $transactions = Transaction::with([
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
                    'id'              => $t->id,
                    'payment_status'  => $t->payment_status,
                    'delivery_status' => $t->delivery_status,
                    'listing' => [
                        'id'        => $t->listing->id,
                        'title'     => $t->listing->title,
                        'image_url' => $t->listing->image_url,
                    ],
                    'partner' => $partner,
                    'last_message' => $lastMsg ? [
                        'content'    => $lastMsg->content,
                        'sender'     => $lastMsg->sender->name,
                        'created_at_human' => $lastMsg->created_at->diffForHumans(),
                    ] : null,
                ];
            });

        return Inertia::render('Chat/Index', [
            'conversations' => $transactions,
        ]);
    }
}
