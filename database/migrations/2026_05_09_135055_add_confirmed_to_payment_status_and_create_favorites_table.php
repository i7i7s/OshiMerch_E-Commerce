<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── 1. Extend payment_status enum to include 'Confirmed' ──────────────
        // MySQL requires modifying the column via raw SQL for enum changes.
        DB::statement("ALTER TABLE transactions MODIFY COLUMN payment_status ENUM('Pending','Paid','Confirmed','Failed') NOT NULL DEFAULT 'Pending'");

        // ── 2. Create favorites table ─────────────────────────────────────────
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'listing_id']); // prevent duplicates
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
        DB::statement("ALTER TABLE transactions MODIFY COLUMN payment_status ENUM('Pending','Paid','Failed') NOT NULL DEFAULT 'Pending'");
    }
};
