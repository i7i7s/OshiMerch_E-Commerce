<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function show($code)
    {
        // Get the listings associated with this member code
        $listings = Listing::with(['user' => function($q) {
                $q->select('id', 'name', 'profile_picture_url');
            }])
            ->where('featured_member_code', $code)
            ->latest()
            ->take(20) // Limit to recent ones for performance
            ->get();

        return Inertia::render('Members/Show', [
            'memberCode' => $code,
            'listings' => $listings,
            'apiUrl' => config('services.jkt48.api_url', 'https://jkt-48-member-api-i7i7.vercel.app'),
        ]);
    }
}
