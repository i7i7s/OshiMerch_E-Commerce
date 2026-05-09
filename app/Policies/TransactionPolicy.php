<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function view(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->buyer_id || $user->id === $transaction->seller_id;
    }

    public function uploadProof(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->buyer_id
            && $transaction->payment_status === 'Pending';
    }

    /**
     * Seller confirms that the buyer's payment proof is valid.
     * Future: when payment gateway is integrated, this step is skipped
     *         (gateway webhook sets payment_status → 'Confirmed' directly).
     */
    public function confirmPayment(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->seller_id
            && $transaction->payment_status === 'Paid';
    }

    /**
     * Seller can only input resi AFTER payment is confirmed (Opsi B).
     */
    public function ship(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->seller_id
            && $transaction->payment_status === 'Confirmed'
            && $transaction->delivery_status === 'Pending';
    }

    public function complete(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->buyer_id
            && $transaction->delivery_status === 'Shipped';
    }
}
