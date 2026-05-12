<?php

namespace App\Events;

use App\Models\DirectMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DirectMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public DirectMessage $message,
        public int $conversationId,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("conversation.{$this->conversationId}"),
        ];
    }

    /**
     * Data to broadcast with the event.
     */
    public function broadcastWith(): array
    {
        $this->message->load('sender:id,name,profile_picture_url');

        return [
            'id'               => $this->message->id,
            'content'          => $this->message->content,
            'sender_id'        => $this->message->sender_id,
            'sender'           => $this->message->sender?->only(['id', 'name', 'profile_picture_url']),
            'created_at_human' => $this->message->created_at->diffForHumans(),
        ];
    }
}
