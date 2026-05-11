<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Listing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * GET /cart — tampilkan semua item keranjang user.
     */
    public function index(): Response
    {
        $items = CartItem::where('user_id', Auth::id())
            ->with('listing.user:id,name,profile_picture_url')
            ->latest()
            ->get()
            ->map(fn ($item) => [
                'id'         => $item->id,
                'listing_id' => $item->listing_id,
                'listing'    => $item->listing ? [
                    'id'        => $item->listing->id,
                    'title'     => $item->listing->title,
                    'price'     => $item->listing->price,
                    'condition' => $item->listing->condition,
                    'category'  => $item->listing->category,
                    'image_url' => $item->listing->image_url,
                    'status'    => $item->listing->status,
                    'featured_member_name' => $item->listing->featured_member_name,
                    'featured_member_team' => $item->listing->featured_member_team,
                    'seller'    => $item->listing->user ? [
                        'id'     => $item->listing->user->id,
                        'name'   => $item->listing->user->name,
                        'avatar' => $item->listing->user->profile_picture_url,
                    ] : null,
                ] : null,
                'created_at' => $item->created_at->diffForHumans(),
            ])
            ->filter(fn ($item) => $item['listing'] !== null) // skip jika listing sudah dihapus
            ->values();

        return Inertia::render('Cart', [
            'cartItems' => $items,
            'auth'      => ['user' => Auth::user()],
        ]);
    }

    /**
     * POST /cart/add — tambah listing ke keranjang.
     */
    public function add(Request $request): RedirectResponse
    {
        $request->validate(['listing_id' => 'required|exists:listings,id']);

        $listing = Listing::findOrFail($request->listing_id);

        // Tidak boleh tambah listing sendiri ke keranjang
        if ($listing->user_id === Auth::id()) {
            return back()->with('error', 'Kamu tidak bisa membeli listing sendiri.');
        }

        // Tidak boleh tambah listing yang sudah sold/reserved
        if ($listing->status !== 'Available') {
            return back()->with('error', 'Listing ini sudah tidak tersedia.');
        }

        // Insert atau ignore jika sudah ada (unique constraint)
        CartItem::firstOrCreate([
            'user_id'    => Auth::id(),
            'listing_id' => $request->listing_id,
        ]);

        return back()->with('success', 'Ditambahkan ke keranjang! 🛒');
    }

    /**
     * DELETE /cart/{cartItem} — hapus satu item dari keranjang.
     */
    public function remove(CartItem $cartItem): RedirectResponse
    {
        // Pastikan hanya pemilik yang bisa hapus
        abort_if($cartItem->user_id !== Auth::id(), 403);

        $cartItem->delete();

        return back()->with('success', 'Item dihapus dari keranjang.');
    }

    /**
     * DELETE /cart — hapus semua item keranjang user.
     */
    public function clear(): RedirectResponse
    {
        CartItem::where('user_id', Auth::id())->delete();

        return back()->with('success', 'Keranjang dikosongkan.');
    }
}
