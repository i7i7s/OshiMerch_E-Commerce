<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Notification;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Show all reviews received by a seller.
     */
    public function index(User $user): Response
    {
        $reviews = Review::where('seller_id', $user->id)
            ->with(['reviewer:id,name,profile_picture_url,oshi_member_name', 'transaction.listing'])
            ->latest()
            ->paginate(12)
            ->through(fn ($r) => [
                'id'         => $r->id,
                'rating'     => $r->rating,
                'comment'    => $r->comment,
                'reviewer'   => $r->reviewer,
                'created_at' => $r->created_at->diffForHumans(),
                'product'    => $r->transaction?->listing ? [
                    'title' => $r->transaction->listing->title,
                ] : null,
            ]);

        $avgRating   = Review::where('seller_id', $user->id)->avg('rating') ?? 0;
        $totalReviews = Review::where('seller_id', $user->id)->count();

        // Star breakdown (1–5)
        $breakdown = [];
        for ($i = 5; $i >= 1; $i--) {
            $count = Review::where('seller_id', $user->id)->where('rating', $i)->count();
            $breakdown[$i] = [
                'count'   => $count,
                'percent' => $totalReviews > 0 ? round(($count / $totalReviews) * 100) : 0,
            ];
        }

        return Inertia::render('Reviews/Index', [
            'seller'       => [
                'id'                  => $user->id,
                'name'                => $user->name,
                'profile_picture_url' => $user->profile_picture_url,
                'oshi_member_name'    => $user->oshi_member_name,
            ],
            'reviews'      => $reviews,
            'avg_rating'   => round($avgRating, 1),
            'total_reviews'=> $totalReviews,
            'breakdown'    => $breakdown,
        ]);
    }

    /**
     * Store a new review for a completed transaction.
     */
    public function store(Request $request, Transaction $transaction): RedirectResponse
    {
        $user = $request->user();

        abort_unless($transaction->buyer_id === $user->id, 403);
        abort_unless($transaction->delivery_status === 'Delivered', 403);

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

        Notification::reviewReceived($transaction->seller_id, $transaction->id, $user->name);

        return back()->with('success', 'Ulasan berhasil dikirim! ⭐');
    }
}
