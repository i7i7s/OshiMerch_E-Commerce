<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function before(User|Admin $user, string $ability): bool|null
    {
        if ($user instanceof Admin) {
            return true;
        }
        return null;
    }

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
     * Payment confirmation is now handled exclusively by admin via the Filament panel.
     * The web route is disabled — always return false.
     */
    public function confirmPayment(User $user, Transaction $transaction): bool
    {
        return false;
    }

    /**
     * Seller can only input resi AFTER payment is confirmed (Opsi B).
     */
    public function pack(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->seller_id
            && $transaction->payment_status === 'Confirmed'
            && $transaction->delivery_status === 'Pending';
    }

    public function ship(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->seller_id
            && $transaction->delivery_status === 'Packed';
    }

    public function outForDelivery(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->seller_id
            && $transaction->delivery_status === 'Shipped';
    }

    public function complete(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->buyer_id
            && $transaction->delivery_status === 'OutForDelivery';
    }
}
