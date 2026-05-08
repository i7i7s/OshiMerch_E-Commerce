<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('bio');
            $table->json('addresses')->nullable()->after('phone'); // stored as JSON array
            $table->string('default_address_index')->default('0')->after('addresses');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'addresses', 'default_address_index']);
        });
    }
};
