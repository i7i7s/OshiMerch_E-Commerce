<div align="center">

# 🎀 OshiMerch

### *Marketplace Merchandise JKT48 — dari fans, untuk fans*

[![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Inertia](https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=for-the-badge)](https://inertiajs.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**OshiMerch** adalah platform jual-beli merchandise JKT48 berbasis komunitas.
Mau jual photocard Oshi kamu? Cari album edisi terbatas? Yuk, di sini tempatnya!

</div>

---

## Apa aja sih yang bisa dilakukan di OshiMerch?

### Buat Seller
- Upload listing produk (photocard, album, lightstick, dll.) dengan foto
- Tag member JKT48 ke produk — sistem **otomatis detect** nama member dari judul!
- Chat langsung dengan calon pembeli
- Pantau status transaksi dan pengiriman via OshiGo
- Terima review dari pembeli

### Buat Buyer
- Browse semua produk, filter by **tim member** (PASSION / LOVE / DREAM / TRAINEE / JKT48V)
- Filter by kategori, kondisi, harga, sort by terlaris/terbaru
- Wishlist produk favorit
- Keranjang belanja berbasis database (aman kalau browser nutup!)
- Checkout dengan upload bukti transfer
- Real-time tracking status pesanan
- Kasih review setelah transaksi selesai

### Real-time Chat
- **Direct Message** antar user — ngobrol santai sebelum deal
- **Transaction Chat** — negosiasi dan komunikasi langsung di dalam transaksi
- Semua notifikasi muncul real-time via WebSocket (Laravel Reverb)

### Fitur Eksklusif Member JKT48
- **Member Directory** — browse semua member aktif lengkap dengan info tim
- **Member Profile** — lihat semua listing produk yang tagged ke member tertentu
- **Auto-Tag System** — tulis nama member di judul produk, sistem otomatis detect dan tag tim yang benar (pakai JKT48 API + word-boundary matching!)
- **Oshi Onboarding** — pilih oshi kamu saat pertama daftar

### Admin Panel (OshiMin) — `/oshimin`
- Dashboard statistik keseluruhan marketplace
- Kelola listings (hide / restore / delete)
- Monitor transaksi dan lihat bukti bayar
- Kelola user (ban / unban)
- Moderasi review dan rating
- Atur tarif OshiGo shipping (34 provinsi Indonesia!)
- Kelola nomor rekening dan e-wallet pembayaran

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend** | Laravel 13, PHP 8.3, Inertia.js server adapter |
| **Frontend** | React 19, Inertia.js client, Vite 6 |
| **Styling** | Tailwind CSS 4.0, Framer Motion, GSAP, Lenis |
| **Real-time** | Laravel Reverb (WebSocket self-hosted) |
| **Auth** | Laravel Socialite — Google + Twitter/X OAuth |
| **Admin Panel** | Filament 4.x |
| **Database** | MySQL 8.0 |
| **Member Data** | JKT48 Member API (https://jkt-48-member-api-i7i7.vercel.app) |

---

## Setup & Instalasi

### Requirement
- PHP 8.3+
- Node.js 18+
- Composer 2+
- MySQL 8.0+

### Langkah-langkah

```bash
# 1. Clone repo
git clone https://github.com/i7i7s/OshiMerch_E-Commerce.git
cd OshiMerch_E-Commerce

# 2. Install dependencies
composer install
npm install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Isi .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD, dst.)
# lalu jalankan migrasi dan seeder
php artisan migrate
php artisan db:seed

# 5. Link storage untuk upload gambar
php artisan storage:link

# 6. Build frontend
npm run build
```

### Konfigurasi `.env` penting

```env
APP_NAME=OshiMerch
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_DATABASE=oshimerch
DB_USERNAME=root
DB_PASSWORD=

# WebSocket (Laravel Reverb)
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=oshimerch
REVERB_APP_KEY=oshimerch-key
REVERB_APP_SECRET=oshimerch-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"

# Google OAuth (opsional tapi recommended)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# JKT48 Member API
JKT48_API_URL=https://jkt-48-member-api-i7i7.vercel.app
```

---

## Menjalankan Dev Server

```bash
# Cara paling gampang — jalankan semua sekaligus!
php artisan dev
```

Yang dijalankan bersamaan:

| Proses | Port | Keterangan |
|--------|------|------------|
| php artisan serve | 8000 | HTTP server |
| npm run dev | 5173 | Vite HMR |
| php artisan reverb:start | 8080 | WebSocket server |
| php artisan queue:listen | — | Queue worker |

### Login Admin Panel
```
URL      : http://localhost:8000/oshimin
Email    : admin@oshimerch.com
Password : oshimin123
```

---

## Artisan Commands Kustom

| Command | Fungsi |
|---------|--------|
| `php artisan listings:auto-tag` | Auto-tag listing yang belum punya member (scan nama di judul dan deskripsi) |
| `php artisan listings:auto-tag --all` | Re-process SEMUA listing, cocok untuk fix tag yang salah |
| `php artisan payments:cancel-expired` | Cancel transaksi yang sudah kedaluwarsa |

---

## Struktur Folder Penting

```
app/
  Http/Controllers/     -> Semua controller (Listing, Transaction, Member, Chat, dll.)
  Models/               -> Eloquent models
  Services/             -> MemberAutoTagService — auto-detect member dari nama produk
  Console/Commands/     -> Artisan commands kustom
  Filament/             -> Admin panel (OshiMin) — pages, resources, widgets
  Events/               -> Broadcasting events (chat, notifikasi, transaksi)

resources/js/
  Pages/                -> Halaman React (Products, Members, Transactions, Chat, dll.)
  Components/           -> Komponen reusable (Navbar, ListingCard, dll.)
  Layouts/              -> Layout wrapper

dokumentasi/            -> Dokumentasi teknis lengkap dan PRD
```

---

## Tim Member JKT48

Listing produk bisa di-tag ke 5 tim berdasarkan member yang featured:

| Tim | Warna |
|-----|-------|
| PASSION | Merah |
| LOVE | Pink |
| DREAM | Ungu |
| TRAINEE | Kuning |
| JKT48V | Teal (Virtual) |

---

## Dokumentasi Lebih Lanjut

- `dokumentasi/dokumentasi_sesi.md` — Riwayat sesi pengembangan dan detail teknis
- `dokumentasi/PRD_OSHI MERCH FIX.md` — Product Requirements Document
- `dokumentasi/laravel_reverb_features.md` — Dokumentasi fitur WebSocket

---

Dibuat dengan sepenuh hati untuk komunitas JKT48 Indonesia.

*"Oshi Merch — mudah, aman, dan penuh cinta!"*
