<?php

namespace App\Events;

use App\Models\Transaction;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TransactionStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Transaction $transaction,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("transaction.{$this->transaction->id}"),
        ];
    }

    /**
     * Data to broadcast with the event.
     */
    public function broadcastWith(): array
    {
        return [
            'id'              => $this->transaction->id,
            'payment_status'  => $this->transaction->payment_status,
            'delivery_status' => $this->transaction->delivery_status,
            'shipping_resi'   => $this->transaction->shipping_resi,
            'proof_url'       => $this->transaction->proof_url,
        ];
    }
}
