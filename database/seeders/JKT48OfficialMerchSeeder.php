<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class JKT48OfficialMerchSeeder extends Seeder
{
    private array $sellerEmails = [
        'rizkypratama12@gmail.com',
        'dindaaprilia88@mail.com',
        'fadhilramadhan21@yahoo.com',
        'naylasyifa77@gmail.com',
        'bagaswira04@mail.com',
    ];

    private array $products = [
        [
            'title'       => 'Birthday T-Shirt JKT48 - Gendis Mayrannisa 2026 (Pre-Order)',
            'description' => 'Kaos ulang tahun eksklusif yang didesain sendiri oleh Gendis Mayrannisa. Termasuk Birthday Card member. Pre-Order terbatas, stok habis setiap rilis. Bahan Cotton Combed berkualitas, desain limited edition.',
            'category'    => 'apparel',
            'price'       => 225000,
            'condition'   => 'New',
            'member_name' => 'Gendis Mayrannisa',
            'member_code' => 'GENDIS_MAYRANNISA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/dc43dd0ec95cb77cb09c847f806fbf5be039d646.jpg',
        ],
        [
            'title'       => 'Birthday T-Shirt JKT48 - Helisma Putri 2026 (Pre-Order)',
            'description' => 'Kaos ulang tahun eksklusif Helisma Putri 2026. Pre-Order dimulai 3 Mei 2026. Termasuk Birthday Card. Bahan Cotton Combed berkualitas, desain original dari member.',
            'category'    => 'apparel',
            'price'       => 225000,
            'condition'   => 'New',
            'member_name' => 'Helisma Putri',
            'member_code' => 'HELISMA_PUTRI',
            'member_team' => 'LOVE',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/dc43dd0ec95cb77cb09c847f806fbf5be039d646.jpg',
        ],
        [
            'title'       => 'Birthday T-Shirt JKT48 - Mutiara Azzahra 2026',
            'description' => 'Birthday T-Shirt Mutiara Azzahra (Muthe) edisi 2026. Seri pre-order eksklusif tiap bulan untuk masing-masing member. Stok terbatas, buruan order!',
            'category'    => 'apparel',
            'price'       => 225000,
            'condition'   => 'New',
            'member_name' => 'Mutiara Azzahra',
            'member_code' => 'MUTIARA_AZZAHRA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/dc43dd0ec95cb77cb09c847f806fbf5be039d646.jpg',
        ],
        [
            'title'       => 'Photocard JKT48 ALL IN TOUR - Raja Hati 2025 (Official)',
            'description' => 'Photocard official JKT48 edisi ALL IN TOUR Raja Hati 2025. Rating 5.0 dengan 250+ terjual di marketplace. Collectible item resmi dari konser nasional.',
            'category'    => 'photocard',
            'price'       => 55000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4c5276f6a936683bfcd82de0781aa74acd0be90b.jpg',
        ],
        [
            'title'       => 'Photopack Official JKT48 - Sister Reunion Meet & Greet Festival 2025',
            'description' => 'Photopack official Sister Reunion Meet & Greet Festival 2025. Tersedia untuk member: Delynn, Kimmy, Nayla, Cathy, Elin, Olla, Helisma, Fiony, Amanda, Lana. Koleksi eksklusif event spesial.',
            'category'    => 'photocard',
            'price'       => 55000,
            'condition'   => 'New',
            'member_name' => 'Fiony Alveria',
            'member_code' => 'FIONY_ALVERIA',
            'member_team' => 'LOVE',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/5973087ded4af731a54b75ebad88dc9c6910f603.jpg',
        ],
        [
            'title'       => 'Photocard PC Official Birthday T-Shirt BDTS 2026 - Marsha Lenathea',
            'description' => 'Photocard bonus resmi yang disertakan dalam pembelian Birthday T-Shirt Marsha Lenathea 2026. Juga tersedia dijual terpisah. Kondisi brand new, belum dibuka.',
            'category'    => 'photocard',
            'price'       => 40000,
            'condition'   => 'New',
            'member_name' => 'Marsha Lenathea',
            'member_code' => 'MARSHA_LENATHEA',
            'member_team' => 'PASSION',
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4c5276f6a936683bfcd82de0781aa74acd0be90b.jpg',
        ],
        [
            'title'       => 'Photopack Official JKT48 Edisi Kalender 2026 - Freckles Reckless',
            'description' => 'Edisi spesial photopack bundling kalender 2026 bertema Freckles Reckless. Koleksi eksklusif dari JKT48 Official Store. Stok sangat terbatas pasca pre-order.',
            'category'    => 'photocard',
            'price'       => 225000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/39ca8a166da12a23333913a050ee6c2816137b88.jpg',
        ],
        [
            'title'       => 'Lightstick JKT48 New Era 2.0 (Official)',
            'description' => 'Lightstick official JKT48 New Era 2.0 dengan fitur 15 warna RGB yang bisa dikontrol secara wireless dari jarak jauh. Diperkenalkan saat ALL IN TOUR 2025. Wajib punya buat konser! Stok sering habis di official store.',
            'category'    => 'lightstick',
            'price'       => 280000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/f811321372d233b369da783f616ffb856ce0fc83.jpg',
        ],
        [
            'title'       => 'JKT48 Official Calendar 2026 - Freckles Reckless',
            'description' => 'Kalender resmi JKT48 2026 bertema Freckles Reckless. 3 tipe varian tersedia. Pre-order dibuka 7–23 Januari 2026, stok tersisa sangat terbatas. Koleksi tahunan wajib bagi wota.',
            'category'    => 'poster',
            'price'       => 300000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/39ca8a166da12a23333913a050ee6c2816137b88.jpg',
        ],
        [
            'title'       => 'Kaos JKT48 ALL IN TOUR 2025 - Official Merchandise Edisi Raja Hati',
            'description' => 'Tour T-Shirt official JKT48 ALL IN TOUR 2025 edisi Raja Hati. Tersedia 2 warna (hitam & putih). Bahan Cotton Combed berkualitas. Merchandise resmi langsung dari konser.',
            'category'    => 'apparel',
            'price'       => 165000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/dc43dd0ec95cb77cb09c847f806fbf5be039d646.jpg',
        ],
        [
            'title'       => 'JKT48 Wonderland T-Shirt Butterfly Oversize - 13th Anniversary Official',
            'description' => 'Merchandise eksklusif 13th Anniversary Concert JKT48 Wonderland. T-Shirt oversize desain butterfly yang ikonik. Stok sangat terbatas, barang langka dan collectible.',
            'category'    => 'apparel',
            'price'       => 250000,
            'condition'   => 'Mint',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/dc43dd0ec95cb77cb09c847f806fbf5be039d646.jpg',
        ],
        [
            'title'       => 'JKT48 CD Album - Sambil Menggandeng Erat Tanganku (Te Wo Tsunaginagara) 2025',
            'description' => 'Album fisik terbaru JKT48 tahun 2025 "Sambil Menggandeng Erat Tanganku". Tersedia di JKT48 Official Store. Termasuk photocard bonus di dalamnya. Kondisi sealed.',
            'category'    => 'album',
            'price'       => 110000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7f643e6a43b5712aba8e5fbe03ad25c5eb0a0702.jpg',
        ],
        [
            'title'       => 'JKT48 CD Album - JOY KICK! TEARS (4th Album)',
            'description' => 'Album ke-4 JKT48 "JOY KICK! TEARS". Review sangat positif di Tokopedia. Kondisi sealed/tersegel, belum dibuka. Cocok untuk koleksi maupun hadiah.',
            'category'    => 'album',
            'price'       => 70000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7f643e6a43b5712aba8e5fbe03ad25c5eb0a0702.jpg',
        ],
        [
            'title'       => 'Photocard Holder + Lanyard JKT48 ALL IN TOUR 2025 (Official)',
            'description' => 'Photocard holder resmi + lanyard dari konser ALL IN TOUR 2025. Cocok untuk menyimpan photopack atau photocard koleksimu. Kualitas tinggi, desain eksklusif konser.',
            'category'    => 'other',
            'price'       => 85000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0f1b89d53702122b087346fe682b14883c6ba9fa.jpg',
        ],
        [
            'title'       => 'Totebag JKT48 ALL IN TOUR 2025 - Raja Hati (Official)',
            'description' => 'Totebag official JKT48 ALL IN TOUR 2025 edisi Raja Hati. Tersedia 2 warna: hitam dan putih. Material canvas berkualitas. Merchandise resmi dari konser, cocok untuk sehari-hari.',
            'category'    => 'other',
            'price'       => 120000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/f811321372d233b369da783f616ffb856ce0fc83.jpg',
        ],
        [
            'title'       => 'Keychain Akrilik JKT48 - #KuSangatSuka Official',
            'description' => 'Gantungan kunci akrilik official JKT48 seri New Era dengan desain eksklusif member. Kualitas print premium, tampilan glossy. Cocok untuk koleksi atau dipasang di tas.',
            'category'    => 'keychain',
            'price'       => 50000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/afcac8b8f36f7879a5706268dd1e2dd824f45d1a.jpg',
        ],
        [
            'title'       => 'Photopack Full House Konser JKT48 (Official)',
            'description' => 'Photopack edisi spesial konser Full House JKT48. Koleksi resmi langka dari event eksklusif. Kondisi baru dan tersegel. Dijual per set lengkap.',
            'category'    => 'photocard',
            'price'       => 55000,
            'condition'   => 'New',
            'member_name' => null,
            'member_code' => null,
            'member_team' => null,
            'image_url'   => 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/5973087ded4af731a54b75ebad88dc9c6910f603.jpg',
        ],
    ];

    public function run(): void
    {
        // Resolve seller IDs — accounts already exist from TempUserSeeder, no need to modify them
        $userIds = [];
        foreach ($this->sellerEmails as $email) {
            $user = User::where('email', $email)->first();
            if (! $user) {
                $this->command->warn("  ✗ User not found: {$email} — run TempUserSeeder first");
                continue;
            }
            $userIds[] = $user->id;
            $this->command->line("  ✓ Found user: {$user->name} (ID {$user->id})");
        }

        if (empty($userIds)) {
            $this->command->error('No seller accounts found. Aborting.');
            return;
        }

        $imageCache  = [];
        $sellerIndex = 0;
        $created     = 0;
        $skipped     = 0;

        foreach ($this->products as $p) {
            // Idempotent: skip if already seeded
            if (Listing::where('title', $p['title'])->exists()) {
                $this->command->line("  ⟳ Skip (exists): {$p['title']}");
                $skipped++;
                $sellerIndex = ($sellerIndex + 1) % count($userIds);
                continue;
            }

            // Download image once per unique URL
            if (! array_key_exists($p['image_url'], $imageCache)) {
                $imageCache[$p['image_url']] = $this->downloadImage($p['image_url']);
            }

            // Round-robin seller assignment
            $sellerId    = $userIds[$sellerIndex];
            $sellerIndex = ($sellerIndex + 1) % count($userIds);

            Listing::create([
                'user_id'              => $sellerId,
                'title'                => $p['title'],
                'description'          => $p['description'],
                'category'             => $p['category'],
                'price'                => $p['price'],
                'condition'            => $p['condition'],
                'status'               => 'Available',
                'image_path'           => $imageCache[$p['image_url']],
                'featured_member_code' => $p['member_code'],
                'featured_member_name' => $p['member_name'],
                'featured_member_team' => $p['member_team'],
            ]);

            $this->command->line("  ✓ Created: \"{$p['title']}\" → user ID {$sellerId}");
            $created++;
        }

        $this->command->newLine();
        $this->command->info("Done! {$created} listings created, {$skipped} skipped.");
    }

    private function downloadImage(string $url): ?string
    {
        try {
            $this->command->line("  ↓ Downloading: " . Str::limit($url, 90));

            $response = Http::timeout(20)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 OshiMerch-Seeder/1.0'])
                ->get($url);

            if (! $response->successful()) {
                $this->command->warn("  ✗ HTTP {$response->status()} — skipping image");
                return null;
            }

            $filename = 'listings/' . Str::uuid() . '.jpg';
            Storage::disk('public')->put($filename, $response->body());
            $this->command->line("  ✓ Saved: {$filename}");

            return $filename;
        } catch (\Throwable $e) {
            $this->command->warn("  ✗ Download failed: {$e->getMessage()}");
            return null;
        }
    }
}
