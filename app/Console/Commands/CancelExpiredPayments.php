<?php

namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\Transaction;
use Illuminate\Console\Command;

class CancelExpiredPayments extends Command
{
    protected $signature   = 'app:cancel-expired-payments';
    protected $description = 'Auto-cancel transactions whose payment deadline has passed';

    public function handle(): void
    {
        $expired = Transaction::where('payment_status', 'Pending')
            ->whereNotNull('payment_deadline')
            ->where('payment_deadline', '<', now())
            ->with('listing')
            ->get();

        foreach ($expired as $transaction) {
            $transaction->update(['payment_status' => 'Cancelled']);

            // Return listing to Available if it was reserved for this transaction
            if ($transaction->listing && $transaction->listing->status === 'Reserved') {
                $transaction->listing->update(['status' => 'Available']);
            }

            // Notify buyer
            Notification::create([
                'user_id' => $transaction->buyer_id,
                'type'    => 'payment_expired',
                'title'   => '⏰ Transaksi Dibatalkan Otomatis',
                'body'    => 'Tenggat waktu pembayaran telah habis. Transaksimu telah dibatalkan dan barang kembali tersedia.',
                'url'     => "/transactions/{$transaction->uuid}",
                'data'    => ['transaction_id' => $transaction->id],
            ]);
        }

        $count = $expired->count();
        $this->info("Cancelled {$count} expired transaction(s).");
    }
}
