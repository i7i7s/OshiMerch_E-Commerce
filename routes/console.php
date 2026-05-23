<?php

use App\Console\Commands\CancelExpiredPayments;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Auto-cancel transactions whose payment deadline has passed (runs every 5 minutes)
Schedule::command(CancelExpiredPayments::class)->everyFiveMinutes();
