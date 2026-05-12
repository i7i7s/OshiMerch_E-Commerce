<?php

namespace App\Http\Controllers;

use App\Events\TransactionStatusUpdated;
use App\Models\Listing;
use App\Models\Notification;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Create a new transaction (buyer initiates purchase).
     */
    public function store(Request $request): HttpResponse|RedirectResponse
    {
        $validProvinces = implode(',', array_keys(config('shipping.provinces', [])));

        $request->validate([
            'listing_id'        => 'required|exists:listings,id',
            'payment_method'    => 'required|in:BCA,Dana,GoPay,ShopeePay,OVO',
            'shipping_address'  => 'required|string|max:500',
            'shipping_province' => 'required|string|in:' . $validProvinces,
            'recipient_name'    => 'required|string|max:150',
            'recipient_phone'   => 'nullable|string|max:20',
        ]);

        $listing = Listing::findOrFail($request->listing_id);

        if ($listing->user_id === Auth::id()) {
            return back()->withErrors(['listing_id' => 'Kamu tidak bisa membeli listing milikmu sendiri.']);
        }

        if ($listing->status !== 'Available') {
            return back()->withErrors(['listing_id' => 'Listing ini sudah tidak tersedia.']);
        }

        $shippingFee = config('shipping.provinces.' . $request->shipping_province, 0);

        $transaction = Transaction::create([
            'buyer_id'          => Auth::id(),
            'seller_id'         => $listing->user_id,
            'listing_id'        => $listing->id,
            'item_price'        => $listing->price,
            'payment_method'    => $request->payment_method,
            'shipping_address'  => $request->shipping_address,
            'shipping_province' => $request->shipping_province,
            'shipping_fee'      => $shippingFee,
            'recipient_name'    => $request->recipient_name,
            'recipient_phone'   => $request->recipient_phone,
            'payment_status'    => 'Pending',
            'delivery_status'   => 'Pending',
        ]);

        $listing->update(['status' => 'Reserved']);

        // Inertia-compatible redirect (avoids blank white screen on SPA)
        return Inertia::location(route('transactions.show', $transaction->id));
    }

    /**
     * Show transaction detail page (order + chat).
     */
    public function show(Transaction $transaction): Response
    {
        Gate::authorize('view', $transaction);

        $transaction->load([
            'listing',
            'buyer:id,name,profile_picture_url,oshi_member_name',
            'seller:id,name,profile_picture_url,oshi_member_name',
            'messages.sender:id,name,profile_picture_url',
        ]);

        return Inertia::render('Transactions/Show', [
            'transaction' => [
                'id'                     => $transaction->id,
                'item_price'             => $transaction->item_price,
                'shipping_fee'           => $transaction->shipping_fee ?? 0,
                'shipping_province'      => $transaction->shipping_province,
                'total_price'            => $transaction->item_price + ($transaction->shipping_fee ?? 0),
                'payment_method'         => $transaction->payment_method,
                'shipping_address'       => $transaction->shipping_address,
                'recipient_name'         => $transaction->recipient_name,
                'recipient_phone'        => $transaction->recipient_phone,
                'shipping_resi'          => $transaction->shipping_resi,
                'oshigo_tracking_number' => $transaction->oshigo_tracking_number,
                'payment_status'   => $transaction->payment_status,
                'delivery_status'  => $transaction->delivery_status,
                'proof_url'        => $transaction->proof_url,
                'created_at'       => $transaction->created_at->toISOString(),
                'created_at_human' => $transaction->created_at->diffForHumans(),
                'listing' => [
                    'id'                   => $transaction->listing->id,
                    'title'                => $transaction->listing->title,
                    'condition'            => $transaction->listing->condition,
                    'category'             => $transaction->listing->category,
                    'image_url'            => $transaction->listing->image_url,
                    'featured_member_name' => $transaction->listing->featured_member_name,
                    'featured_member_team' => $transaction->listing->featured_member_team,
                ],
                'buyer'  => $transaction->buyer,
                'seller' => $transaction->seller,
                'messages' => $transaction->messages->map(fn ($m) => [
                    'id'               => $m->id,
                    'content'          => $m->content,
                    'sender_id'        => $m->sender_id,
                    'sender'           => $m->sender,
                    'created_at'       => $m->created_at->toISOString(),
                    'created_at_human' => $m->created_at->diffForHumans(),
                ]),
                'has_review' => $transaction->reviews()
                    ->where('reviewer_id', Auth::id())
                    ->exists(),
            ],
        ]);
    }

    /**
     * Buyer uploads proof of transfer.
     */
    public function uploadProof(Request $request, Transaction $transaction): RedirectResponse
    {
        Gate::authorize('uploadProof', $transaction);

        $request->validate(['proof' => 'required|image|max:4096']);

        if ($transaction->proof_of_transfer_path) {
            Storage::disk('public')->delete($transaction->proof_of_transfer_path);
        }

        $path = $request->file('proof')->store('proofs', 'public');

        $transaction->update([
            'proof_of_transfer_path' => $path,
            'payment_status'         => 'Paid',
        ]);

        // Broadcast status change to both parties
        broadcast(new TransactionStatusUpdated($transaction->fresh()));

        // Notify seller
        Notification::transactionPaid(
            $transaction->seller_id,
            $transaction->id,
            $transaction->buyer->name ?? 'Pembeli'
        );

        return back()->with('success', 'Bukti transfer berhasil diupload. Menunggu konfirmasi penjual.');
    }

    /**
     * Seller confirms payment proof is valid → payment_status: Confirmed.
     *
     * Payment Gateway note: When a gateway is integrated, the webhook will set
     * payment_status → 'Confirmed' directly, bypassing this manual step.
     * This method only handles the manual Rekber flow.
     */
    public function confirmPayment(Transaction $transaction): RedirectResponse
    {
        Gate::authorize('confirmPayment', $transaction);

        $transaction->update(['payment_status' => 'Confirmed']);

        // Broadcast status change to both parties
        broadcast(new TransactionStatusUpdated($transaction->fresh()));

        // Notify buyer that seller confirmed
        Notification::create([
            'user_id' => $transaction->buyer_id,
            'type'    => 'payment_confirmed',
            'title'   => '✅ Pembayaran Dikonfirmasi!',
            'body'    => 'Penjual telah mengkonfirmasi pembayaranmu. Barang akan segera dikirim.',
            'url'     => "/transactions/{$transaction->id}",
            'data'    => ['transaction_id' => $transaction->id],
        ]);

        return back()->with('success', 'Pembayaran dikonfirmasi! Silakan input nomor resi pengiriman.');
    }

    /**
     * Seller packs the item → generates OshiGo tracking number, delivery_status: Packed.
     */
    public function pack(Transaction $transaction): RedirectResponse
    {
        Gate::authorize('pack', $transaction);

        $tracking = 'OSG-' . now()->format('Ymd') . '-' . str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);

        $transaction->update([
            'oshigo_tracking_number' => $tracking,
            'delivery_status'        => 'Packed',
        ]);

        broadcast(new TransactionStatusUpdated($transaction->fresh()));

        Notification::create([
            'user_id' => $transaction->buyer_id,
            'type'    => 'item_packed',
            'title'   => '📦 Pesananmu Sedang Dipacking!',
            'body'    => "Penjual sedang menyiapkan barangmu. Tracking OshiGo: {$tracking}",
            'url'     => "/transactions/{$transaction->id}",
            'data'    => ['transaction_id' => $transaction->id, 'tracking' => $tracking],
        ]);

        return back()->with('success', "Barang dipacking! Nomor tracking OshiGo: {$tracking}");
    }

    /**
     * Seller marks as shipped → delivery_status: Shipped.
     */
    public function ship(Transaction $transaction): RedirectResponse
    {
        Gate::authorize('ship', $transaction);

        $transaction->update(['delivery_status' => 'Shipped']);

        broadcast(new TransactionStatusUpdated($transaction->fresh()));

        Notification::itemShipped(
            $transaction->buyer_id,
            $transaction->id,
            $transaction->oshigo_tracking_number
        );

        return back()->with('success', 'Status diupdate: Dikirim!');
    }

    /**
     * Seller marks as out for delivery → delivery_status: OutForDelivery.
     */
    public function outForDelivery(Transaction $transaction): RedirectResponse
    {
        Gate::authorize('outForDelivery', $transaction);

        $transaction->update(['delivery_status' => 'OutForDelivery']);

        broadcast(new TransactionStatusUpdated($transaction->fresh()));

        Notification::create([
            'user_id' => $transaction->buyer_id,
            'type'    => 'out_for_delivery',
            'title'   => '🚚 Barangmu Sedang Dalam Perjalanan!',
            'body'    => "Paketmu ({$transaction->oshigo_tracking_number}) sedang dalam perjalanan menuju alamatmu.",
            'url'     => "/transactions/{$transaction->id}",
            'data'    => ['transaction_id' => $transaction->id],
        ]);

        return back()->with('success', 'Status diupdate: Dalam Perjalanan!');
    }

    /**
     * Buyer confirms receipt → delivery_status: Delivered.
     */
    public function complete(Transaction $transaction): RedirectResponse
    {
        Gate::authorize('complete', $transaction);

        $transaction->update(['delivery_status' => 'Delivered']);
        $transaction->listing->update(['status' => 'Sold']);

        broadcast(new TransactionStatusUpdated($transaction->fresh()));

        Notification::transactionCompleted($transaction->seller_id, $transaction->id);

        return back()->with('success', 'Transaksi selesai! Terima kasih.');
    }
}
