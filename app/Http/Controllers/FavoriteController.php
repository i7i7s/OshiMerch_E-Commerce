<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    /**
     * GET /favorites — show all favorites for current user.
     */
    public function index(): Response
    {
        $favorites = Favorite::where('user_id', Auth::id())
            ->with('listing')
            ->latest()
            ->get()
            ->map(fn ($f) => [
                'id'         => $f->id,
                'listing_id' => $f->listing_id,
                'listing'    => $f->listing ? [
                    'id'                   => $f->listing->id,
                    'title'                => $f->listing->title,
                    'price'                => $f->listing->price,
                    'condition'            => $f->listing->condition,
                    'category'             => $f->listing->category,
                    'image_url'            => $f->listing->image_url,  // accessor
                    'featured_member_name' => $f->listing->featured_member_name,
                    'featured_member_team' => $f->listing->featured_member_team,
                    'status'               => $f->listing->status,
                ] : null,
                'created_at' => $f->created_at->diffForHumans(),
            ]);

        return Inertia::render('Favorites', [
            'favorites' => $favorites,
        ]);
    }

    /**
     * POST /api/favorites/toggle
     * Add or remove a listing from favorites.
     * Returns redirect()->back() so Inertia router.post() works correctly.
     */
    public function toggle(Request $request): RedirectResponse
    {
        $request->validate(['listing_id' => 'required|exists:listings,id']);

        $existing = Favorite::where('user_id', Auth::id())
            ->where('listing_id', $request->listing_id)
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            Favorite::create([
                'user_id'    => Auth::id(),
                'listing_id' => $request->listing_id,
            ]);
        }

        return back();
    }

    /**
     * GET /favorites/status/{listing} — check if a listing is favorited.
     */
    public function status(Listing $listing): JsonResponse
    {
        $favorited = Favorite::where('user_id', Auth::id())
            ->where('listing_id', $listing->id)
            ->exists();

        return response()->json(['favorited' => $favorited]);
    }
}
