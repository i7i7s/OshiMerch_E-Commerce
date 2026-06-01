<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class JKT48FritzyGraceSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::where('email', 'vincutinestory@gmail.com')->first();

        if (! $seller) {
            $this->command->error('User vincutinestory@gmail.com not found!');
            return;
        }

        $this->command->info("Seller: {$seller->name} (ID {$seller->id})");

        $listings = [
            // ── FRITZY ──────────────────────────────────────────────────────
            [
                'title'       => 'Photocard Official JKT48 Meet & Greet ALL IN TOUR 2025 - Fritzy Rosmerian',
                'price'       => 60000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c82d0e11defec3650b42618b100cdb06cec1283c.jpg',
                'member_code' => 'fritzy',
                'member_name' => 'Fritzy Rosmerian',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 Road To Sousenkyo 2024 (RTS) - Fritzy Rosmerian',
                'price'       => 60000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/8f5ca62f7637ebb3213114584230637f451f4039.jpg',
                'member_code' => 'fritzy',
                'member_name' => 'Fritzy Rosmerian',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 Sister Reunion x AKB48 2025 - Fritzy Rosmerian (Oh My Pumpkin)',
                'price'       => 80000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/824360a4dd98b94defa9bcf119919dd7a14ee697.jpg',
                'member_code' => 'fritzy',
                'member_name' => 'Fritzy Rosmerian',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photopack Official JKT48 Wonderland 13th Anniversary Concert - Fritzy Rosmerian',
                'price'       => 32000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/1f718f11264632b06085de34348f6277454588d5.jpg',
                'member_code' => 'fritzy',
                'member_name' => 'Fritzy Rosmerian',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 Digital Photobook The First Snow - Fritzy Rosmerian',
                'price'       => 55000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/12dfc897291fd44f35f70397d22127e3699ad3ae.jpg',
                'member_code' => 'fritzy',
                'member_name' => 'Fritzy Rosmerian',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Birthday T-Shirt (BDTS) JKT48 - Fritzy Rosmerian',
                'price'       => 40000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/89538e392632aa287dbd24786d70871bb4c54c79.jpg',
                'member_code' => 'fritzy',
                'member_name' => 'Fritzy Rosmerian',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 Spring Has Come (SHC) - Fritzy Rosmerian',
                'price'       => 50000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/3a6de0b95d952e10f0ff8ea77b7a85f35f0a2c97.jpg',
                'member_code' => 'fritzy',
                'member_name' => 'Fritzy Rosmerian',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 Calendar 2025 - A Gaze of Dream - Fritzy Rosmerian',
                'price'       => 45000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/995642cbea25bd3dd316844ab381892d71066f43.jpg',
                'member_code' => 'fritzy',
                'member_name' => 'Fritzy Rosmerian',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Bundling Photocard Official JKT48 Road To Sousenkyo (RTS) - Fritzy Rosmerian & Grace Oktaviani',
                'price'       => 100000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/8f5ca62f7637ebb3213114584230637f451f4039.jpg',
                'member_code' => 'fritzy',
                'member_name' => 'Fritzy Rosmerian',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photopack Official JKT48 All In Tour 2025 - Fritzy Rosmerian',
                'price'       => 85000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c82d0e11defec3650b42618b100cdb06cec1283c.jpg',
                'member_code' => 'fritzy',
                'member_name' => 'Fritzy Rosmerian',
                'team'        => 'LOVE',
            ],
            // ── GRACE ───────────────────────────────────────────────────────
            [
                'title'       => 'Photocard Official JKT48 Meet & Greet ALL IN TOUR 2025 - Grace Oktaviani (Gracie)',
                'price'       => 55000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/03fe531537e7fc7bc57b16e4ab5052e0b06461e9.jpg',
                'member_code' => 'gracie',
                'member_name' => 'Grace Oktaviani',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 Road To Sousenkyo 2024 (RTS) - Grace Oktaviani (Gracie)',
                'price'       => 55000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/a7b5d3ea52497b0d3f240c1d6b6dda3abdf7a816.jpg',
                'member_code' => 'gracie',
                'member_name' => 'Grace Oktaviani',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 Spring Has Come (SHC) - Grace Oktaviani (Gracie)',
                'price'       => 40000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/3a6de0b95d952e10f0ff8ea77b7a85f35f0a2c97.jpg',
                'member_code' => 'gracie',
                'member_name' => 'Grace Oktaviani',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 MnG Theater Sementara - Grace Oktaviani (Gracie)',
                'price'       => 45000,
                'image_url'   => null, // bad URL in source data
                'member_code' => 'gracie',
                'member_name' => 'Grace Oktaviani',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photopack Official JKT48 Wonderland 13th Anniversary Concert - Grace Oktaviani (Gracie)',
                'price'       => 35000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/994642cbea25bd3dd316844ab381892d71066f43.jpg',
                'member_code' => 'gracie',
                'member_name' => 'Grace Oktaviani',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Bundling Photocard Official JKT48 Road To Sousenkyo (RTS) - Grace Oktaviani & Fritzy Rosmerian',
                'price'       => 100000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/8f5ca62f7637ebb3213114584230637f451f4039.jpg',
                'member_code' => 'gracie',
                'member_name' => 'Grace Oktaviani',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 Calendar 2025 - A Gaze of Dream - Grace Oktaviani',
                'price'       => 45000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/994642cbea25bd3dd316844ab381892d71066f43.jpg',
                'member_code' => 'gracie',
                'member_name' => 'Grace Oktaviani',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 ALL IN TOUR 2025 (Full Set Display) - Grace Oktaviani',
                'price'       => 55000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/6af6ae49cebaa3060a64d665bc11b6d266ccec27.jpg',
                'member_code' => 'gracie',
                'member_name' => 'Grace Oktaviani',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 Sister Reunion x AKB48 2025 - Grace Oktaviani (Gracie)',
                'price'       => 55000,
                'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/b9d466d3a199043a403e5b533cdf52673f1ae7d0.jpg',
                'member_code' => 'gracie',
                'member_name' => 'Grace Oktaviani',
                'team'        => 'LOVE',
            ],
            [
                'title'       => 'Photocard Official JKT48 ALL IN TOUR 2025 Full Display Collection - Grace Oktaviani',
                'price'       => 65000,
                'image_url'   => null, // bad URL in source data
                'member_code' => 'gracie',
                'member_name' => 'Grace Oktaviani',
                'team'        => 'LOVE',
            ],
        ];

        $imageCache = [];
        $created    = 0;
        $skipped    = 0;

        foreach ($listings as $data) {
            if (Listing::where('title', $data['title'])->exists()) {
                $this->command->line("  ⏭ Skipped: \"{$data['title']}\"");
                $skipped++;
                continue;
            }

            $imagePath = null;

            if ($data['image_url']) {
                $url = $data['image_url'];

                if (isset($imageCache[$url])) {
                    $imagePath = $imageCache[$url];
                } else {
                    $this->command->line("  ↓ Downloading: " . substr($url, 0, 90) . '...');
                    try {
                        $response = Http::timeout(20)
                            ->withHeaders(['User-Agent' => 'Mozilla/5.0 OshiMerch-Seeder/1.0'])
                            ->get($url);

                        if ($response->successful()) {
                            $filename = 'listings/' . Str::uuid() . '.jpg';
                            Storage::disk('public')->put($filename, $response->body());
                            $imagePath            = $filename;
                            $imageCache[$url]     = $filename;
                            $this->command->line("  ✓ Saved: {$filename}");
                        } else {
                            $this->command->warn("  ✗ Failed to download (HTTP {$response->status()}): {$url}");
                        }
                    } catch (\Exception $e) {
                        $this->command->warn("  ✗ Error downloading: {$e->getMessage()}");
                    }
                }
            }

            Listing::create([
                'user_id'               => $seller->id,
                'title'                 => $data['title'],
                'description'           => $data['title'] . '. Kondisi baru, original, resmi dari event JKT48. Dijual oleh Vincutine Story.',
                'category'              => 'photocard',
                'price'                 => $data['price'],
                'condition'             => 'New',
                'status'                => 'Available',
                'image_path'            => $imagePath,
                'featured_member_code'  => $data['member_code'],
                'featured_member_name'  => $data['member_name'],
                'featured_member_team'  => $data['team'],
            ]);

            $this->command->info("  ✓ Created: \"{$data['title']}\" → user ID {$seller->id}");
            $created++;
        }

        $this->command->newLine();
        $this->command->info("Done! {$created} listings created, {$skipped} skipped.");
    }
}
