# 📋 Dokumentasi Lengkap OshiMerch — Untuk AI Agent Selanjutnya

> **Dibuat:** 2026-05-12 | **Sesi:** Implementasi Laravel Reverb + Bug Fixes  
> **Stack:** Laravel 13 + Inertia.js + React 19 + Vite 6 + Laravel Reverb + MySQL (Laragon)

---

## 🏪 Tentang OshiMerch

Marketplace jual-beli merchandise JKT48 berbasis komunitas. Fitur utama:

- Jual/beli merchandise (photocard, lightstick, album, dll.)
- Direct chat antar user
- Chat dalam transaksi (negosiasi)
- Notifikasi real-time (WebSocket)
- Review seller
- Wishlist / Favorites
- Keranjang belanja (database-backed)
- Profil seller publik
- Filter produk berdasarkan member JKT48

---

## 🛠️ Tech Stack Lengkap

### Backend

| Komponen          | Detail                                                                   |
| ----------------- | ------------------------------------------------------------------------ |
| PHP               | 8.3 (via Laragon)                                                        |
| Laravel           | 13.x                                                                     |
| Inertia.js        | Server-side adapter — semua controller render via `Inertia::render()`    |
| Laravel Reverb    | v1.10 — WebSocket server self-hosted                                     |
| Laravel Sanctum   | Session-based auth (SPA)                                                 |
| Laravel Socialite | Google OAuth + Twitter/X OAuth                                           |
| Queue             | `sync` driver (dev) — events `ShouldBroadcastNow` jadi tidak pakai queue |
| Storage           | `public` disk → `storage/app/public` → symlink ke `public/storage`       |
| Cache/Session     | Database driver                                                          |

### Frontend

| Komponen      | Detail                                         |
| ------------- | ---------------------------------------------- |
| React         | 19.x                                           |
| Inertia.js    | Client adapter (`@inertiajs/react`)            |
| Vite          | 6.x                                            |
| Framer Motion | Animasi & transisi                             |
| Lucide React  | Icon library                                   |
| TailwindCSS   | Dengan custom config (tidak pakai CDN/default) |
| Laravel Echo  | WebSocket client                               |
| pusher-js     | Transport layer untuk Echo + Reverb            |

### External Services

| Service          | URL                                         | Kegunaan                            |
| ---------------- | ------------------------------------------- | ----------------------------------- |
| JKT48 Member API | `https://jkt-48-member-api-i7i7.vercel.app` | Data member JKT48 untuk tag listing |
| Google OAuth     | via Socialite                               | Login dengan Google                 |
| Twitter/X OAuth  | via Socialite                               | Login dengan X                      |

### Infrastruktur Dev (Laragon)

- **PHP path:** `C:\laragon\bin\php\php-8.3.28-Win32-vs16-x64`
- **Composer path:** `C:\laragon\bin\composer\composer.phar`
- **MySQL:** port 3306, DB name `oshimerch`
- **PHP tidak ada di PATH PowerShell default** — harus set manual

---

## 🚀 Cara Jalankan Dev Server

```powershell
# Wajib set PATH dulu (PHP tidak di PATH default Windows)
$env:PATH = "C:\laragon\bin\php\php-8.3.28-Win32-vs16-x64;C:\laragon\bin\composer;$env:PATH"
php C:\laragon\bin\composer\composer.phar dev
```

Ini menjalankan 4 proses sekaligus via `concurrently`:

| Process                            | Port | Keterangan          |
| ---------------------------------- | ---- | ------------------- |
| `php artisan serve`                | 8000 | HTTP server Laravel |
| `npm run dev`                      | 5173 | Vite HMR            |
| `php artisan reverb:start --debug` | 8080 | WebSocket server    |
| `php artisan queue:listen`         | —    | Queue worker        |

> ⚠️ **`php artisan pail` sudah DIHAPUS** dari script — tidak support Windows (butuh `pcntl` extension Linux-only)  
> ⚠️ **Laragon harus Running** (MySQL aktif) sebelum jalankan dev server

---

## 🗄️ Database — Tabel & Model

### `users`

```
id, name, email, password, google_id, twitter_id,
profile_picture_url, oshi_member_code, oshi_member_name,
bio, phone, addresses (JSON), default_address_index,
role, onboarding_completed, email_verified_at,
remember_token, created_at, updated_at
```

- `addresses` → JSON array of address objects
- `oshi_member_code` → kode member JKT48 oshi user
- `onboarding_completed` → boolean, user wajib pilih oshi saat pertama login

### `listings`

```
id, user_id, title, description, category, price (int),
condition, status, image_path,
featured_member_code, featured_member_name, featured_member_team,
created_at, updated_at
```

