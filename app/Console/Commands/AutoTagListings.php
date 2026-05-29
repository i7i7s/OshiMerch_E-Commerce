<?php

namespace App\Console\Commands;

use App\Models\Listing;
use App\Services\MemberAutoTagService;
use Illuminate\Console\Command;

class AutoTagListings extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'listings:auto-tag
                            {--all : Re-process all listings, including those already tagged}';

    /**
     * The console command description.
     */
    protected $description = 'Auto-tag listings with member data based on their title and description';

    public function handle(MemberAutoTagService $tagger): int
    {
        $reprocessAll = $this->option('all');

        $query = Listing::query();

        if (! $reprocessAll) {
            $query->whereNull('featured_member_code');
        }

        $total   = $query->count();
        $tagged  = 0;
        $skipped = 0;

        if ($total === 0) {
            $this->info('No listings to process.');
            return self::SUCCESS;
        }

        $mode = $reprocessAll ? 'all listings' : 'untagged listings only';
        $this->info("Processing {$total} {$mode}...");
        $this->newLine();

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $query->chunkById(50, function ($listings) use ($tagger, &$tagged, &$skipped, $bar) {
            foreach ($listings as $listing) {
                $match = $tagger->detect($listing->title ?? '', $listing->description ?? '');

                if ($match) {
                    $listing->update([
                        'featured_member_code' => $match['code'],
                        'featured_member_name' => $match['name'],
                        'featured_member_team' => $match['team'],
                    ]);
                    $tagged++;
                } else {
                    $skipped++;
                }

                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine(2);

        $this->table(
            ['Result', 'Count'],
            [
                ['Tagged', $tagged],
                ['No match found', $skipped],
                ['Total processed', $total],
            ]
        );

        return self::SUCCESS;
    }
}
