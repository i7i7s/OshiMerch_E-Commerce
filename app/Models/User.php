<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'twitter_id',
        'profile_picture_url',
        'oshi_member_code',
        'oshi_member_name',
        'bio',
        'phone',
        'addresses',
        'default_address_index',
        'role',
        'onboarding_completed',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'    => 'datetime',
            'password'             => 'hashed',
            'onboarding_completed' => 'boolean',
            'addresses'            => 'array',
            'default_address_index'=> 'integer',
        ];
    }

    /**
     * Check if user has completed onboarding (selected their oshi).
     */
    public function hasCompletedOnboarding(): bool
    {
        return $this->onboarding_completed && $this->oshi_member_code !== null;
    }

    /**
     * Listings posted by this user.
     */
    public function listings(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Listing::class);
    }

    public function purchasedTransactions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Transaction::class, 'buyer_id');
    }

    public function soldTransactions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Transaction::class, 'seller_id');
    }

    /**
     * Reviews received as a seller.
     */
    public function reviewsReceived(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Review::class, 'seller_id');
    }

    /**
     * Reviews written by this user.
     */
    public function reviewsGiven(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    /**
     * Average seller rating.
     */
    public function getAverageRatingAttribute(): ?float
    {
        $avg = $this->reviewsReceived()->avg('rating');
        return $avg ? round($avg, 1) : null;
    }

    /**
     * Available listings (for public seller profile).
     */
    public function availableListings(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Listing::class)->where('status', 'Available');
    }

    /**
     * Return the profile picture URL, supporting:
     * - Full http/https URLs (Google OAuth avatars)
     * - Old format with leading /storage/ prefix (legacy data)
     * - Plain storage-relative paths (new format, e.g. profiles/xxx.jpg)
     */
    public function getProfilePictureUrlAttribute(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        // Already a full URL (Google/Twitter avatar)
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        // Legacy format stored with /storage/ prefix — strip it and serve via Storage
        if (str_starts_with($value, '/storage/')) {
            $path = ltrim(substr($value, strlen('/storage/')), '/');
            return Storage::disk('public')->url($path);
        }

        // New format: plain relative path (e.g. profiles/xxx.jpg)
        return Storage::disk('public')->url($value);
    }
}
