# 🔴 OshiMerch — Fitur yang Akan Diimplementasi dengan Laravel Reverb

> Berdasarkan studi PRD (Fase 4 Roadmap, line 47) dan audit struktur proyek saat ini.

---

## Status Saat Ini

| Aspek | Kondisi |
|---|---|
| **Broadcasting** | ❌ Belum ada — tidak ada `broadcasting.php`, tidak ada Echo/Pusher/Reverb di frontend |
| **Chat** | HTTP request-response (Inertia `post()` → full page reload) — **bukan** real-time |
| **Notifikasi** | REST API polling via `axios.get('/api/notifications')` — **bukan** push |
| **Transaksi update** | Redirect response (`back()`) — user harus refresh untuk lihat perubahan |
| **Dependencies** | `laravel/reverb` ❌ belum di `composer.json`, `laravel-echo` ❌ belum di `package.json` |

---

## Daftar Fitur yang Akan Menggunakan Laravel Reverb

### 1. 💬 Real-Time Direct Chat (Private Channel)

**Channel:** `private-conversation.{conversationId}`
**Event:** `DirectMessageSent`

| Item | Detail |
|---|---|
| **Saat ini** | User kirim pesan via `POST /chat/conversations/{id}/messages` → Inertia redirect `back()` → full Inertia reload untuk lihat pesan baru |
| **Dengan Reverb** | Pesan langsung muncul di kedua sisi tanpa reload. Bubble chat baru di-*append* secara instan via WebSocket |
| **File terdampak** | |

