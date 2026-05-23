<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Review extends Model
{
    protected $fillable = [
        'transaction_id',
        'reviewer_id',
        'seller_id',
        'rating',
        'comment',
        'photo_paths',
    ];

    protected $casts = [
        'photo_paths' => 'array',
    ];

    public function getPhotoUrlsAttribute(): array
    {
        if (empty($this->photo_paths)) return [];
        return array_map(
            fn ($path) => Storage::disk('public')->url($path),
            $this->photo_paths
        );
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
