<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewNotification implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Notification $notification,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("notifications.{$this->notification->user_id}"),
        ];
    }

    /**
     * Data to broadcast with the event.
     */
    public function broadcastWith(): array
    {
        return [
            'id'         => $this->notification->id,
            'type'       => $this->notification->type,
            'title'      => $this->notification->title,
            'body'       => $this->notification->body,
            'url'        => $this->notification->url,
            'data'       => $this->notification->data,
            'is_read'    => false,
            'created_at' => $this->notification->created_at->diffForHumans(),
        ];
    }
}
