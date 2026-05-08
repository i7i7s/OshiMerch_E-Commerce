<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category'); // photocard, lightstick, apparel, poster, album, keychain, towel, penlight
            $table->unsignedInteger('price');
            $table->string('condition')->default('Used'); // New, Used, Mint
            $table->string('status')->default('Available'); // Available, Reserved, Sold
            $table->string('image_path')->nullable(); // storage/app/public relative path
            // Denormalized member tag (from JKT48 API) for fast filtering
            $table->string('featured_member_code')->nullable();
            $table->string('featured_member_name')->nullable();
            $table->string('featured_member_team')->nullable(); // PASSION, LOVE, DREAM, TRAINEE, VIRTUAL
            $table->timestamps();

            // Indexes for common filter queries
            $table->index(['status', 'created_at']);
            $table->index('featured_member_team');
            $table->index('category');
            $table->index('condition');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