- **category:** `photocard | lightstick | apparel | poster | album | keychain | towel | other`
- **condition:** `New | Mint | Used`
- **status:** `Available | Reserved | Sold`
- **featured_member_team:** `PASSION | LOVE | DREAM | TRAINEE | VIRTUAL`
- `image_url` → accessor yang generate public URL dari `image_path`

### `transactions`

```
id, buyer_id, seller_id, listing_id, item_price,
payment_method, shipping_address, recipient_name, recipient_phone,
proof_of_transfer_path, shipping_resi,
payment_status, delivery_status, created_at, updated_at
```

- **payment_method:** `BCA | Dana | GoPay | ShopeePay | OVO`
- **payment_status:** `Pending → Paid → Confirmed`
- **delivery_status:** `Pending → Shipped → Completed`
- `proof_url` → accessor dari `proof_of_transfer_path`

### `messages` (Transaction messages)

```
id, transaction_id, sender_id, content, created_at, updated_at
```

### `conversations` (Direct chat sessions)

```
id, user1_id, user2_id, created_at, updated_at
```

### `direct_messages`

```
id, conversation_id, sender_id, content, created_at, updated_at
```

### `notifications`

```
id, user_id, type, title, body, url, data (JSON), read_at, created_at, updated_at
```

- **type:** `transaction_paid | item_shipped | transaction_completed | new_message | new_listing`
- `is_read` → computed dari `read_at !== null`

### `reviews`

```
id, transaction_id, reviewer_id, seller_id, rating (1-5), comment, created_at, updated_at
```

### `favorites`

```
id, user_id, listing_id, created_at, updated_at
```

### `cart_items`

```
id, user_id, listing_id, created_at, updated_at
```

### `cache`, `jobs` (Laravel standard)

---

## 📂 Semua Controllers

### Auth Controllers (`app/Http/Controllers/Auth/`)

| File                                | Fungsi                                  |
| ----------------------------------- | --------------------------------------- |
| `AuthenticatedSessionController`    | Login/logout email-password             |
| `RegisteredUserController`          | Register akun baru                      |
| `GoogleAuthController`              | OAuth Google redirect + callback        |
| `TwitterAuthController`             | OAuth Twitter/X redirect + callback     |
| `PasswordController`                | Update password                         |
| `PasswordResetLinkController`       | Kirim email reset password              |
| `NewPasswordController`             | Set password baru                       |
| `EmailVerificationPromptController` | Halaman verifikasi email                |
| `VerifyEmailController`             | Handle link verifikasi email            |
| `ConfirmablePasswordController`     | Konfirmasi password untuk aksi sensitif |

### Business Controllers (`app/Http/Controllers/`)

| File                      | Fungsi                                                                         |
| ------------------------- | ------------------------------------------------------------------------------ |
| `CartController`          | CRUD keranjang belanja (DB-backed)                                             |
| `ChatController`          | Index halaman chat (list conversations)                                        |
| `ConversationController`  | Direct chat (show + sendMessage) — sekarang return JSON untuk AJAX             |
| `FavoriteController`      | Toggle favorit + status listing                                                |
| `ListingController`       | Full CRUD listing + filter/search                                              |
| `MemberController`        | Detail member JKT48 (dari API eksternal)                                       |
| `MessageController`       | Kirim pesan dalam transaksi                                                    |
| `NotificationController`  | API notifikasi (index, markRead, markAllRead, destroy)                         |
| `OnboardingController`    | Pilih oshi saat pertama kali login                                             |
| `ProfileController`       | Edit profil user                                                               |
| `ReviewController`        | Buat review + tampilkan review seller                                          |
| `SellerProfileController` | Halaman profil publik seller                                                   |
| `TransactionController`   | Full flow transaksi (store, show, uploadProof, confirmPayment, ship, complete) |

---

## 🖥️ Semua Halaman (Pages)

### Public (tidak butuh login)

| Route                 | Page                 | Keterangan                                                       |
| --------------------- | -------------------- | ---------------------------------------------------------------- |
| `/`                   | `Welcome.jsx`        | Landing page — listings terbaru, stats, trending members         |
| `/products`           | `Products.jsx`       | Marketplace dengan filter (kategori, team, kondisi, harga, sort) |
| `/products/{listing}` | `Products/Show.jsx`  | Detail produk + related listings                                 |
| `/members`            | `Members.jsx`        | Daftar member JKT48 (dari API eksternal)                         |
| `/members/{code}`     | `Members/Show.jsx`   | Detail member + listing terkait                                  |
| `/seller/{user}`      | `Seller/Profile.jsx` | Profil publik seller + reviews                                   |
| `/about`              | `About.jsx`          | Tentang OshiMerch                                                |
| `/help`               | `Help.jsx`           | FAQ dan bantuan                                                  |
| `/login`              | `Auth/Login.jsx`     | Login email/password + Google + Twitter                          |
| `/register`           | `Auth/Register.jsx`  | Registrasi                                                       |

