<?php

namespace App\Mail;

use App\Models\Review;
use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Transaction $transaction,
        public string $reviewerName,
        public int $rating,
        public ?string $comment
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address('adminoshimerch@oshimerch.store', 'OshiMerch')],
            subject: '⭐ Kamu Mendapat Ulasan Baru – OshiMerch',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.review-received',
        );
    }
}
