<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: expand enum temporarily to allow both old and new values
        DB::statement("ALTER TABLE transactions MODIFY COLUMN delivery_status ENUM('Pending','Packed','Shipped','OutForDelivery','Completed','Delivered') NOT NULL DEFAULT 'Pending'");

        // Step 2: migrate existing 'Completed' rows → 'Delivered'
        DB::table('transactions')->where('delivery_status', 'Completed')->update(['delivery_status' => 'Delivered']);

        // Step 3: lock enum to final set (removes 'Completed')
        DB::statement("ALTER TABLE transactions MODIFY COLUMN delivery_status ENUM('Pending','Packed','Shipped','OutForDelivery','Delivered') NOT NULL DEFAULT 'Pending'");

        // Step 4: add tracking number column
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('oshigo_tracking_number')->nullable()->after('shipping_resi');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('oshigo_tracking_number');
        });

        // Restore old enum (keep all values during rollback)
        DB::statement("ALTER TABLE transactions MODIFY COLUMN delivery_status ENUM('Pending','Packed','Shipped','OutForDelivery','Delivered','Completed') NOT NULL DEFAULT 'Pending'");
        DB::table('transactions')->where('delivery_status', 'Delivered')->update(['delivery_status' => 'Completed']);
        DB::statement("ALTER TABLE transactions MODIFY COLUMN delivery_status ENUM('Pending','Shipped','Completed') NOT NULL DEFAULT 'Pending'");
    }
};
