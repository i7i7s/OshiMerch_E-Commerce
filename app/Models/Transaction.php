<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Transaction extends Model
{
    protected $fillable = [
        'buyer_id',
        'seller_id',
        'listing_id',
        'item_price',
        'payment_method',
        'shipping_address',
        'shipping_province',
        'shipping_city',
        'shipping_district',
        'shipping_fee',
        'recipient_name',
        'recipient_phone',
        'proof_of_transfer_path',
        'shipping_resi',
        'oshigo_tracking_number',
        'payment_status',
        'delivery_status',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    public function getProofUrlAttribute(): ?string
    {
        if (! $this->proof_of_transfer_path) {
            return null;
        }
        return Storage::disk('public')->url($this->proof_of_transfer_path);
    }
}
