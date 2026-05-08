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

    public function ship(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->seller_id
            && $transaction->payment_status === 'Paid'
            && $transaction->delivery_status === 'Pending';
    }

    public function complete(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->buyer_id
            && $transaction->delivery_status === 'Shipped';
    }
}
