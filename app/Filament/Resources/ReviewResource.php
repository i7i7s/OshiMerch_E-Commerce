<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReviewResource\Pages;
use App\Models\Review;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;
    protected static ?string $navigationLabel = 'Ulasan';
    protected static ?string $pluralModelLabel = 'Ulasan';
    protected static ?int $navigationSort = 4;

    public static function getNavigationIcon(): string|\BackedEnum|\Illuminate\Contracts\Support\Htmlable|null
    {
        return 'heroicon-o-star';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('reviewer.name')
                    ->label('Reviewer')
                    ->searchable(),
                Tables\Columns\TextColumn::make('seller.name')
                    ->label('Penjual')
                    ->searchable(),
                Tables\Columns\TextColumn::make('rating')
                    ->label('Rating')
                    ->formatStateUsing(fn ($state) => str_repeat('★', $state) . str_repeat('☆', 5 - $state))
                    ->badge()
                    ->color(fn ($state) => match(true) {
                        $state >= 4 => 'success',
                        $state >= 3 => 'warning',
                        default     => 'danger',
                    }),
                Tables\Columns\TextColumn::make('comment')
                    ->label('Komentar')
                    ->limit(60)
                    ->placeholder('(tidak ada)'),
                Tables\Columns\TextColumn::make('transaction_id')
                    ->label('Transaksi #')
                    ->url(fn (Review $r) => TransactionResource::getUrl('view', ['record' => $r->transaction_id])),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('rating')
                    ->options([
                        1 => '1 ★',
                        2 => '2 ★★',
                        3 => '3 ★★★',
                        4 => '4 ★★★★',
                        5 => '5 ★★★★★',
                    ]),
            ])
            ->actions([
                DeleteAction::make()->label('Hapus'),
            ])
            ->bulkActions([
                DeleteBulkAction::make()->label('Hapus Terpilih'),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReviews::route('/'),
        ];
    }
}