### Authenticated (butuh login)

| Route                 | Page                    | Keterangan                                     |
| --------------------- | ----------------------- | ---------------------------------------------- |
| `/onboarding`         | `Onboarding.jsx`        | Wajib diisi setelah pertama login — pilih oshi |
| `/dashboard`          | `Dashboard.jsx`         | Listings milik user, pembelian, penjualan      |
| `/profile`            | `Profile/Edit.jsx`      | Edit profil + foto profil                      |
| `/listings/create`    | `Listings/Create.jsx`   | Form jual listing baru                         |
| `/listings/{id}/edit` | `Listings/Edit.jsx`     | Edit listing                                   |
| `/cart`               | `Cart.jsx`              | Keranjang belanja                              |
| `/favorites`          | `Favorites.jsx`         | Wishlist / listing favorit                     |
| `/chat`               | `Chat/Index.jsx`        | Daftar semua conversation                      |
| `/chat/with/{user}`   | `Chat/Direct.jsx`       | Direct chat dengan user tertentu               |
| `/transactions/{id}`  | `Transactions/Show.jsx` | Detail transaksi + chat + status tracker       |
| `/reviews/{user}`     | `Reviews/Index.jsx`     | Review untuk seller tertentu                   |

---

## 🔔 Sistem Notifikasi

### Tipe Notifikasi

| Type                    | Trigger                  | Penerima        | URL                     |
| ----------------------- | ------------------------ | --------------- | ----------------------- |
| `transaction_paid`      | Buyer upload bukti bayar | Seller          | `/dashboard`            |
| `item_shipped`          | Seller input resi        | Buyer           | `/dashboard`            |
| `transaction_completed` | Buyer konfirmasi terima  | Seller          | `/dashboard`            |
| `new_message`           | User kirim chat          | Penerima pesan  | `/chat/with/{senderId}` |
| `new_listing`           | (belum trigger otomatis) | Follower member | `/products`             |

### API Notifikasi

```
GET  /api/notifications          → list notifikasi user
POST /api/notifications/read-all → tandai semua dibaca
POST /api/notifications/{id}/read → tandai satu dibaca
DEL  /api/notifications/{id}     → hapus notifikasi
```

---

## 📡 Laravel Reverb — WebSocket Architecture

### Environment Variables

```env
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
```

### Private Channels & Authorization (`routes/channels.php`)

| Channel                                 | Auth Rule                           |
| --------------------------------------- | ----------------------------------- |
| `private-notifications.{userId}`        | `user->id === userId`               |
| `private-conversation.{conversationId}` | user adalah partisipan conversation |
| `private-transaction.{transactionId}`   | user adalah buyer atau seller       |

### Events

| Event Class                | Channel                  | Trigger                                     |
| -------------------------- | ------------------------ | ------------------------------------------- |
| `DirectMessageSent`        | `conversation.{id}`      | User kirim chat langsung                    |
| `NewNotification`          | `notifications.{userId}` | Semua factory method Notification           |
| `TransactionStatusUpdated` | `transaction.{id}`       | uploadProof, confirmPayment, ship, complete |
| `TransactionMessageSent`   | `transaction.{id}`       | User kirim pesan dalam transaksi            |

> Semua event implement `ShouldBroadcastNow` (sinkron, tidak lewat queue)

### Frontend Echo Setup (`resources/js/bootstrap.js`)

```js
window.Echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",
    enabledTransports: ["ws", "wss"],
});
```

---

## 🐛 Bug yang Sudah Diperbaiki Sesi Ini

### Bug 1 — Blank Putih setelah Checkout / Submit Listing

**Cause:** `redirect()->route()` tidak compatible dengan Inertia SPA (XHR dapat HTML response)  
**Fix:** Ganti ke `Inertia::location(route(...))`  
**Files:** `TransactionController::store()`, `ListingController::store()`, `ListingController::update()`

### Bug 2 — 500 Error saat Publikasi Produk

**Cause:** PHP type hint `RedirectResponse` conflict dengan return value `Response` dari `Inertia::location()`  
**Fix:** Ubah return type jadi `HttpResponse|RedirectResponse`  
**Files:** `ListingController`, `TransactionController`

### Bug 3 — Blank Putih saat Tambah Foto di `/listings/create`

**Cause:** `Trash2` icon digunakan tapi tidak diimport dari `lucide-react`  
**Fix:** Tambah `Trash2` ke import statement  
**File:** `resources/js/Pages/Listings/Create.jsx`

