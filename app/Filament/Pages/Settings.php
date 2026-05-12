<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class Settings extends Page
{
    protected static ?string $navigationLabel = 'Pengaturan';
    protected static ?string $title = 'Pengaturan Pembayaran';
    protected static ?int $navigationSort = 10;

    public static function getNavigationIcon(): string|\BackedEnum|\Illuminate\Contracts\Support\Htmlable|null
    {
        return 'heroicon-o-cog-6-tooth';
    }

    protected string $view = 'filament.pages.settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'bca_account_number' => Setting::get('bca_account_number', ''),
            'bca_account_name'   => Setting::get('bca_account_name', ''),
            'dana_number'        => Setting::get('dana_number', ''),
            'dana_name'          => Setting::get('dana_name', ''),
            'gopay_number'       => Setting::get('gopay_number', ''),
            'gopay_name'         => Setting::get('gopay_name', ''),
            'shopeepay_number'   => Setting::get('shopeepay_number', ''),
            'shopeepay_name'     => Setting::get('shopeepay_name', ''),
            'ovo_number'         => Setting::get('ovo_number', ''),
            'ovo_name'           => Setting::get('ovo_name', ''),
        ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('BCA')
                    ->columns(2)
                    ->schema([
                        TextInput::make('bca_account_number')->label('Nomor Rekening BCA')->required(),
                        TextInput::make('bca_account_name')->label('Nama Pemilik BCA')->required(),
                    ]),
                Section::make('DANA')
                    ->columns(2)
                    ->schema([
                        TextInput::make('dana_number')->label('Nomor DANA')->required(),
                        TextInput::make('dana_name')->label('Nama DANA')->required(),
                    ]),
                Section::make('GoPay')
                    ->columns(2)
                    ->schema([
                        TextInput::make('gopay_number')->label('Nomor GoPay')->required(),
                        TextInput::make('gopay_name')->label('Nama GoPay')->required(),
                    ]),
                Section::make('ShopeePay')
                    ->columns(2)
                    ->schema([
                        TextInput::make('shopeepay_number')->label('Nomor ShopeePay')->required(),
                        TextInput::make('shopeepay_name')->label('Nama ShopeePay')->required(),
                    ]),
                Section::make('OVO')
                    ->columns(2)
                    ->schema([
                        TextInput::make('ovo_number')->label('Nomor OVO')->required(),
                        TextInput::make('ovo_name')->label('Nama OVO')->required(),
                    ]),
            ])
            ->statePath('data');
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan')
                ->action(function () {
                    $data = $this->form->getState();

                    foreach ($data as $key => $value) {
                        Setting::set($key, $value);
                    }

                    Notification::make()
                        ->title('Pengaturan berhasil disimpan!')
                        ->success()
                        ->send();
                }),
        ];
    }
}
