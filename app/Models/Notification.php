<?php

namespace App\Models;

use App\Events\NewNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'body',
        'url',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data'    => 'array',
        'read_at' => 'datetime',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────────

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────────

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    public function markAsRead(): void
    {
        if (! $this->isRead()) {
            $this->update(['read_at' => now()]);
        }
    }

    /** Broadcast silently — don't fail the whole request if Reverb is down. */
    private static function safeBroadcast(self $notification): void
    {
        try {
            broadcast(new NewNotification($notification));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('[Notification] Broadcast failed: ' . $e->getMessage());
        }
    }

    // ─── Static Factory Methods ───────────────────────────────────────────────────
    // These are the "notification events" OshiMerch will trigger.

    public static function transactionPaid(int $userId, int $transactionId, string $buyerName): self
    {
        $notification = self::create([
            'user_id' => $userId,
            'type'    => 'transaction_paid',
            'title'   => '💰 Pesanan Baru Masuk!',
            'body'    => "{$buyerName} telah membayar pesanannya. Segera siapkan barang untuk dikirim.",
            'url'     => "/dashboard",
            'data'    => ['transaction_id' => $transactionId],
        ]);

        self::safeBroadcast($notification);

        return $notification;
    }

    public static function itemShipped(int $userId, int $transactionId, string $trackingNumber): self
    {
        $notification = self::create([
            'user_id' => $userId,
            'type'    => 'item_shipped',
            'title'   => '📦 Barangmu Dikirim!',
            'body'    => "Penjual telah menginput resi pengiriman. No. Resi: {$trackingNumber}",
            'url'     => "/dashboard",
            'data'    => ['transaction_id' => $transactionId, 'tracking_number' => $trackingNumber],
        ]);

        self::safeBroadcast($notification);

        return $notification;
    }

    public static function transactionCompleted(int $userId, int $transactionId): self
    {
        $notification = self::create([
            'user_id' => $userId,
            'type'    => 'transaction_completed',
            'title'   => '✅ Transaksi Selesai!',
            'body'    => "Dana dari transaksi telah masuk ke akun kamu.",
            'url'     => "/dashboard",
            'data'    => ['transaction_id' => $transactionId],
        ]);

        self::safeBroadcast($notification);

        return $notification;
    }

    public static function newMessage(int $userId, string $senderName, int $conversationId, int $senderId): self
    {
        $notification = self::create([
            'user_id' => $userId,
            'type'    => 'new_message',
            'title'   => '💬 Pesan Baru',
            'body'    => "{$senderName} mengirimkan pesan kepadamu.",
            'url'     => "/chat/with/{$senderId}",
            'data'    => ['conversation_id' => $conversationId, 'sender_id' => $senderId],
        ]);

        self::safeBroadcast($notification);

        return $notification;
    }

    public static function newListing(int $userId, string $memberName): self
    {
        $notification = self::create([
            'user_id' => $userId,
            'type'    => 'new_listing',
            'title'   => '🌟 Merch Baru Tersedia!',
            'body'    => "Ada listing merchandise {$memberName} baru yang mungkin kamu suka.",
            'url'     => "/products",
            'data'    => ['member_name' => $memberName],
        ]);

        self::safeBroadcast($notification);

        return $notification;
    }

    public static function reviewReceived(int $userId, int $transactionId, string $reviewerName): self
    {
        $notification = self::create([
            'user_id' => $userId,
            'type'    => 'review_received',
            'title'   => '⭐ Ulasan Baru Masuk!',
            'body'    => "{$reviewerName} memberikan ulasan untuk transaksimu.",
            'url'     => "/dashboard",
            'data'    => ['transaction_id' => $transactionId],
        ]);

        self::safeBroadcast($notification);

        return $notification;
    }
}
