<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ListingResource\Pages;
use App\Models\Listing;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class ListingResource extends Resource
{
    protected static ?string $model = Listing::class;
    protected static ?string $navigationLabel = 'Listings';
    protected static ?string $pluralModelLabel = 'Listings';
    protected static ?int $navigationSort = 1;

    public static function getNavigationIcon(): string|\BackedEnum|\Illuminate\Contracts\Support\Htmlable|null
    {
        return 'heroicon-o-tag';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Forms\Components\TextInput::make('title')->required()->maxLength(255),
            Forms\Components\Select::make('status')
                ->options([
                    'Available' => 'Available',
                    'Reserved'  => 'Reserved',
                    'Sold'      => 'Sold',
                    'Hidden'    => 'Hidden',
                ])
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Foto')
                    ->disk('public')
                    ->width(60)
                    ->height(60),
                Tables\Columns\TextColumn::make('title')
                    ->label('Judul')
                    ->searchable()
                    ->limit(40),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Penjual')
                    ->searchable(),
                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Harga')
                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format($state, 0, ',', '.')),
                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'success' => 'Available',
                        'warning' => 'Reserved',
                        'danger'  => fn ($state) => in_array($state, ['Sold', 'Hidden']),
                    ]),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'Available' => 'Available',
                        'Reserved'  => 'Reserved',
                        'Sold'      => 'Sold',
                        'Hidden'    => 'Hidden',
                    ]),
                Tables\Filters\SelectFilter::make('category')
                    ->options(fn () => Listing::distinct()->pluck('category', 'category')->toArray()),
            ])
            ->actions([
                Action::make('hide')
                    ->label('Sembunyikan')
                    ->icon('heroicon-o-eye-slash')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->visible(fn (Listing $record) => $record->status !== 'Hidden')
                    ->action(fn (Listing $record) => $record->update(['status' => 'Hidden'])),
                Action::make('restore')
                    ->label('Pulihkan')
                    ->icon('heroicon-o-eye')
                    ->color('success')
                    ->visible(fn (Listing $record) => $record->status === 'Hidden')
                    ->action(fn (Listing $record) => $record->update(['status' => 'Available'])),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkAction::make('bulk_hide')
                    ->label('Sembunyikan Terpilih')
                    ->icon('heroicon-o-eye-slash')
                    ->requiresConfirmation()
                    ->action(fn ($records) => $records->each->update(['status' => 'Hidden'])),
                DeleteBulkAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListListings::route('/'),
        ];
    }
}
