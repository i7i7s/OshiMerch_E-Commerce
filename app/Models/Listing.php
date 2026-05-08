<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'price',
        'condition',
        'status',
        'image_path',
        'featured_member_code',
        'featured_member_name',
        'featured_member_team',
    ];

    protected $casts = [
        'price' => 'integer',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    // ── Accessors ──────────────────────────────────────────────────────────────

    /**
     * Return the public URL of the listing image.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        return Storage::disk('public')->url($this->image_path);
    }

    // ── Scopes ─────────────────────────────────────────────────────────────────

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', 'Available');
    }

    public function scopeByTeam(Builder $query, ?string $team): Builder
    {
        if (! $team || $team === 'ALL') {
            return $query;
        }

        return $query->where('featured_member_team', $team);
    }

    public function scopeByCondition(Builder $query, ?string $condition): Builder
    {
        if (! $condition || $condition === 'ALL') {
            return $query;
        }

        return $query->where('condition', $condition);
    }

    public function scopeByCategory(Builder $query, ?string $category): Builder
    {
        if (! $category || $category === 'ALL') {
            return $query;
        }

        return $query->where('category', $category);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
              ->orWhere('featured_member_name', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%");
        });
    }

    public function scopeByPriceRange(Builder $query, ?int $min, ?int $max): Builder
    {
        if ($min !== null) {
            $query->where('price', '>=', $min);
        }
        if ($max !== null) {
            $query->where('price', '<=', $max);
        }

        return $query;
    }

    public function scopeSorted(Builder $query, string $sort = 'latest'): Builder
    {
        return match ($sort) {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            default      => $query->orderBy('created_at', 'desc'), // 'latest'
        };
    }
}
