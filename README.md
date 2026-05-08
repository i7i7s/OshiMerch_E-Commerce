<h1 align="center">🎀 OshiMerch</h1>
<p align="center">
  <strong>Marketplace merchandise JKT48 untuk para wota</strong><br/>
  Beli & jual photocard, lightstick, album, apparel, dan koleksi idol favoritmu dengan ekosistem yang aman, transparan, dan anti-ribet.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat-square&logo=laravel" alt="Laravel">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Inertia.js-2.x-7C3AED?style=flat-square" alt="Inertia">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Framer_Motion-11.x-0055FF?style=flat-square" alt="Framer Motion">
</p>

---

## 📖 Tentang Proyek

**OshiMerch** lahir dari keresahan fans JKT48 yang kesulitan mencari, membeli, dan menjual *merchandise* secara aman dan terorganisir. Melalui platform C2C (Consumer-to-Consumer) ini, kami meruntuhkan batas antara fans dan koleksi impian mereka. 

Sistem ini terintegrasi langsung dengan [JKT48 Member API](https://jkt-48-member-api-i7i7.vercel.app), memungkinkan pengguna untuk memilih *oshi* mereka, mendapatkan *badge* profil khusus berdasarkan tim (Tim J, KIII, T, Trainee, Virtual), dan menjelajahi *merchandise* berdasarkan idol.

---

## 🛠 Tech Stack & Arsitektur

Platform ini dibangun di atas fondasi teknologi modern untuk performa level-produksi dan *developer experience* yang maksimal:

| Layer | Teknologi Utama | Deskripsi |
| :--- | :--- | :--- |
| **Backend** | Laravel 11 + Eloquent ORM | Menangani routing, validasi ketat, autentikasi, dan relasi database yang kompleks. |
| **Frontend** | React 19 (JSX) via Inertia.js | SPA rendering tanpa API manual. Menjembatani Laravel controller langsung ke React props. |
| **Styling** | Tailwind CSS v4 | Styling revolusioner menggunakan direktif `@theme` & `@source`, nol konfigurasi *file* eksternal. |
| **Animations** | Framer Motion & GSAP | Memberikan mikro-interaksi, transisi halaman, efek *parallax*, dan UI/UX yang *anti-mainstream*. |
| **Database** | MySQL | Skema relasional untuk Users, Products (Listings), Transactions, dan Messages. |
| **Auth & Sec** | Laravel Breeze + Socialite | Sistem autentikasi instan melalui akun Google OAuth 2.0. |

---

## 🚀 Fitur & Pencapaian Saat Ini

### ✅ Phase 1: Fondasi Kuat & Autentikasi Modern
- [x] Autentikasi instan via Google OAuth.
- [x] Alur *Onboarding* gamifikasi: pengguna wajib memilih *oshi* dari database API eksternal.
- [x] *Design System* khusus berbasis tim JKT48 (Passion Red, Love Pink, Dream Blue, Trainee Green).
- [x] Landing Page dinamis dengan animasi Carousel, Marquee responsif, dan *Hero Banner* interaktif.

### ✅ Phase 2: Marketplace Listing (Core Engine)
- [x] Sistem CRUD penuh untuk *merchandise* dengan otorisasi ketat (hanya pemilik yang bisa mengedit).
- [x] Halaman Eksplorasi Produk dengan *Debounced Search*, filter kompleks (Kategori, Tim, Kondisi), dan paginasi interaktif.
- [x] Integrasi *Drag-and-Drop Image Uploader* dengan kompresi dan pengelolaan storage Laravel lokal.
- [x] *Dashboard* penjual yang memberikan analitik statis dan daftar produk *live*.

### ✅ Phase 3: UI/UX Masterclass & Pembersihan Sistem (TERBARU)
- [x] Migrasi Skema Warna Global: Dari *Hot Pink* menjadi *Merah Menyala* (Passion) untuk identitas *brand* yang lebih berani.
- [x] Restrukturisasi Halaman *Tentang Kami* (*About*): Menggunakan desain **Editorial Brutalist / Asimetris** murni tanpa library *icon* pihak ketiga (pure SVG).
- [x] *Global Error Handling*: Halaman 404, 500, dan *Offline Detector* yang didesain secara kustom agar interaktif.
- [x] Halaman Detail Member (JKT48): Dilengkapi *Parallax Hero*, *Mock Social Media Feeds*, dan GSAP *Stagger animations*.
- [x] Halaman Pusat Bantuan (*Help Center*): Implementasi *Single Page Application* dengan navigasi *vertical tabs* yang mulus.

---

## ⏳ NEXT PHASE: Apa yang Akan Datang? (Phase 4 & 5)

Proyek ini telah memiliki basis antarmuka dan struktur data yang solid. Fase selanjutnya difokuskan pada implementasi fitur transaksi *real-world* dan interaksi *real-time*:

### 🚀 Phase 4: Komunikasi & Transaksi
- **Real-time Chatting (PRIORITAS):**
  - Implementasi **Laravel Reverb + Laravel Echo** untuk sistem percakapan antar pembeli dan penjual tanpa perlu *refresh* halaman (WebSocket).
  - Status *online/offline* dan indikator "sedang mengetik...".
- **Sistem Keranjang & Checkout:**
  - Mengubah *Cart* dari sekadar UI *placeholder* menjadi sistem penyimpanan sesi *database*.
  - Integrasi *Payment Gateway* (seperti Midtrans atau Xendit) untuk simulasi pembayaran *escrow* (Rekber).
- **Manajemen Order:**
  - *State Machine* untuk status pesanan: `Pending` -> `Paid` -> `Shipped` -> `Completed`.

### 🔮 Phase 5: Komunitas & Kepercayaan
- **Sistem Ulasan & Rating:** Pembeli dapat memberikan penilaian bintang 1-5 setelah pesanan berstatus `Completed`.
- **Notifikasi *Push* Real-time:** Notifikasi instan saat barang terjual, ada pesan baru, atau diskon.
- **Admin *Dashboard*:** Panel moderator khusus untuk meninjau *listing* yang dilaporkan (*flagged*).

---

## 💻 Panduan Instalasi Lokal

Ingin menjalankan OshiMerch di komputermu? Ikuti langkah mudah ini:

```bash
# 1. Clone repositori & masuk ke folder
git clone https://github.com/i7i7s/OshiMerch_E-Commerce.git
cd OshiMerch_E-Commerce

# 2. Install semua dependensi PHP & JavaScript
composer install
npm install

# 3. Siapkan file environment
cp .env.example .env
php artisan key:generate

# 4. Konfigurasi kredensial di .env
# - Atur DB_DATABASE, DB_USERNAME, DB_PASSWORD
# - Atur kredensial GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET untuk login

# 5. Eksekusi migrasi database & hubungkan storage
php artisan migrate
php artisan storage:link

# 6. Build antarmuka pengguna
npm run build

# 7. Jalankan server lokal
php artisan serve
```

---

## 👥 Meet The Creators

OshiMerch dibangun dengan dedikasi penuh oleh 4 pilar utama:
1. **Muhammad Daffa Alwafi** — Lead Engineer & Visionary
2. **Al Ilham Daffa Nurridho** — Backend Architect
3. **Erizal Rahmad Pramudhita** — Frontend Specialist
4. **Aidil Addzikra** — Product Strategist

<p align="center">
  <br>
  <i>"Karena fandom yang sehat butuh ekosistem yang hebat."</i>
  <br>
  <b>&copy; 2026 OshiMerch Indonesia.</b>
</p>
