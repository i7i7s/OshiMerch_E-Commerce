<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // payment_method sekarang nullable karena Midtrans yang handle pembayaran
            // method akan diupdate oleh webhook setelah payment berhasil
            $table->string('payment_method')->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('payment_method')->nullable(false)->change();
        });
    }
};
