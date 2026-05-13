<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function show(Listing $listing): Response
    {
        // Can't buy your own listing
        if ($listing->user_id === Auth::id()) {
            abort(403, 'Kamu tidak bisa membeli listing milikmu sendiri.');
        }

        // Must be available
        if ($listing->status !== 'Available') {
            abort(404, 'Listing ini sudah tidak tersedia.');
        }

        $listing->load('user:id,name,profile_picture_url,oshi_member_name');

        return Inertia::render('Checkout', [
            'listing' => [
                'id'        => $listing->id,
                'title'     => $listing->title,
                'price'     => $listing->price,
                'condition' => $listing->condition,
                'category'  => $listing->category,
                'image_url' => $listing->image_url,
                'status'    => $listing->status,
                'seller'    => [
                    'id'               => $listing->user->id,
                    'name'             => $listing->user->name,
                    'avatar'           => $listing->user->profile_picture_url,
                    'oshi_member_name' => $listing->user->oshi_member_name,
                ],
            ],
        ]);
    }
}