### Bug 4 — Chat Harus Refresh untuk Lihat Pesan Baru

**Cause 1:** `ShouldBroadcast` = async queue → ada delay  
**Cause 2:** Inertia `post()` trigger `back()` → full page cycle reset Echo listener  
**Fix:**

- Semua event → `ShouldBroadcastNow`
- Chat pakai `fetch()` AJAX + optimistic UI (bukan Inertia `post()`)
- Controller return JSON saat `expectsJson()`  
  **Files:** Semua 4 event classes, `Chat/Direct.jsx`, `ConversationController`

### Bug 5 — Notifikasi Chat Tidak Navigate ke Halaman Chat yang Benar

**Cause:** URL notifikasi hardcoded `/chat` (list), bukan `/chat/with/{senderId}`  
**Fix:**

- URL jadi `/chat/with/{senderId}`
- Navigasi pakai `router.visit()` bukan `window.location.href`  
  **Files:** `Notification.php::newMessage()`, `Navbar.jsx`

### Bug 6 — `composer dev` Error: `pail` tidak bisa jalan di Windows

**Cause:** `php artisan pail` butuh ekstensi `pcntl` yang Linux-only  
**Fix:** Hapus `php artisan pail --timeout=0` dari `composer.json` dev script

---

## ⚠️ Potensi Bug yang Belum Ditest

### 1. Channel Auth Gagal (403)

**Cek:** DevTools → Network → `/broadcasting/auth` → pastikan 200 bukan 403  
**Likely cause:** Model tidak ter-load, atau user tidak punya akses ke resource

### 2. Duplikat Pesan di Transaction Chat

**Scenario:** `TransactionMessageSent` tidak pakai `.toOthers()` → sender mungkin dapat pesan dari Echo sekaligus dari Inertia reload  
**File:** `MessageController.php`

### 3. Optimistic Message Tidak Terganti Real Message

**Scenario:** Jika server response tidak return `json.message`, optimistic message (id `temp-xxx`) tidak terganti dan akan muncul duplikat saat Inertia reload berikutnya  
**File:** `Chat/Direct.jsx` + `ConversationController`

### 4. `featured_member_team` Validation Fail untuk Team Baru

**Rule:** `nullable|in:PASSION,LOVE,DREAM,TRAINEE,VIRTUAL`  
**Risk:** Jika API JKT48 return team name baru, validasi fail → listing tidak tersimpan

### 5. Flash Messages Hilang setelah `Inertia::location()`

`Inertia::location()` trigger browser full redirect → session flash tidak dibaca Inertia  
Saat ini tidak ada toast system, jadi tidak ada feedback sukses ke user

### 6. Search Bar Navbar Belum Terhubung ke Backend

Search bar di Navbar adalah UI saja, belum ada handler yang navigate ke `/products?search=...`

---

## 🏗️ Pola Arsitektur Penting

### Inertia Redirect (WAJIB DIIKUTI)

```php
// ❌ SALAH — menyebabkan blank putih di SPA
return redirect()->route('some.route');

// ✅ BENAR — Inertia-compatible
return Inertia::location(route('some.route'));

// Return type wajib union:
public function store(Request $request): HttpResponse|RedirectResponse
```

### AJAX Chat (Tidak Pakai Inertia post())

```js
// ❌ SALAH — trigger back() → reset state + Echo listener
post(route('chat.sendDirect', id), { ... });

// ✅ BENAR — AJAX langsung, optimistic UI
const res = await fetch(route('chat.sendDirect', id), {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': ... },
    body: JSON.stringify({ content }),
});
```

### Event Broadcasting

```php
// ✅ ShouldBroadcastNow = sinkron (tidak lewat queue)
class DirectMessageSent implements ShouldBroadcastNow { ... }

// ✅ toOthers() = jangan kirim ke sender sendiri
broadcast(new DirectMessageSent($message, $id))->toOthers();
```

### Dedup WebSocket Messages

```js
// Cegah duplikat saat Echo + Inertia reload datang bersamaan
channel.listen("DirectMessageSent", (e) => {
    setMessages((prev) => {
        if (prev.some((m) => m.id === e.id)) return prev; // dedup
        return [...prev, e];
    });
});
```

---

## 📋 Checklist Testing End-to-End

### Real-Time (butuh 2 browser berbeda)

- [ ] Direct chat → pesan muncul instan di penerima tanpa refresh
- [ ] Bell icon langsung update saat ada notifikasi baru
- [ ] Klik notifikasi chat → langsung ke halaman chat dengan user pengirim
- [ ] Transaction status buyer/seller update live di kedua browser

### Listing CRUD

