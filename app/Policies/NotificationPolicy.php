<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Notification;
use App\Models\User;

class NotificationPolicy
{
    public function before(User|Admin $user, string $ability): bool|null
    {
        if ($user instanceof Admin) {
            return true;
        }
        return null;
    }

    public function update(User $user, Notification $notification): bool
    {
        return $user->id === $notification->user_id;
    }

    public function delete(User $user, Notification $notification): bool
    {
        return $user->id === $notification->user_id;
    }
}
