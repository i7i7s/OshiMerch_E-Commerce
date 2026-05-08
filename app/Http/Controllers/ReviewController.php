<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    /**
     * Store a new review for a completed transaction.
     */
    public function store(Request $request, Transaction $transaction): RedirectResponse
    {
        $user = $request->user();

        // Only buyer can leave a review, and only on completed transactions
        abort_unless($transaction->buyer_id === $user->id, 403);
        abort_unless($transaction->delivery_status === 'Completed', 403);

        // Prevent duplicate reviews
        if ($transaction->reviews()->where('reviewer_id', $user->id)->exists()) {
            return back()->with('error', 'Kamu sudah memberi ulasan untuk transaksi ini.');
        }

        $validated = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        Review::create([
            'transaction_id' => $transaction->id,
            'reviewer_id'    => $user->id,
            'seller_id'      => $transaction->seller_id,
            'rating'         => $validated['rating'],
            'comment'        => $validated['comment'] ?? null,
        ]);

        return back()->with('success', 'Ulasan berhasil dikirim! ⭐');
    }
}
