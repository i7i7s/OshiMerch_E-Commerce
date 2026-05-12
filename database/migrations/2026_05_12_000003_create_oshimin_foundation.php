<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create admins table (separate from users)
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Add banned_at to users
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('banned_at')->nullable()->after('updated_at');
        });

        // 3. Add 'Hidden' to listings status enum
        DB::statement("ALTER TABLE listings MODIFY COLUMN status ENUM('Available','Reserved','Sold','Hidden') NOT NULL DEFAULT 'Available'");

        // 4. Create settings table (key-value store for admin-managed config)
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');

        DB::statement("ALTER TABLE listings MODIFY COLUMN status ENUM('Available','Reserved','Sold') NOT NULL DEFAULT 'Available'");

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('banned_at');
        });

        Schema::dropIfExists('admins');
    }
};