- [ ] `/listings/create` → pilih foto → overlay Ganti/Hapus muncul (tidak blank)
- [ ] Submit listing lengkap → redirect ke halaman produk (tidak blank)
- [ ] Submit tanpa foto → error validation muncul
- [ ] Edit listing → update berhasil

### Checkout Flow

- [ ] Beli produk → form checkout → submit → redirect ke `/transactions/{id}` (tidak blank)
- [ ] Status listing jadi "Reserved" setelah checkout

### Auth

- [ ] Login email/password
- [ ] Login dengan Google → redirect ke onboarding jika baru
- [ ] Onboarding wajib selesai sebelum akses fitur utama

### Network (DevTools)

- [ ] `/broadcasting/auth` → 200 OK
- [ ] WebSocket ke `ws://localhost:8080` → 101 Switching Protocols
- [ ] `/api/notifications` → 200 dengan array

---

## 🔮 Yang Belum Dikerjakan (Future Work)

| Fitur                                              | Status   | Catatan                                           |
| -------------------------------------------------- | -------- | ------------------------------------------------- |
| Presence / Typing Indicator                        | ⏳ Belum | Channel auth di `channels.php` sudah siap         |
| Toast / Flash notification                         | ⏳ Belum | Tidak ada feedback sukses setelah publish listing |
| Search bar Navbar                                  | ⏳ Belum | UI ada, handler belum                             |
| `new_listing` notification trigger                 | ⏳ Belum | Factory method ada tapi tidak dipanggil otomatis  |
| Production Nginx + WSS config                      | ⏳ Belum | Butuh reverse proxy untuk WebSocket di VPS        |
| Supervisor untuk Reverb di prod                    | ⏳ Belum | Reverb harus long-running process                 |
| Notifikasi saat barang masuk wishlist dan tersedia | ⏳ Belum | Belum ada logic                                   |

---

## 📁 File Map Penting

```
app/
├── Events/
│   ├── DirectMessageSent.php         ← ShouldBroadcastNow, channel: conversation.{id}
│   ├── NewNotification.php           ← ShouldBroadcastNow, channel: notifications.{userId}
│   ├── TransactionMessageSent.php    ← ShouldBroadcastNow, channel: transaction.{id}
│   └── TransactionStatusUpdated.php  ← ShouldBroadcastNow, channel: transaction.{id}
├── Http/Controllers/
│   ├── Auth/
│   │   ├── GoogleAuthController.php  ← Socialite Google OAuth
│   │   └── TwitterAuthController.php ← Socialite Twitter OAuth
│   ├── ConversationController.php    ← Direct chat, return JSON untuk AJAX
│   ├── ListingController.php         ← CRUD + Inertia::location fix + return type fix
│   ├── MessageController.php         ← Transaction chat
│   ├── NotificationController.php    ← REST API notifikasi
│   └── TransactionController.php     ← Full flow + Inertia::location fix
└── Models/
    ├── Listing.php    ← scopes: available, byTeam, byCondition, byCategory, search, sorted
    ├── Notification.php ← factory methods: transactionPaid, itemShipped, transactionCompleted, newMessage, newListing
    ├── Transaction.php  ← accessor: proof_url
    └── User.php         ← relations: listings, purchasedTransactions, soldTransactions, reviewsReceived

resources/js/
├── bootstrap.js                 ← Echo + Reverb WebSocket setup
├── Components/
│   └── Navbar.jsx               ← Echo listener notifikasi, router.visit() untuk nav
└── Pages/
    ├── Chat/Direct.jsx          ← fetch() AJAX + optimistic UI + Echo listener
    ├── Listings/Create.jsx      ← Trash2 icon fix
    └── Transactions/Show.jsx    ← local state txn + messages + dual Echo listener

routes/
├── channels.php  ← private channel authorization
└── web.php       ← semua routes
```

---

## 🖥️ OshiMin Admin Panel (Filament v4)

### Overview

