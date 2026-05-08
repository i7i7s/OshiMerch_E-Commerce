<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class MessageController extends Controller
{
    public function store(Request $request, Transaction $transaction): RedirectResponse
    {
        Gate::authorize('view', $transaction);

        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $transaction->messages()->create([
            'sender_id' => Auth::id(),
            'content'   => $request->content,
        ]);

        return back();
    }
}
