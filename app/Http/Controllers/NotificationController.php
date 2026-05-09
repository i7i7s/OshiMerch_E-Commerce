<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * GET /api/notifications
     * Returns the latest 20 notifications for the authenticated user.
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['notifications' => [], 'unread_count' => 0]);
        }

        $notifications = Notification::forUser($user->id)
            ->latest()
            ->take(20)
            ->get()
            ->map(fn ($n) => [
                'id'         => $n->id,
                'type'       => $n->type,
                'title'      => $n->title,
                'body'       => $n->body,
                'url'        => $n->url,
                'data'       => $n->data,
                'is_read'    => $n->isRead(),
                'created_at' => $n->created_at->diffForHumans(),
            ]);

        $unreadCount = Notification::forUser($user->id)->unread()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ]);
    }

    /**
     * POST /api/notifications/{notification}/read
     * Mark a single notification as read.
     * Uses inline ownership check instead of policy to avoid Inertia
     * exception handler intercepting 403 responses.
     */
    public function markRead(Notification $notification): JsonResponse
    {
        $user = Auth::user();
        if (! $user || $user->id !== $notification->user_id) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * POST /api/notifications/read-all
     * Mark all notifications as read for authenticated user.
     */
    public function markAllRead(): JsonResponse
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['success' => false], 401);
        }

        Notification::forUser($user->id)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    /**
     * DELETE /api/notifications/{notification}
     * Delete a single notification.
     */
    public function destroy(Notification $notification): JsonResponse
    {
        $user = Auth::user();
        if (! $user || $user->id !== $notification->user_id) {
            return response()->json(['success' => false], 403);
        }

        $notification->delete();

        return response()->json(['success' => true]);
    }
}
