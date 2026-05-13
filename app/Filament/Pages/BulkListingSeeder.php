<?php

namespace App\Filament\Pages;

use App\Models\Listing;
use App\Models\User;
use Faker\Factory as Faker;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class BulkListingSeeder extends Page
{
    protected static ?string $navigationLabel = 'Bulk Listing';
    protected static ?string $title = 'Bulk Listing Seeder';
    protected static ?int $navigationSort = 11;
    protected static string|\UnitEnum|null $navigationGroup = 'Tools';

    public static function getNavigationIcon(): string|\BackedEnum|\Illuminate\Contracts\Support\Htmlable|null
    {
        return 'heroicon-o-squares-plus';
    }

    protected string $view = 'filament.pages.bulk-listing-seeder';

    public ?array $data = [];

    /** Fetch member list from JKT48 API, cached 1 hour */
    public static function getMembers(): array
    {
        return Cache::remember('jkt48_members', 3600, function () {
            try {
                $res = Http::timeout(8)->get(
                    rtrim(config('services.jkt48.api_url', 'https://jkt-48-member-api-i7i7.vercel.app'), '/') . '/api/members'
                );
                if ($res->successful()) {
                    return collect($res->json('data', []))
                        ->filter(fn ($m) => ! in_array($m['type'], ['JKT48_VIRTUAL']))
                        ->map(fn ($m) => [
                            'name' => $m['name'],
                            'code' => $m['code'],
                            'team' => $m['type'],
                        ])
                        ->values()
                        ->toArray();
                }
            } catch (\Throwable) {
            }

            // Fallback — subset of members in case API unreachable
            return [
                ['name' => 'Catherina Vallencia', 'code' => 'CATHERINA_VALLENCIA', 'team' => 'PASSION'],
                ['name' => 'Freya Jayawardana',   'code' => 'FREYA_JAYAWARDANA',   'team' => 'DREAM'],
                ['name' => 'Fiony Alveria',        'code' => 'FIONY_ALVERIA',        'team' => 'LOVE'],
                ['name' => 'Fritzy Rosmerian',     'code' => 'FRITZY_ROSMERIAN',     'team' => 'LOVE'],
                ['name' => 'Mutiara Azzahra',      'code' => 'MUTIARA_AZZAHRA',      'team' => 'PASSION'],
                ['name' => 'Ribka Budiman',        'code' => 'RIBKA_BUDIMAN',        'team' => 'PASSION'],
                ['name' => 'Oline Manuel',         'code' => 'OLINE_MANUEL',         'team' => 'DREAM'],
                ['name' => 'Indah Cahya',          'code' => 'INDAH_CAHYA',          'team' => 'LOVE'],
                ['name' => 'Febriola Sinambela',   'code' => 'FEBRIOLA_SINAMBELA',   'team' => 'DREAM'],
                ['name' => 'Anindya Ramadhani',    'code' => 'ANINDYA_RAMADHANI',    'team' => 'LOVE'],
            ];
        });
    }

    public function mount(): void
    {
        $this->form->fill([
            'use_random_users' => false,
            'random_user_count' => 3,
            'count_per_user' => 5,
            'category'       => 'random',
            'condition'      => 'random',
            'member_filter'  => 'all',
        ]);
    }

    public function form(Schema $schema): Schema
    {
        $memberOptions = collect(static::getMembers())
            ->sortBy('name')
            ->mapWithKeys(fn ($m) => [$m['code'] => "[{$m['team']}] {$m['name']}"])
            ->toArray();

        return $schema
            ->components([
                Section::make('⚡ Generator Fake Data')
                    ->description('Buat listing palsu menggunakan data random untuk keperluan testing dan demo. Member data diambil dari JKT48 API.')
                    ->columns(2)
                    ->schema([
                        Forms\Components\Toggle::make('use_random_users')
                            ->label('Gunakan user random dari database')
                            ->helperText('Jika aktif, user dipilih otomatis secara random — tidak perlu centang manual.')
                            ->live()
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('random_user_count')
                            ->label('Jumlah user random')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(fn () => max(1, User::count()))
                            ->default(3)
                            ->visible(fn ($get) => (bool) $get('use_random_users'))
                            ->columnSpanFull(),
                        Forms\Components\CheckboxList::make('user_ids')
                            ->label('Pilih User Target')
                            ->options(fn () => User::orderBy('name')->pluck('name', 'id')->toArray())
                            ->searchable()
                            ->bulkToggleable()
                            ->columns(3)
                            ->visible(fn ($get) => ! (bool) $get('use_random_users'))
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('count_per_user')
                            ->label('Jumlah Listing per User')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(200)
                            ->default(5),
                        Forms\Components\Select::make('category')
                            ->label('Kategori')
                            ->options([
                                'random'      => 'Random (semua kategori)',
                                'Photocard'   => 'Photocard',
                                'Album'       => 'Album',
                                'Merchandise' => 'Merchandise',
                                'Lightstick'  => 'Lightstick',
                                'Poster'      => 'Poster',
                                'Weverse'     => 'Weverse',
                            ])
                            ->default('random'),
                        Forms\Components\Select::make('condition')
                            ->label('Kondisi')
                            ->options([
                                'random'   => 'Random',
                                'New'      => 'New',
                                'Like New' => 'Like New',
                                'Good'     => 'Good',
                                'Fair'     => 'Fair',
                            ])
                            ->default('random'),
                        Forms\Components\Select::make('member_filter')
                            ->label('Batasi ke Member Tertentu')
                            ->options(array_merge(['all' => 'Semua member (random)'], $memberOptions))
                            ->searchable()
                            ->default('all')
                            ->columnSpanFull(),
                    ]),

                Section::make('📥 Import JSON / CSV')
                    ->description('Upload file JSON atau CSV berisi data listing untuk diimport ke berbagai akun user. Download template untuk format yang benar.')
                    ->schema([
                        Forms\Components\Select::make('import_type')
                            ->label('Format File')
                            ->options(['json' => 'JSON', 'csv' => 'CSV'])
                            ->default('json')
                            ->live(),
                        Forms\Components\FileUpload::make('import_file')
                            ->label('File Import')
                            ->acceptedFileTypes(['application/json', 'text/json', 'text/csv', 'text/plain', 'application/csv'])
                            ->disk('local')
                            ->directory('bulk-imports')
                            ->helperText('JSON: array of objects. CSV: kolom email,title,description,category,price,condition,featured_member_code'),
                    ]),
            ])
            ->statePath('data');
    }

    public function generate(): void
    {
        $data = $this->form->getState();

        // Resolve target user IDs
        if (! empty($data['use_random_users'])) {
            $count   = max(1, (int) ($data['random_user_count'] ?? 3));
            $userIds = User::inRandomOrder()->limit($count)->pluck('id')->toArray();
            if (empty($userIds)) {
                Notification::make()->title('Tidak ada user di database.')->danger()->send();
                return;
            }
        } else {
            $userIds = $data['user_ids'] ?? [];
            if (empty($userIds)) {
                Notification::make()->title('Pilih minimal satu user terlebih dahulu.')->danger()->send();
                return;
            }
        }

        $faker      = Faker::create('id_ID');
        $categories = ['Photocard', 'Album', 'Merchandise', 'Lightstick', 'Poster', 'Weverse'];
        $conditions = ['New', 'Like New', 'Good', 'Fair'];
        $prices     = [15000, 20000, 25000, 30000, 35000, 50000, 75000, 100000, 150000, 200000];

        $allMembers = static::getMembers();
        $members = ($data['member_filter'] ?? 'all') === 'all'
            ? $allMembers
            : collect($allMembers)->filter(fn ($m) => $m['code'] === $data['member_filter'])->values()->toArray();

        if (empty($members)) {
            $members = $allMembers;
        }

        $total = 0;
        $now   = now();

        foreach ($userIds as $userId) {
            $rows = [];
            for ($i = 0; $i < (int) ($data['count_per_user'] ?? 5); $i++) {
                $cat    = ($data['category'] ?? 'random') === 'random' ? $faker->randomElement($categories) : $data['category'];
                $cond   = ($data['condition'] ?? 'random') === 'random' ? $faker->randomElement($conditions) : $data['condition'];
                $member = $faker->randomElement($members);
                $rows[] = [
                    'user_id'              => $userId,
                    'title'                => "[{$cat}] {$member['name']} - " . ucwords($faker->words(3, true)),
                    'description'          => $faker->paragraph(2),
                    'category'             => $cat,
                    'price'                => $faker->randomElement($prices),
                    'condition'            => $cond,
                    'status'               => 'Available',
                    'image_path'           => null,
                    'featured_member_name' => $member['name'],
                    'featured_member_team' => $member['team'],
                    'featured_member_code' => $member['code'],
                    'created_at'           => $now,
                    'updated_at'           => $now,
                ];
            }
            Listing::insert($rows);
            $total += count($rows);
        }

        Notification::make()
            ->title("Berhasil membuat {$total} listing!")
            ->body('Tersebar ke ' . count($userIds) . ' user. Member data dari JKT48 API.')
            ->success()
            ->send();
    }

    public function import(): void
    {
        $data = $this->form->getState();

        if (empty($data['import_file'])) {
            Notification::make()->title('Upload file terlebih dahulu.')->danger()->send();
            return;
        }

        $type = $data['import_type'] ?? 'json';
        $path = Storage::disk('local')->path($data['import_file']);

        if (! file_exists($path)) {
            Notification::make()->title('File tidak ditemukan di server.')->danger()->send();
            return;
        }

        $records = $type === 'json'
            ? $this->parseJson($path)
            : $this->parseCsv($path);

        if ($records === null) {
            Storage::disk('local')->delete($data['import_file']);
            return;
        }

        $errors  = [];
        $rows    = [];
        $validCats   = ['Photocard', 'Album', 'Merchandise', 'Lightstick', 'Poster', 'Weverse'];
        $validConds  = ['New', 'Like New', 'Good', 'Fair'];
        $memberMap   = collect(static::getMembers())->keyBy('code');
        $now         = now();

        foreach ($records as $idx => $rec) {
            $line = $idx + 1;
            $user = User::where('email', trim($rec['email'] ?? ''))->first();

            if (! $user) {
                $errors[] = "Baris {$line}: email '{$rec['email']}' tidak ditemukan.";
                continue;
            }
            if (empty(trim($rec['title'] ?? ''))) {
                $errors[] = "Baris {$line}: title kosong.";
                continue;
            }
            if (! in_array($rec['category'] ?? '', $validCats)) {
                $errors[] = "Baris {$line}: kategori '{$rec['category']}' tidak valid.";
                continue;
            }
            if (! in_array($rec['condition'] ?? '', $validConds)) {
                $errors[] = "Baris {$line}: kondisi '{$rec['condition']}' tidak valid.";
                continue;
            }
            if (! is_numeric($rec['price'] ?? '') || (int) $rec['price'] <= 0) {
                $errors[] = "Baris {$line}: harga tidak valid.";
                continue;
            }

            // Resolve member data — accept code (e.g. FREYA_JAYAWARDANA) or name
            $memberCode = strtoupper(trim($rec['featured_member_code'] ?? ''));
            $member     = $memberMap->get($memberCode);
            $memberName = $member ? $member['name'] : trim($rec['featured_member_name'] ?? $memberCode);
            $memberTeam = $member ? $member['team'] : trim($rec['featured_member_team'] ?? '');

            $rows[] = [
                'user_id'              => $user->id,
                'title'                => trim($rec['title']),
                'description'          => trim($rec['description'] ?? ''),
                'category'             => $rec['category'],
                'price'                => (int) $rec['price'],
                'condition'            => $rec['condition'],
                'status'               => 'Available',
                'image_path'           => null,
                'featured_member_name' => $memberName,
                'featured_member_team' => $memberTeam,
                'featured_member_code' => $memberCode,
                'created_at'           => $now,
                'updated_at'           => $now,
            ];
        }

        Storage::disk('local')->delete($data['import_file']);

        if (! empty($rows)) {
            Listing::insert($rows);
        }

        $body  = empty($errors) ? null : count($errors) . ' baris dilewati: ' . implode(' | ', array_slice($errors, 0, 5));
        $notif = count($rows) > 0
            ? Notification::make()->title('Berhasil import ' . count($rows) . ' listing.')->success()
            : Notification::make()->title('Tidak ada data yang berhasil diimport.')->danger();

        if ($body) {
            $notif->body($body);
        }

        $notif->send();
        $this->form->fill(['count_per_user' => 5, 'category' => 'random', 'condition' => 'random', 'member_filter' => 'all']);
    }

    private function parseJson(string $path): ?array
    {
        $content = file_get_contents($path);
        $decoded = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Notification::make()->title('JSON tidak valid: ' . json_last_error_msg())->danger()->send();
            return null;
        }

        // Support both root array and {"data": [...]} wrapper
        if (isset($decoded['data']) && is_array($decoded['data'])) {
            return $decoded['data'];
        }

        if (is_array($decoded) && ! empty($decoded)) {
            return array_is_list($decoded) ? $decoded : [$decoded];
        }

        Notification::make()->title('JSON harus berupa array of objects.')->danger()->send();
        return null;
    }

    private function parseCsv(string $path): ?array
    {
        $handle  = fopen($path, 'r');
        $header  = fgetcsv($handle);
        $required = ['email', 'title', 'category', 'price', 'condition', 'featured_member_code'];

        if (array_diff($required, $header ?? [])) {
            fclose($handle);
            Notification::make()
                ->title('Header CSV tidak sesuai.')
                ->body('Kolom wajib: ' . implode(', ', $required))
                ->danger()
                ->send();
            return null;
        }

        $rows = [];
        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) >= count($header)) {
                $rows[] = array_combine($header, $row);
            }
        }
        fclose($handle);
        return $rows;
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('generate')
                ->label('⚡ Generate Fake Data')
                ->color('primary')
                ->icon('heroicon-o-sparkles')
                ->requiresConfirmation()
                ->modalHeading('Generate Fake Listings?')
                ->modalDescription('Listing akan dibuat dengan data random dan langsung masuk ke database.')
                ->action(fn () => $this->generate()),

            Action::make('import')
                ->label('📥 Import File')
                ->color('success')
                ->icon('heroicon-o-document-arrow-up')
                ->requiresConfirmation()
                ->modalHeading('Import JSON / CSV?')
                ->modalDescription('Baris yang valid akan langsung diinsert ke database.')
                ->action(fn () => $this->import()),

            Action::make('downloadJsonTemplate')
                ->label('Template JSON')
                ->color('gray')
                ->icon('heroicon-o-arrow-down-tray')
                ->url('/files/template-listing.json')
                ->openUrlInNewTab(),

            Action::make('downloadCsvTemplate')
                ->label('Template CSV')
                ->color('gray')
                ->icon('heroicon-o-arrow-down-tray')
                ->url('/files/template-listing.csv')
                ->openUrlInNewTab(),
        ];
    }
}
