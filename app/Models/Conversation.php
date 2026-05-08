<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = ['user1_id', 'user2_id'];

    public function user1() { return $this->belongsTo(User::class, 'user1_id'); }
    public function user2() { return $this->belongsTo(User::class, 'user2_id'); }

    public function directMessages()
    {
        return $this->hasMany(DirectMessage::class)->orderBy('created_at');
    }

    /** Get the other participant given current user id */
    public function otherUser(int $currentUserId): User
    {
        return $this->user1_id === $currentUserId ? $this->user2 : $this->user1;
    }

    /** Find existing conversation between two users (order-insensitive) */
    public static function between(int $a, int $b): ?self
    {
        return self::where(fn ($q) => $q->where('user1_id', $a)->where('user2_id', $b))
            ->orWhere(fn ($q) => $q->where('user1_id', $b)->where('user2_id', $a))
            ->first();
    }
}