**Backend:**
- [ConversationController.php](file:///c:/laragon/www/OshiMerch/app/Http/Controllers/ConversationController.php) — dispatch event setelah `DirectMessage::create()`
- `app/Events/DirectMessageSent.php` — **[NEW]** Broadcast event
- `routes/channels.php` — **[NEW]** Authorization untuk private channel

**Frontend:**
- [Chat/Direct.jsx](file:///c:/laragon/www/OshiMerch/resources/js/Pages/Chat/Direct.jsx) — listen ke channel, append pesan baru tanpa reload
- [bootstrap.js](file:///c:/laragon/www/OshiMerch/resources/js/bootstrap.js) — setup Laravel Echo + Reverb

---

### 2. 💬 Real-Time Transaction Chat (Private Channel)

**Channel:** `private-transaction.{transactionId}`
**Event:** `TransactionMessageSent`

| Item | Detail |
|---|---|
| **Saat ini** | Chat di halaman transaksi (`/transactions/{id}`) juga via `POST /transactions/{id}/messages` → Inertia redirect |
| **Dengan Reverb** | Pesan muncul real-time di halaman detail transaksi untuk buyer & seller |
| **File terdampak** | |

**Backend:**
- [MessageController.php](file:///c:/laragon/www/OshiMerch/app/Http/Controllers/MessageController.php) — dispatch event
- `app/Events/TransactionMessageSent.php` — **[NEW]**

**Frontend:**
- [Transactions/Show.jsx](file:///c:/laragon/www/OshiMerch/resources/js/Pages/Transactions/Show.jsx) — listen ke channel transaksi

---

### 3. 🔔 Real-Time Push Notifications (Private Channel)

**Channel:** `private-notifications.{userId}`
**Event:** `NewNotification`

| Item | Detail |
|---|---|
| **Saat ini** | Navbar component fetch notifikasi via `GET /api/notifications` — kemungkinan **tanpa polling interval** (hanya fetch sekali saat mount, karena tidak ditemukan `setInterval` di codebase) |
| **Dengan Reverb** | Notifikasi muncul instan di bell icon navbar, badge count langsung update, tanpa perlu refresh halaman |
| **Notifikasi yang di-push** | |

Semua event notifikasi yang sudah ada di [Notification model](file:///c:/laragon/www/OshiMerch/app/Models/Notification.php):

| Event Type | Trigger | Penerima |
|---|---|---|
| `transaction_paid` | Buyer upload bukti bayar | Seller |
| `payment_confirmed` | Seller konfirmasi pembayaran | Buyer |
| `item_shipped` | Seller input resi | Buyer |
| `transaction_completed` | Buyer klik "Barang Diterima" | Seller |
| `new_message` | User kirim chat | Lawan chat |
| `new_listing` | Listing baru dibuat (matching oshi) | Fans member terkait |

**Backend:**
- [NotificationController.php](file:///c:/laragon/www/OshiMerch/app/Http/Controllers/NotificationController.php) — tetap untuk REST API (mark read, delete)
- [Notification.php model](file:///c:/laragon/www/OshiMerch/app/Models/Notification.php) — dispatch broadcast event di setiap static factory method
- `app/Events/NewNotification.php` — **[NEW]**

**Frontend:**
- [Navbar.jsx](file:///c:/laragon/www/OshiMerch/resources/js/Components/Navbar.jsx) — listen ke private channel, update badge & dropdown tanpa fetch ulang

---

### 4. 📦 Real-Time Transaction Status Updates (Private Channel)

**Channel:** `private-transaction.{transactionId}`
**Event:** `TransactionStatusUpdated`

| Item | Detail |
|---|---|
| **Saat ini** | Perubahan status (`Pending → Paid → Confirmed → Shipped → Completed`) hanya terlihat setelah user refresh halaman atau navigate ulang |
| **Dengan Reverb** | Status bar/progress indicator di halaman transaksi update secara live. Buyer & Seller melihat perubahan instan |
| **File terdampak** | |

**Backend:**
- [TransactionController.php](file:///c:/laragon/www/OshiMerch/app/Http/Controllers/TransactionController.php) — dispatch event di `uploadProof()`, `confirmPayment()`, `ship()`, `complete()`
- `app/Events/TransactionStatusUpdated.php` — **[NEW]**

**Frontend:**
- [Transactions/Show.jsx](file:///c:/laragon/www/OshiMerch/resources/js/Pages/Transactions/Show.jsx) — listen ke event, update status badge & progress stepper secara live
- [Dashboard.jsx](file:///c:/laragon/www/OshiMerch/resources/js/Pages/Dashboard.jsx) — opsional: update daftar transaksi di dashboard

---

### 5. 🟢 Online Presence / Typing Indicator (Presence Channel)

**Channel:** `presence-conversation.{conversationId}`
**Event:** Client-side `whisper` events

| Item | Detail |
|---|---|
| **Saat ini** | Tidak ada indikator online/offline maupun typing |
| **Dengan Reverb** | Tampilkan dot hijau "Online" di header chat, dan "sedang mengetik..." di bawah input area |
| **File terdampak** | |

**Frontend:**
- [Chat/Direct.jsx](file:///c:/laragon/www/OshiMerch/resources/js/Pages/Chat/Direct.jsx) — join presence channel, listen `here`/`joining`/`leaving` + `whisper('typing')`

> [!NOTE]
> Fitur ini menggunakan **Presence Channel** (bukan Private Channel biasa). Laravel Reverb mendukung presence channel secara native.

---

### 6. 🏷️ Real-Time Listing Status Update (Public/Private Channel)

**Channel:** `public-listings` atau `private-listings.{userId}`
**Event:** `ListingStatusChanged`

| Item | Detail |
|---|---|
| **Saat ini** | Ketika listing berubah status (Available → Reserved → Sold), halaman produk tidak ter-update sampai user refresh |
| **Dengan Reverb** | Halaman products & detail produk menampilkan status terkini secara live. Mencegah user mencoba membeli barang yang sudah Reserved/Sold |
| **File terdampak** | |

**Backend:**
- [ListingController.php](file:///c:/laragon/www/OshiMerch/app/Http/Controllers/ListingController.php) — dispatch event saat status berubah
- [TransactionController.php](file:///c:/laragon/www/OshiMerch/app/Http/Controllers/TransactionController.php) — dispatch event saat listing di-Reserve/Sold
- `app/Events/ListingStatusChanged.php` — **[NEW]**

**Frontend:**
- [Products.jsx](file:///c:/laragon/www/OshiMerch/resources/js/Pages/Products.jsx) — listen event, update card status badge
- Product detail page — disable tombol "Beli" jika status berubah

---

## Ringkasan File Baru yang Diperlukan

| File | Tipe |
|---|---|
| `app/Events/DirectMessageSent.php` | Broadcast Event |
| `app/Events/TransactionMessageSent.php` | Broadcast Event |
| `app/Events/NewNotification.php` | Broadcast Event |
| `app/Events/TransactionStatusUpdated.php` | Broadcast Event |
| `app/Events/ListingStatusChanged.php` | Broadcast Event |
| `routes/channels.php` | Channel Authorization |
| `config/broadcasting.php` | Laravel config (auto-published by Reverb) |
| `config/reverb.php` | Reverb config (auto-published) |

## Ringkasan Dependencies Baru

| Package | Tipe | Tujuan |
|---|---|---|
| `laravel/reverb` | Composer (PHP) | WebSocket server |
| `laravel-echo` | NPM (JS) | Frontend WebSocket client |
| `pusher-js` | NPM (JS) | Protocol client (digunakan Echo under the hood) |

## Prioritas Implementasi (Rekomendasi)

| Urutan | Fitur | Alasan |
|---|---|---|
| **1** | 🔧 Setup infra (install Reverb, Echo, channels.php) | Foundation — semua fitur lain bergantung pada ini |
| **2** | 💬 Real-Time Direct Chat | Core feature — impact paling besar, paling sering dipakai user |
| **3** | 🔔 Push Notifications | User experience — notifikasi instan tanpa refresh |
| **4** | 📦 Transaction Status Updates | Trust & transparency — seller/buyer lihat progress real-time |
| **5** | 💬 Transaction Chat | Pelengkap chat di halaman transaksi |
| **6** | 🟢 Presence / Typing Indicator | Polish — nice-to-have, menambah kesan "hidup" |
| **7** | 🏷️ Listing Status Update | Prevent stale state, UX improvement |

---

> [!IMPORTANT]
> Apakah kamu ingin saya langsung buat **implementation plan** lengkap untuk implementasi Reverb, atau ada fitur yang mau diprioritaskan / di-skip?
