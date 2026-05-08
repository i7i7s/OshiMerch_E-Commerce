<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SellerProfileController extends Controller
{
    /**
     * Public seller profile — visible to any logged-in user.
     */
    public function show(User $user): Response
    {
        // Load listings
        $listings = $user->listings()
            ->where('status', 'Available')
            ->latest()
            ->take(12)
            ->get()
            ->map(fn ($l) => [
                'id'                   => $l->id,
                'title'                => $l->title,
                'price'                => $l->price,
                'condition'            => $l->condition,
                'category'             => $l->category,
                'image_url'            => $l->image_url,
                'featured_member_name' => $l->featured_member_name,
                'featured_member_team' => $l->featured_member_team,
                'created_at'           => $l->created_at->diffForHumans(),
            ]);

        // Load reviews with reviewer info
        $reviews = $user->reviewsReceived()
            ->with('reviewer:id,name,profile_picture_url,oshi_member_name')
            ->latest()
            ->take(20)
            ->get()
            ->map(fn ($r) => [
                'id'         => $r->id,
                'rating'     => $r->rating,
                'comment'    => $r->comment,
                'created_at' => $r->created_at->diffForHumans(),
                'reviewer'   => [
                    'name'               => $r->reviewer->name,
                    'avatar'             => $r->reviewer->profile_picture_url,
                    'oshi_member_name'   => $r->reviewer->oshi_member_name,
                ],
            ]);

        $avgRating    = $user->reviewsReceived()->avg('rating');
        $totalReviews = $user->reviewsReceived()->count();
        $totalSales   = $user->soldTransactions()->where('delivery_status', 'Completed')->count();

        // Rating distribution
        $ratingDist = [];
        for ($i = 1; $i <= 5; $i++) {
            $ratingDist[$i] = $user->reviewsReceived()->where('rating', $i)->count();
        }

        return Inertia::render('Seller/Profile', [
            'seller' => [
                'id'                  => $user->id,
                'name'                => $user->name,
                'avatar'              => $user->profile_picture_url,
                'bio'                 => $user->bio,
                'oshi_member_name'    => $user->oshi_member_name,
                'oshi_member_code'    => $user->oshi_member_code,
                'role'                => $user->role,
                'member_since'        => $user->created_at->format('M Y'),
                'total_listings'      => $user->listings()->count(),
                'active_listings'     => $user->listings()->where('status', 'Available')->count(),
                'total_sales'         => $totalSales,
                'avg_rating'          => $avgRating ? round($avgRating, 1) : null,
                'total_reviews'       => $totalReviews,
                'rating_distribution' => $ratingDist,
            ],
            'listings' => $listings,
            'reviews'  => $reviews,
            'auth'     => ['user' => Auth::user()],
        ]);
    }
}
