<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationLabel = 'Pengguna';
    protected static ?string $pluralModelLabel = 'Pengguna';
    protected static ?int $navigationSort = 3;

    public static function getNavigationIcon(): string|\BackedEnum|\Illuminate\Contracts\Support\Htmlable|null
    {
        return 'heroicon-o-users';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Forms\Components\TextInput::make('name')->required(),
            Forms\Components\TextInput::make('email')->email()->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('avatar_path')
                    ->label('Avatar')
                    ->disk('public')
                    ->circular()
                    ->width(40)
                    ->height(40),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Bergabung')
                    ->dateTime('d M Y')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->getStateUsing(fn (User $r) => $r->banned_at ? 'Banned' : 'Active')
                    ->colors([
                        'success' => 'Active',
                        'danger'  => 'Banned',
                    ]),
            ])
            ->filters([
                Tables\Filters\Filter::make('banned')
                    ->label('Hanya yang Dibanned')
                    ->query(fn ($query) => $query->whereNotNull('banned_at')),
                Tables\Filters\Filter::make('active')
                    ->label('Hanya Aktif')
                    ->query(fn ($query) => $query->whereNull('banned_at')),
            ])
            ->actions([
                Action::make('ban')
                    ->label('Ban')
                    ->icon('heroicon-o-no-symbol')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (User $r) => is_null($r->banned_at))
                    ->action(fn (User $r) => $r->update(['banned_at' => now()])),
                Action::make('unban')
                    ->label('Unban')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (User $r) => !is_null($r->banned_at))
                    ->action(fn (User $r) => $r->update(['banned_at' => null])),
                Action::make('view_listings')
                    ->label('Lihat Listing')
                    ->icon('heroicon-o-tag')
                    ->url(fn (User $r) => ListingResource::getUrl('index') . '?tableSearch=' . urlencode($r->name))
                    ->openUrlInNewTab(),
            ])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
        ];
    }
}
