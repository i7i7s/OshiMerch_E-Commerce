<?php

namespace App\Http\Controllers;

use App\Events\TransactionStatusUpdated;
use App\Models\Notification;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MidtransController extends Controller
{
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
                'payment_method' => $request->payment_type ?? $transaction->payment_method,
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

