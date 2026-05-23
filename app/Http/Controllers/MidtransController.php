<?php

namespace App\Http\Controllers;

use App\Events\TransactionStatusUpdated;
use App\Models\Notification;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class MidtransController extends Controller
{
    /**
     * Handle Midtrans finish redirect after Snap payment.
     * User is redirected here after completing/closing payment popup.
     */
    public function finishRedirect(string $uuid): RedirectResponse
    {
        $transaction = Transaction::where('uuid', $uuid)->firstOrFail();

        // Authorize: only buyer can access
        if (Auth::id() !== $transaction->buyer_id) {
            abort(403, 'Unauthorized');
        }

        // Query Midtrans API to get latest transaction status
        if ($transaction->midtrans_order_id) {
            try {
                \Midtrans\Config::$serverKey    = config('services.midtrans.server_key');
                \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
                \Midtrans\Config::$isSanitized  = true;
                \Midtrans\Config::$is3ds        = true;

                $status = \Midtrans\Transaction::status($transaction->midtrans_order_id);

                // If status is success & DB not updated yet, update it
                if (($status->transaction_status === 'settlement' || 
                     ($status->transaction_status === 'capture' && $status->fraud_status === 'accept')) &&
                    $transaction->payment_status !== 'Confirmed') {
                    
                    $transaction->update(['payment_status' => 'Confirmed', 'ship_deadline' => now()->addDays(3)]);
                    try { broadcast(new TransactionStatusUpdated($transaction->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }
                }
            } catch (\Exception $e) {
                // Log but don't fail — webhook will handle eventually
                \Illuminate\Support\Facades\Log::warning('[Midtrans finish redirect] Status check failed: ' . $e->getMessage());
            }
        }

        // Redirect back to transaction page (will show updated status or poll until webhook processes)
        return redirect()->route('transactions.show', $transaction->uuid);
    }
    /**
     * Handle Midtrans payment notification webhook.
     * This route must be excluded from CSRF middleware.
     */
    public function webhook(Request $request): JsonResponse
    {
        // 1. Verify Midtrans signature
        $serverKey   = config('services.midtrans.server_key');
        $orderId     = $request->order_id;
        $statusCode  = $request->status_code;
        $grossAmount = $request->gross_amount;
        $validSig    = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if ($validSig !== $request->signature_key) {
            return response()->json(['status' => 'invalid signature'], 403);
        }

        // 2. Parse transaction ID from order_id (format: OM-{id}-{timestamp})
        $parts         = explode('-', $orderId);
        $transactionId = $parts[1] ?? null;

        if (! $transactionId) {
            return response()->json(['status' => 'invalid order_id'], 400);
        }

        $transaction = Transaction::find($transactionId);

        if (! $transaction) {
            return response()->json(['status' => 'transaction not found'], 404);
        }

        // 3. Handle different Midtrans statuses
        $status = $request->transaction_status;

        // For 'capture' (credit card), also check fraud_status
        $fraudStatus = $request->fraud_status;
        $isPaymentSuccess = $status === 'settlement' ||
            ($status === 'capture' && $fraudStatus === 'accept');

        if ($isPaymentSuccess) {
            // Payment successful — update payment_status and payment_method
            $transaction->update([
                'payment_status'    => 'Confirmed',
                'midtrans_order_id' => $orderId,
                'payment_method'    => $request->payment_type ?? $transaction->payment_method,
                'ship_deadline'     => now()->addDays(3),
            ]);

            // Broadcast real-time status update via Reverb
            try { broadcast(new TransactionStatusUpdated($transaction->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }

            // Notify buyer
            Notification::create([
                'user_id' => $transaction->buyer_id,
                'type'    => 'payment_confirmed',
                'title'   => '✅ Pembayaran Terkonfirmasi!',
                'body'    => 'Midtrans telah memverifikasi pembayaranmu. Seller akan segera menyiapkan pesananmu.',
                'url'     => "/transactions/{$transaction->uuid}",
                'data'    => ['transaction_id' => $transaction->id],
            ]);

            // Notify seller
            Notification::create([
                'user_id' => $transaction->seller_id,
                'type'    => 'transaction_paid',
                'title'   => '💰 Pembayaran Terverifikasi!',
                'body'    => 'Midtrans telah mengkonfirmasi pembayaran. Silakan siapkan pesanan untuk dikirim.',
                'url'     => "/transactions/{$transaction->uuid}",
                'data'    => ['transaction_id' => $transaction->id],
            ]);
        } elseif (in_array($status, ['expire', 'cancel', 'deny'])) {
            // Payment failed/expired — mark back to Pending (or optionally cancel)
            // For now: leave as Pending so buyer can retry
            // Optional: broadcast update so frontend can show "payment failed" message
        }

        // Midtrans requires HTTP 200 response
        return response()->json(['status' => 'ok']);
    }
}

