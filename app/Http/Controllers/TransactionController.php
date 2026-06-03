<?php

namespace App\Http\Controllers;

use App\Events\TransactionStatusUpdated;
use App\Mail\ItemPackedMail;
use App\Mail\ItemShippedMail;
use App\Mail\PaymentConfirmedMail;
use App\Mail\TransactionCompletedMail;
use App\Mail\TransactionPaidMail;
use App\Models\Listing;
use App\Models\Notification;
use App\Models\Setting;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
            'shipping_address'  => 'required|string|max:500',
            'shipping_province' => 'required|string|in:' . $validProvinces,
            'shipping_city'     => 'nullable|string|max:150',
            'shipping_district' => 'nullable|string|max:150',
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

        $slug        = Str::slug($request->shipping_province, '_');
        $shippingFee = (int) Setting::get(
            "oshigo_rate_{$slug}",
            config('shipping.provinces.' . $request->shipping_province, 0)
        );

        $transaction = Transaction::create([
            'buyer_id'          => Auth::id(),
            'seller_id'         => $listing->user_id,
            'listing_id'        => $listing->id,
            'item_price'        => $listing->price,
            'shipping_address'  => $request->shipping_address,
            'shipping_province' => $request->shipping_province,
            'shipping_city'     => $request->shipping_city,
            'shipping_district' => $request->shipping_district,
            'shipping_fee'      => $shippingFee,
            'recipient_name'    => $request->recipient_name,
            'recipient_phone'   => $request->recipient_phone,
            'payment_status'    => 'Pending',
            'delivery_status'   => 'Pending',
            'payment_deadline'  => now()->addHours(24),
        ]);

        $listing->update(['status' => 'Reserved']);

        // Generate Midtrans Snap token
        try {
            \Midtrans\Config::$serverKey    = config('services.midtrans.server_key');
            \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
            \Midtrans\Config::$isSanitized  = true;
            \Midtrans\Config::$is3ds        = true;

            $orderId    = 'OM-' . $transaction->id . '-' . time();
            $snapParams = [
                'transaction_details' => [
                    'order_id'     => $orderId,
                    'gross_amount' => $transaction->item_price + $shippingFee,
                ],
                'customer_details' => [
                    'first_name' => $request->recipient_name,
                    'phone'      => $request->recipient_phone,
                    'email'      => Auth::user()->email,
                ],
                'item_details' => [
                    [
                        'id'       => (string) $transaction->listing_id,
                        'price'    => $transaction->item_price,
                        'quantity' => 1,
                        'name'     => Str::limit($listing->title, 50),
                    ],
                    [
                        'id'       => 'OSHIGO-SHIPPING',
                        'price'    => $shippingFee,
                        'quantity' => 1,
                        'name'     => 'Ongkir OshiGo',
                    ],
                ],
                'callbacks' => [
                    'finish' => route('transactions.midtrans-finish', $transaction->uuid),
                ],
            ];

            // Only add shipping item if fee > 0 (Midtrans requires price > 0)
            if ($shippingFee === 0) {
                array_pop($snapParams['item_details']);
            }

            $orderId    = 'OM-' . $transaction->id . '-' . time();
            $snapParams['transaction_details']['order_id'] = $orderId;
            $snapToken = \Midtrans\Snap::getSnapToken($snapParams);
            $transaction->update([
                'midtrans_snap_token' => $snapToken,
                'midtrans_order_id'   => $orderId,
            ]);
        } catch (\Exception $e) {
            // Log error but don't block the checkout — buyer can retry payment
            \Illuminate\Support\Facades\Log::error('Midtrans snap token error: ' . $e->getMessage());
        }

        return Inertia::location(route('transactions.show', $transaction->uuid));
    }

    /**
     * Regenerate Midtrans snap token for a pending transaction.
     * Used when token generation failed during checkout or token is missing.
     */
    public function refreshSnapToken(Transaction $transaction): \Illuminate\Http\JsonResponse
    {
        // Only buyer can refresh their own token
        if (Auth::id() !== $transaction->buyer_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($transaction->payment_status !== 'Pending') {
            return response()->json(['error' => 'Transaction is not pending'], 400);
        }

        try {
            \Midtrans\Config::$serverKey    = config('services.midtrans.server_key');
            \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
            \Midtrans\Config::$isSanitized  = true;
            \Midtrans\Config::$is3ds        = true;

            $listing     = $transaction->listing;
            $shippingFee = $transaction->shipping_fee ?? 0;

            $itemDetails = [
                [
                    'id'       => (string) $transaction->listing_id,
                    'price'    => $transaction->item_price,
                    'quantity' => 1,
                    'name'     => Str::limit($listing->title, 50),
                ],
            ];

            if ($shippingFee > 0) {
                $itemDetails[] = [
                    'id'       => 'OSHIGO-SHIPPING',
                    'price'    => $shippingFee,
                    'quantity' => 1,
                    'name'     => 'Ongkir OshiGo',
                ];
            }

            $orderId    = 'OM-' . $transaction->id . '-' . time();
            $snapParams = [
                'transaction_details' => [
                    'order_id'     => $orderId,
                    'gross_amount' => $transaction->item_price + $shippingFee,
                ],
                'customer_details' => [
                    'first_name' => $transaction->recipient_name,
                    'phone'      => $transaction->recipient_phone,
                    'email'      => Auth::user()->email,
                ],
                'item_details' => $itemDetails,
                'callbacks' => [
                    'finish' => route('transactions.midtrans-finish', $transaction->uuid),
                ],
            ];
            $snapToken = \Midtrans\Snap::getSnapToken($snapParams);
            $transaction->update([
                'midtrans_snap_token' => $snapToken,
                'midtrans_order_id'   => $orderId,
            ]);

            return response()->json(['snap_token' => $snapToken]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Midtrans refresh snap token error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
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
                'uuid'                   => $transaction->uuid,
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
                'payment_status'         => $transaction->payment_status,
                'delivery_status'        => $transaction->delivery_status,
                'proof_url'              => $transaction->proof_url,
                'created_at'             => $transaction->created_at->toISOString(),
                'created_at_human'       => $transaction->created_at->diffForHumans(),
                'payment_deadline'       => $transaction->payment_deadline?->toISOString(),
                'ship_deadline'          => $transaction->ship_deadline?->toISOString(),
                // Only expose snap token to the buyer when payment is still pending
                'midtrans_snap_token'    => (
                    Auth::id() === $transaction->buyer_id &&
                    $transaction->payment_status === 'Pending'
                ) ? $transaction->midtrans_snap_token : null,
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
        try { broadcast(new TransactionStatusUpdated($transaction->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }

        // Notify seller
        Notification::transactionPaid(
            $transaction->seller_id,
            $transaction->id,
            $transaction->buyer->name ?? 'Pembeli'
        );

        // Email seller
        try {
            $transaction->load(['listing', 'buyer', 'seller']);
            Mail::to($transaction->seller->email)->send(new TransactionPaidMail($transaction));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('[Mail] TransactionPaidMail failed: ' . $e->getMessage());
        }

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
        try { broadcast(new TransactionStatusUpdated($transaction->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }

        // Notify buyer that seller confirmed
        Notification::create([
            'user_id' => $transaction->buyer_id,
            'type'    => 'payment_confirmed',
            'title'   => '✅ Pembayaran Dikonfirmasi!',
            'body'    => 'Penjual telah mengkonfirmasi pembayaranmu. Barang akan segera dikirim.',
            'url'     => "/transactions/{$transaction->uuid}",
            'data'    => ['transaction_id' => $transaction->id],
        ]);

        // Email buyer
        try {
            $transaction->load(['listing', 'buyer', 'seller']);
            Mail::to($transaction->buyer->email)->send(new PaymentConfirmedMail($transaction));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('[Mail] PaymentConfirmedMail failed: ' . $e->getMessage());
        }

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

        try { broadcast(new TransactionStatusUpdated($transaction->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }

        Notification::create([
            'user_id' => $transaction->buyer_id,
            'type'    => 'item_packed',
            'title'   => '📦 Pesananmu Sedang Dipacking!',
            'body'    => "Penjual sedang menyiapkan barangmu. Tracking OshiGo: {$tracking}",
            'url'     => "/transactions/{$transaction->uuid}",
            'data'    => ['transaction_id' => $transaction->id, 'tracking' => $tracking],
        ]);

        // Email buyer
        try {
            $transaction->load(['listing', 'buyer', 'seller']);
            Mail::to($transaction->buyer->email)->send(new ItemPackedMail($transaction));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('[Mail] ItemPackedMail failed: ' . $e->getMessage());
        }

        return back()->with('success', "Barang dipacking! Nomor tracking OshiGo: {$tracking}");
    }

    /**
     * Seller marks as shipped → delivery_status: Shipped.
     */
    public function ship(Transaction $transaction): RedirectResponse
    {
        Gate::authorize('ship', $transaction);

        $transaction->update(['delivery_status' => 'Shipped']);

        try { broadcast(new TransactionStatusUpdated($transaction->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }

        Notification::itemShipped(
            $transaction->buyer_id,
            $transaction->id,
            $transaction->oshigo_tracking_number
        );

        // Email buyer
        try {
            $transaction->load(['listing', 'buyer', 'seller']);
            Mail::to($transaction->buyer->email)->send(new ItemShippedMail($transaction));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('[Mail] ItemShippedMail failed: ' . $e->getMessage());
        }

        return back()->with('success', 'Status diupdate: Dikirim!');
    }

    /**
     * Seller marks as out for delivery → delivery_status: OutForDelivery.
     */
    public function outForDelivery(Transaction $transaction): RedirectResponse
    {
        Gate::authorize('outForDelivery', $transaction);

        $transaction->update(['delivery_status' => 'OutForDelivery']);

        try { broadcast(new TransactionStatusUpdated($transaction->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }

        Notification::create([
            'user_id' => $transaction->buyer_id,
            'type'    => 'out_for_delivery',
            'title'   => '🚚 Barangmu Sedang Dalam Perjalanan!',
            'body'    => "Paketmu ({$transaction->oshigo_tracking_number}) sedang dalam perjalanan menuju alamatmu.",
            'url'     => "/transactions/{$transaction->uuid}",
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

        try { broadcast(new TransactionStatusUpdated($transaction->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }

        Notification::transactionCompleted($transaction->seller_id, $transaction->id);

        // Email seller
        try {
            $transaction->load(['listing', 'buyer', 'seller']);
            Mail::to($transaction->seller->email)->send(new TransactionCompletedMail($transaction));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('[Mail] TransactionCompletedMail failed: ' . $e->getMessage());
        }

        return back()->with('success', 'Transaksi selesai! Terima kasih.');
    }
}

