<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Listing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    /**
     * Display a filterable, paginated listing of all available merch.
     */
    public function index(Request $request): Response
    {
        $query = Listing::with('user:id,name,profile_picture_url,oshi_member_name')
            ->available()
            ->search($request->input('search'))
            ->byTeam($request->input('team'))
            ->byCondition($request->input('condition'))
            ->byCategory($request->input('category'))
            ->byPriceRange(
                $request->integer('price_min') ?: null,
                $request->integer('price_max') ?: null,
            )
            ->sorted($request->input('sort', 'latest'));

        $listings = $query->paginate(15)->withQueryString();

        // Transform to append imageUrl accessor and strip unneeded fields
        $listings->through(function (Listing $listing) {
            return [
                'id'                   => $listing->id,
                'title'                => $listing->title,
                'price'                => $listing->price,
                'condition'            => $listing->condition,
                'category'             => $listing->category,
                'status'               => $listing->status,
                'image_url'            => $listing->image_url,
                'featured_member_code' => $listing->featured_member_code,
                'featured_member_name' => $listing->featured_member_name,
                'featured_member_team' => $listing->featured_member_team,
                'created_at'           => $listing->created_at->diffForHumans(),
                'seller'               => $listing->user ? [
                    'id'                 => $listing->user->id,
                    'name'               => $listing->user->name,
                    'avatar'             => $listing->user->profile_picture_url,
                    'oshi_member_name'   => $listing->user->oshi_member_name,
                ] : null,
            ];
        });

        return Inertia::render('Products', [
            'listings'   => $listings,
            'filters'    => $request->only(['search', 'team', 'condition', 'category', 'price_min', 'price_max', 'sort']),
            'auth'       => ['user' => Auth::user()],
        ]);
    }

    /**
     * Show a single listing detail page.
     */
    public function show(Listing $listing): Response
    {
        $listing->load('user:id,name,profile_picture_url,oshi_member_name,bio');

        // Related listings — same team or category, exclude current
        $related = Listing::with('user:id,name,profile_picture_url')
            ->available()
            ->where('id', '!=', $listing->id)
            ->where(function ($q) use ($listing) {
                $q->where('featured_member_team', $listing->featured_member_team)
                  ->orWhere('category', $listing->category);
            })
            ->sorted('latest')
            ->limit(6)
            ->get()
            ->map(fn (Listing $l) => [
                'id'                   => $l->id,
                'title'                => $l->title,
                'price'                => $l->price,
                'condition'            => $l->condition,
                'category'             => $l->category,
                'image_url'            => $l->image_url,
                'featured_member_name' => $l->featured_member_name,
                'featured_member_team' => $l->featured_member_team,
                'seller'               => $l->user ? ['name' => $l->user->name] : null,
            ]);

        return Inertia::render('Products/Show', [
            'listing'      => [
                'id'                   => $listing->id,
                'title'                => $listing->title,
                'description'          => $listing->description,
                'price'                => $listing->price,
                'condition'            => $listing->condition,
                'category'             => $listing->category,
                'status'               => $listing->status,
                'image_url'            => $listing->image_url,
                'featured_member_code' => $listing->featured_member_code,
                'featured_member_name' => $listing->featured_member_name,
                'featured_member_team' => $listing->featured_member_team,
                'created_at'           => $listing->created_at->diffForHumans(),
                'seller'               => [
                    'id'               => $listing->user->id,
                    'name'             => $listing->user->name,
                    'avatar'           => $listing->user->profile_picture_url,
                    'oshi_member_name' => $listing->user->oshi_member_name,
                    'bio'              => $listing->user->bio,
                ],
            ],
            'related'      => $related,
            'auth'         => ['user' => Auth::user()],
            // Whether the logged-in user has already favorited this listing
            'is_favorited' => Auth::check()
                ? Favorite::where('user_id', Auth::id())->where('listing_id', $listing->id)->exists()
                : false,
        ]);
    }

    /**
     * Show the create listing form.
     */
    public function create(): Response
    {
        return Inertia::render('Listings/Create', [
            'apiUrl' => config('services.jkt48.api_url', 'https://jkt-48-member-api-i7i7.vercel.app'),
        ]);
    }

    /**
     * Store a new listing.
     */
    public function store(Request $request): HttpResponse|RedirectResponse
    {
        $validated = $request->validate([
            'title'                => 'required|string|max:255',
            'description'          => 'nullable|string|max:2000',
            'category'             => 'required|in:photocard,lightstick,apparel,poster,album,keychain,towel,other',
            'price'                => 'required|integer|min:1000|max:99999999',
            'condition'            => 'required|in:New,Used,Mint',
            'image'                => 'required|image|mimes:jpeg,jpg,png,webp|max:4096',
            'featured_member_code' => 'nullable|string|max:100',
            'featured_member_name' => 'nullable|string|max:255',
            'featured_member_team' => 'nullable|in:PASSION,LOVE,DREAM,TRAINEE,VIRTUAL',
        ]);

        $imagePath = $request->file('image')->store('listings', 'public');

        $listing = $request->user()->listings()->create([
            'title'                => $validated['title'],
            'description'          => $validated['description'] ?? null,
            'category'             => $validated['category'],
            'price'                => $validated['price'],
            'condition'            => $validated['condition'],
            'image_path'           => $imagePath,
            'featured_member_code' => $validated['featured_member_code'] ?? null,
            'featured_member_name' => $validated['featured_member_name'] ?? null,
            'featured_member_team' => $validated['featured_member_team'] ?? null,
            'status'               => 'Available',
        ]);

        return Inertia::location(route('products.show', $listing));
    }

    /**
     * Show the edit form for a listing.
     */
    public function edit(Listing $listing): Response
    {
        Gate::authorize('update', $listing);

        return Inertia::render('Listings/Edit', [
            'listing' => [
                'id'                   => $listing->id,
                'title'                => $listing->title,
                'description'          => $listing->description,
                'category'             => $listing->category,
                'price'                => $listing->price,
                'condition'            => $listing->condition,
                'image_url'            => $listing->image_url,
                'featured_member_code' => $listing->featured_member_code,
                'featured_member_name' => $listing->featured_member_name,
                'featured_member_team' => $listing->featured_member_team,
            ],
            'apiUrl' => config('services.jkt48.api_url', 'https://jkt-48-member-api-i7i7.vercel.app'),
        ]);
    }

    /**
     * Update an existing listing.
     */
    public function update(Request $request, Listing $listing): HttpResponse|RedirectResponse
    {
        Gate::authorize('update', $listing);

        $validated = $request->validate([
            'title'                => 'required|string|max:255',
            'description'          => 'nullable|string|max:2000',
            'category'             => 'required|in:photocard,lightstick,apparel,poster,album,keychain,towel,other',
            'price'                => 'required|integer|min:1000|max:99999999',
            'condition'            => 'required|in:New,Used,Mint',
            'image'                => 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096',
            'featured_member_code' => 'nullable|string|max:100',
            'featured_member_name' => 'nullable|string|max:255',
            'featured_member_team' => 'nullable|in:PASSION,LOVE,DREAM,TRAINEE,VIRTUAL',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($listing->image_path) {
                Storage::disk('public')->delete($listing->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('listings', 'public');
        }

        $listing->update([
            'title'                => $validated['title'],
            'description'          => $validated['description'] ?? null,
            'category'             => $validated['category'],
            'price'                => $validated['price'],
            'condition'            => $validated['condition'],
            'image_path'           => $validated['image_path'] ?? $listing->image_path,
            'featured_member_code' => $validated['featured_member_code'] ?? null,
            'featured_member_name' => $validated['featured_member_name'] ?? null,
            'featured_member_team' => $validated['featured_member_team'] ?? null,
        ]);

        return Inertia::location(route('products.show', $listing));
    }

    /**
     * Delete a listing (owner only).
     */
    public function destroy(Listing $listing): RedirectResponse
    {
        Gate::authorize('delete', $listing);

        if ($listing->image_path) {
            Storage::disk('public')->delete($listing->image_path);
        }

        $listing->delete();

        return redirect()->route('products.index')
            ->with('success', 'Listing berhasil dihapus.');
    }
}