- **Path:** `/oshimin`
- **Panel ID:** `oshimin`
- **Auth Guard:** `admin` (separate from main app's `web` guard)
- **Model:** `App\Models\Admin`
- **Version:** Filament v4.11.3
- **Setup:** Sep Panel Provider at [app/Providers/Filament/AdminPanelProvider.php](app/Providers/Filament/AdminPanelProvider.php)

### Auth Credentials (Seeded)

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `admin@oshimerch.com` |
| Password | `oshimin123`          |

### Navigation Structure

| Label        | Route                   | Icon         | Implemented                                   |
| ------------ | ----------------------- | ------------ | --------------------------------------------- |
| Dashboard    | `/oshimin`              | home         | ✅ Yes                                        |
| Listing      | `/oshimin/listings`     | tag          | ✅ Yes — with hide/restore/delete actions     |
| Transactions | `/oshimin/transactions` | shopping-bag | ✅ Yes — with proof/override delivery actions |
| Users        | `/oshimin/users`        | users        | ✅ Yes — with ban/unban/view listings actions |
| Reviews      | `/oshimin/reviews`      | star         | ✅ Yes — with delete action                   |
| Reports      | `/oshimin/reports`      | chart-bar    | ✅ Yes — pure Blade, read-only                |
| Settings     | `/oshimin/settings`     | cog-6-tooth  | ⚠️ Partial — form rendering broken            |

### Widgets (Dashboard)

| Widget         | Type                      | Data                                     |
| -------------- | ------------------------- | ---------------------------------------- |
| Stats Overview | `StatsOverviewWidget`     | Total Users, Listings, Orders, Revenue   |
| Orders Chart   | `LineChart` (ChartWidget) | Monthly transaction count (current year) |

### Resources Implemented

#### ListingResource

- **Model:** `App\Models\Listing`
- **Columns:** avatar, name, price, member, category, status, created_at
- **Filters:** category, condition, status, date range
- **Actions:**
    - `Action::make('hide')` → set status to 'Hidden'
    - `Action::make('restore')` → set status to 'Active'
    - `DeleteAction::make()` → delete listing
- **Bulk Actions:**
    - `BulkAction::make('bulk_hide')` → hide multiple
    - `DeleteBulkAction::make()` → delete multiple
- **Pages:** `index`, `view` (ViewListing — detail page)

#### TransactionResource

- **Model:** `App\Models\Transaction`
- **Columns:** reference ID, buyer/seller names, items count, status, total, created_at
- **Filters:** status, created_at date range
- **Actions:**
    - `Action::make('view_proof')` → modal to show proof_of_transfer image
    - `Action::make('override_delivery')` → form to change delivery status
    - `ViewAction::make()` → view transaction detail
- **Bulk Actions:** None
- **Pages:** `index` (ListTransactions), `view` (ViewTransaction)

#### UserResource

- **Model:** `App\Models\User`
- **Columns:** avatar, name, email, created_at, status (Active/Banned)
- **Filters:** banned, active (toggle)
- **Actions:**
    - `Action::make('ban')` → set `banned_at` to now
    - `Action::make('unban')` → set `banned_at` to null
    - `Action::make('view_listings')` → link to ListingResource index with user name filter
- **Bulk Actions:** None
- **Pages:** `index` only (ListUsers)

#### ReviewResource

- **Model:** `App\Models\Review`
- **Columns:** reviewer name, seller name, rating (stars), comment, transaction link, created_at
- **Filters:** rating (select 1-5 stars)
- **Actions:**
    - `DeleteAction::make()` → delete review (label: "Hapus")
- **Bulk Actions:**
    - `DeleteBulkAction::make()` → delete multiple (label: "Hapus Terpilih")
- **Pages:** `index` only (ListReviews)

### Custom Pages

#### Settings Page

- **Route:** `/oshimin/settings`
- **File:** [app/Filament/Pages/Settings.php](app/Filament/Pages/Settings.php)
- **Blade:** [resources/views/filament/pages/settings.blade.php](resources/views/filament/pages/settings.blade.php)
- **Purpose:** Payment gateway settings (BCA, DANA, GoPay, ShopeePay, OVO)
- **Form Fields (10 total):**
    - BCA: account_number, account_name
    - DANA: number, name
    - GoPay: number, name
    - ShopeePay: number, name
    - OVO: number, name
- **Storage:** Settings table (key → value, key is primary)
- **Helpers:** `Setting::get(key, default)`, `Setting::set(key, value)`

#### Reports Page

- **Route:** `/oshimin/reports`
- **File:** [app/Filament/Pages/Reports.php](app/Filament/Pages/Reports.php)
- **Blade:** [resources/views/filament/pages/reports.blade.php](resources/views/filament/pages/reports.blade.php)
- **Purpose:** Read-only reporting dashboard
- **Tables:**
    - Listings by category (count)
    - Transactions by month (count)
    - Revenue by province (sum)

### Database

#### migrations/2026_05_12_000003_create_oshimin_foundation.php

| Table                 | Columns                                                              |
| --------------------- | -------------------------------------------------------------------- |
| `admins`              | id, name, email, password, remember_token, created_at, updated_at    |
| `users` (modified)    | Added `banned_at` (nullable timestamp)                               |
| `listings` (modified) | Added 'Hidden' status to enum                                        |
| `settings`            | key (primary, string), value (nullable text), created_at, updated_at |

### Auth Config

**config/auth.php additions:**

```php
'guards' => [
    'admin' => [
        'driver' => 'session',
        'provider' => 'admins',
    ],
],
'providers' => [
    'admins' => [
        'driver' => 'eloquent',
        'model' => App\Models\Admin::class,
    ],
],
```

**App\Models\Admin:**

- Extends `Authenticatable`
- Implements `FilamentUser` interface
- `canAccessPanel(): bool { return true; }`
- Guard: `'admin'`
- Fillable: `['name', 'email', 'password']`

### Filament v4 Namespace Fixes (Applied)

| Old (broken)                                 | New (working)                                      |
| -------------------------------------------- | -------------------------------------------------- |
| `Filament\Tables\Actions\Action`             | `Filament\Actions\Action` ✅                       |
| `Filament\Tables\Actions\DeleteAction`       | `Filament\Actions\DeleteAction` ✅                 |
| `Filament\Tables\Actions\BulkAction`         | `Filament\Actions\BulkAction` ✅                   |
| `Filament\Tables\Actions\DeleteBulkAction`   | `Filament\Actions\DeleteBulkAction` ✅             |
| `Filament\Tables\Actions\ViewAction`         | `Filament\Actions\ViewAction` ✅                   |
| `Filament\Forms\Form`                        | `Filament\Schemas\Schema` ✅                       |
| `Filament\Forms\Components\Section`          | `Filament\Schemas\Components\Section` ✅ (partial) |
| `protected static string $navigationIcon`    | `getNavigationIcon()` method override ✅           |
| `protected static string $view` (pages)      | `protected string $view` (non-static) ✅           |
| `protected static string $heading` (widgets) | `protected string $heading` (non-static) ✅        |

---

## ⚠️ Current OshiMin Bugs (Not Fixed)

### Bug #1: Settings Page — "Class Filament\Forms\Components\Section not found"

- **Error Location:** [app/Filament/Pages/Settings.php](app/Filament/Pages/Settings.php) line 48
- **Cause:** Import line still references wrong namespace
- **Status:** Import changed but may not have taken effect
- **Fix:** Verify import line, may need re-check

### Bug #2: Listings Actions — "Argument #1 ($user) must be of type App\Models\User, App\Models\Admin given"

- **Error Location:** [app/Policies/ListingPolicy.php](app/Policies/ListingPolicy.php) line 15
- **Affected Actions:** view_proof, override_delivery buttons on Listings resource
- **Cause:** Policy methods type-hint `User $user`, but Admin is calling them
- **Solution:** Change policy methods to accept `User|Admin` union type:
    ```php
    public function delete(User|Admin $user, Listing $listing): bool
    ```

### Bug #3: Settings Blade — "Unable to locate a class or view for component [filament-panels::form]"

- **Error Location:** [resources/views/filament/pages/settings.blade.php](resources/views/filament/pages/settings.blade.php) line 2
- **Problem:** `<x-filament-panels::form>` doesn't exist in Filament v4
- **Solution:** Check Filament v4 docs and replace with correct component or `@livewire` directive

---

## ✅ Completed OshiMin Setup

- [x] Migration created + ran successfully (359ms)
- [x] Admin model created
- [x] Setting model + helpers created
- [x] Auth config (admin guard + admins provider)
- [x] Panel provider configured
- [x] StatsOverview widget
- [x] OrdersChart widget (heading property fixed)
- [x] ListingResource (fully fixed with correct Filament v4 namespaces)
- [x] TransactionResource (fully fixed)
- [x] UserResource (fully fixed)
- [x] ReviewResource (fully fixed)
- [x] Reports page (Blade, no components — working)
- [x] Settings page (structure ready, rendering broken)
- [x] Admin user seeded (`admin@oshimerch.com` / `oshimin123`)

---

## 🚚 OshiGo Admin Features — Plan (Belum Diimplementasi)

### Latar Belakang OshiGo

OshiGo adalah sistem pengiriman internal OshiMerch. Fitur yang sudah berjalan:

- Biaya ongkir per provinsi diambil dari `config/shipping.php` (34 provinsi, flat-rate)
- Saat seller packing → generate `oshigo_tracking_number` otomatis (format `OGO-YYYYMMDD-XXXX`)
- Tracking number disimpan di `transactions.oshigo_tracking_number`
- Biaya ongkir disimpan di `transactions.shipping_fee`
- Reports admin sudah menampilkan revenue per provinsi

### Yang Harus Ditambah di OshiMin Admin

#### 1. OshiGo Settings — Ubah Tarif Ongkir Per Provinsi

**Tujuan:** Admin bisa ubah harga ongkir per provinsi tanpa edit kode.

**Pendekatan:** Simpan tarif di `settings` table (existing) dengan key format `oshigo_rate_{province_slug}`.

**Contoh key/value:**

```
oshigo_rate_dki_jakarta    → 12000
oshigo_rate_jawa_barat     → 10000
oshigo_rate_bali           → 17000
...
```

**Cara slug:** `Str::slug($provinceName, '_')` → `'DKI Jakarta'` jadi `'dki_jakarta'`

**Di `TransactionController@checkout`** — ubah dari:

```php
$shippingFee = config('shipping.provinces.' . $request->shipping_province, 0);
```

Menjadi:

```php
$slug = Str::slug($request->shipping_province, '_');
$shippingFee = (int) Setting::get("oshigo_rate_{$slug}", config("shipping.provinces.{$request->shipping_province}", 0));
```

> Fallback ke config jika Setting belum diisi (backward compatible).

**Di `AdminPanelProvider` atau `AppServiceProvider`** — bisa seed default rates dari config ke settings table jika belum ada.

**Form di OshiMin Settings Page** — tambah Section baru "OshiGo Tarif Ongkir" berisi 34 field TextInput (atau pisah per region).

#### 2. OshiGo Resi Monitor — Panel Pantau Semua Tracking Number

**Tujuan:** Admin bisa lihat semua resi/tracking yang sedang aktif, siapa pengirim/penerima, status pengiriman.

**Pendekatan:** Bukan resource baru — tambah tab/filter di TransactionResource yang sudah ada, atau buat halaman custom `OshiGoMonitor`.

**Tampilan yang diinginkan:**
| Kolom | Source |
|---|---|
| Tracking No. | `transactions.oshigo_tracking_number` |
| Seller (Pengirim) | `transactions.seller.name` |
| Buyer (Penerima) | `transactions.buyer.name` |
| Provinsi | `transactions.shipping_province` |
| Ongkir | `transactions.shipping_fee` |
| Delivery Status | `transactions.delivery_status` |
| Waktu Pack | `transactions.updated_at` (saat status jadi Packed) |

**Filter yang dibutuhkan:**

- Delivery status (`Packed`, `Shipped`, `OutForDelivery`, `Delivered`)
- Provinsi
- Hanya tampil jika `oshigo_tracking_number` tidak null

**Actions yang berguna:**

- `Action::make('override_delivery')` — sudah ada di TransactionResource
- Tambah filter `->whereNotNull('oshigo_tracking_number')` untuk isolasi resi aktif

**Implementasi Opsi:**

- **Opsi A (simpel):** Tambah filter + tab "Resi Aktif" di TransactionResource yang ada
- **Opsi B (dedicated):** Buat halaman baru `app/Filament/Pages/OshiGoMonitor.php` dengan custom table menggunakan Filament Tables

### File yang Perlu Dibuat/Dimodifikasi

| File                                                | Aksi            | Keterangan                                                             |
| --------------------------------------------------- | --------------- | ---------------------------------------------------------------------- |
| `app/Filament/Pages/Settings.php`                   | Modify          | Tambah Section "OshiGo Tarif" + 34 field TextInput per provinsi        |
| `app/Http/Controllers/TransactionController.php`    | Modify          | Baca ongkir dari Setting, fallback ke config                           |
| `app/Providers/AppServiceProvider.php`              | Modify          | Seed default OshiGo rates ke settings table on boot (if not set)       |
| `app/Filament/Resources/TransactionResource.php`    | Modify          | Tambah filter `tracking_active` + tab resi                             |
| `app/Filament/Pages/OshiGoMonitor.php`              | Create (Opsi B) | Dedicated resi monitoring page                                         |
| `resources/views/filament/pages/settings.blade.php` | Modify          | Sudah harus dibenerin dulu (bug #3) sebelum bisa tambah section OshiGo |

### Urutan Pengerjaan (Next Session)

1. **Fix bugs dulu** (3 bug di atas — policy, section import, blade component)
2. **Tambah OshiGo rate fields di Settings.php** — 34 TextInput province grouped per region (Jawa, Sumatera, dll)
3. **Update `TransactionController`** — baca dari `Setting::get("oshigo_rate_{$slug}")`
4. **Seed default rates di AppServiceProvider** — agar tidak kosong saat pertama kali buka settings
5. **Tambah tab "Resi Aktif"** di TransactionResource (Opsi A)
6. **(Opsional)** Buat `OshiGoMonitor` page (Opsi B) untuk UX lebih clean

### Data Provinsi + Rate Default (untuk seed)

```php
// config/shipping.php — 34 provinsi, sudah lengkap
// Rate default (IDR):
// Jawa: 10.000 - 15.000
// Bali & NTT: 17.000 - 22.000
// Sumatera: 18.000 - 20.000
// Kalimantan: 22.000
// Sulawesi: 25.000
// Maluku: 28.000
// Papua: 30.000
```
