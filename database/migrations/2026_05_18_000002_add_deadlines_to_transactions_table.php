<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->timestamp('payment_deadline')->nullable()->after('midtrans_order_id');
            $table->timestamp('ship_deadline')->nullable()->after('payment_deadline');
        });

        // Add 'Cancelled' to payment_status enum
        DB::statement("ALTER TABLE transactions MODIFY COLUMN payment_status ENUM('Pending','Paid','Confirmed','Failed','Cancelled') NOT NULL DEFAULT 'Pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE transactions MODIFY COLUMN payment_status ENUM('Pending','Paid','Confirmed','Failed') NOT NULL DEFAULT 'Pending'");

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['payment_deadline', 'ship_deadline']);
        });
    }
};
