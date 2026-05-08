<h1 align="center">🎀 OshiMerch</h1>
<p align="center">
  <strong>Marketplace merchandise JKT48 untuk para wota</strong><br/>
  Beli & jual photocard, lightstick, album, apparel, dan koleksi idol favoritmu
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-13.x-FF2D20?style=flat-square&logo=laravel" alt="Laravel">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Inertia.js-2.x-7C3AED?style=flat-square" alt="Inertia">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Framer_Motion-11.x-0055FF?style=flat-square" alt="Framer Motion">
</p>

---

## Tentang Proyek

**OshiMerch** adalah platform marketplace C2C (consumer-to-consumer) yang dibangun khusus untuk komunitas JKT48. Pengguna dapat mendaftarkan diri via Google, memilih _oshi_ (member favorit), lalu membeli dan menjual merchandise idol seperti photocard, lightstick, album, poster, dan lainnya.

---

## Tech Stack

| Layer        | Teknologi                                                     |
| ------------ | ------------------------------------------------------------- |
| Backend      | Laravel 13 + Eloquent ORM                                     |
| Frontend     | React 19 (JSX) via Inertia.js v2                              |
| Styling      | Tailwind CSS v4 (`@theme {}` directives, no config file)      |
| Build        | Vite 6.4                                                      |
| Auth         | Laravel Breeze + Google OAuth (Socialite)                     |
| Animation    | Framer Motion 11, GSAP, Lenis                                 |
| Icons        | Lucide React                                                  |
| Database     | MySQL                                                         |
| Storage      | Laravel Filesystem (local `storage/app/public`)               |
| External API | [JKT48 Member API](https://jkt-48-member-api-i7i7.vercel.app) |

---

## Fitur Utama

### ✅ Phase 1 — Fondasi & Auth

- Login via Google OAuth dengan avatar & profil otomatis
- Alur onboarding — pilih _oshi_ member JKT48 dari API eksternal
- Landing page (10 section: Hero, Category Marquee, Products, Stats, Featured Members, dll.)
- Halaman Members dengan filter tim, pencarian debounced, dan modal detail
- Design system custom: token warna tim (PASSION, LOVE, DREAM, TRAINEE, VIRTUAL), glassmorphism, gradient, skeleton loader

### ✅ Phase 2 — Marketplace Listing

- **Halaman Produk** (`/products`) — grid listing real DB, filter sidebar (tim/kategori/kondisi/harga), search debounced, sort, pagination, skeleton loading, empty state
- **Detail Produk** (`/products/{id}`) — foto produk, badge tim, aksi beli/edit/hapus sesuai peran, listing terkait
- **Form Jual** (`/listings/create`) — drag-and-drop image upload, combobox member JKT48 (fetch API), radio kondisi, validasi sisi server
- **Form Edit** (`/listings/{id}/edit`) — pre-populate semua field, ganti/pertahankan foto lama
- **Dashboard** — daftar listing milik sendiri, edit/hapus per baris, statistik, CTA jual sekarang
- Authorization via Laravel Policy — hanya pemilik yang bisa edit/hapus listing

---

## Instalasi

```bash
# 1. Clone & install dependensi
git clone https://github.com/i7i7s/OshiMerch_E-Commerce.git
cd OshiMerch_E-Commerce
composer install
npm install

# 2. Konfigurasi environment
cp .env.example .env
php artisan key:generate

# 3. Isi .env — database, Google OAuth, APP_URL
# DB_DATABASE, DB_USERNAME, DB_PASSWORD
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI

# 4. Migrasi database
php artisan migrate

# 5. Symlink storage
php artisan storage:link

# 6. Build frontend
npm run build
# atau untuk development:
npm run dev

# 7. Jalankan server
php artisan serve
```

---

## Struktur Halaman

```
/                       → Landing page (Welcome)
/members                → Daftar member JKT48
/products               → Marketplace listing (publik)
/products/{id}          → Detail listing (publik)
/auth/google/redirect   → Login via Google
/onboarding             → Pilih oshi (wajib setelah login)
/dashboard              → Dashboard pengguna (auth)
/listings/create        → Form tambah listing (auth)
/listings/{id}/edit     → Form edit listing (auth + owner)
/profile                → Profil pengguna (auth)
```

---

## Roadmap

- **Phase 3** — Sistem pesan antar pengguna, transaksi, wishlist backend, rating penjual
- **Phase 4** — Notifikasi real-time, review & rating, laporan transaksi

---

## Lisensi

MIT License — bebas digunakan untuk keperluan non-komersial.
