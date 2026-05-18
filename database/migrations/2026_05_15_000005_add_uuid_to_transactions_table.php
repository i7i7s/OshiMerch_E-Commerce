<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        // Backfill UUIDs for existing rows
        DB::table('transactions')->whereNull('uuid')->get()->each(function ($row) {
            DB::table('transactions')
                ->where('id', $row->id)
                ->update(['uuid' => Str::uuid()]);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
