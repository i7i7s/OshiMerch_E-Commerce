<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Listing;
use App\Models\User;

class ListingPolicy
{
    public function before(User|Admin $user, string $ability): bool|null
    {
        if ($user instanceof Admin) {
            return true;
        }
        return null;
    }

    public function update(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }

    public function delete(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }
}
