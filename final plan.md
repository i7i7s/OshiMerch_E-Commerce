# Plan Final: OshiMerch — Midtrans Sandbox & OshiGo Delivery Fix

> Dokumen ini adalah implementation plan untuk dua fitur utama: integrasi payment gateway Midtrans (mode sandbox) dan perbaikan alur delivery OshiGo agar konsisten dengan konsep OshiGo sebagai kurir milik platform.

---

## Daftar Fitur

| #   | Fitur                                     | Status                                 |
| --- | ----------------------------------------- | -------------------------------------- |
| 1   | Midtrans Payment Gateway (Sandbox)        | Belum diimplementasikan                |
| 2   | OshiGo Delivery Flow Fix (Seller → Admin) | Belum diimplementasikan                |
| 3   | Ongkir Configurable                       | Sudah ada — Admin Settings di Filament |

---

## Fitur 1: Midtrans Payment Gateway (Sandbox)

### Latar Belakang

Alur pembayaran saat ini bersifat manual:

1. Buyer memilih metode bayar (BCA/Dana/GoPay/ShopeePay/OVO) di Checkout
2. Buyer mentransfer ke rekening OshiMerch secara manual
3. Buyer upload bukti transfer di halaman transaksi
4. Admin mengkonfirmasi via Filament panel → `payment_status = Confirmed`

Alur ini rawan human error, lambat, dan tidak scalable. Dengan Midtrans Snap:

1. Buyer checkout → sistem generate Snap token
2. Buyer membayar via popup Midtrans (mendukung semua metode yang sudah ada + lebih banyak)
3. Midtrans webhook otomatis update `payment_status = Confirmed`
4. Seller langsung bisa packing tanpa menunggu konfirmasi manual

### Flow Baru Setelah Midtrans

```
Checkout.jsx
  └─ Submit form (tanpa pilih payment method)
       └─ POST /transactions → buat transaction (Pending) + generate snap_token → redirect /transactions/{id}

Transactions/Show.jsx
  └─ Buyer melihat status Pending
       └─ Klik "BAYAR SEKARANG" → window.snap.pay(snap_token)
            └─ Popup Midtrans terbuka → buyer bayar
                 └─ Midtrans kirim POST /midtrans/webhook
                      └─ Verifikasi signature → update payment_status = Confirmed
                           └─ Broadcast via Reverb → Show.jsx auto-update (tanpa refresh)
                                └─ Seller bisa langsung packing
```

### Implementasi Backend

#### 1. Install Package

```
composer require midtrans/midtrans-php
```

#### 2. Environment Variables (.env)

```
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js
```

#### 3. Config (config/services.php)

Tambah blok baru:

```php
'midtrans' => [
    'server_key'    => env('MIDTRANS_SERVER_KEY'),
    'client_key'    => env('MIDTRANS_CLIENT_KEY'),
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'snap_url'      => env('MIDTRANS_SNAP_URL', 'https://app.sandbox.midtrans.com/snap/snap.js'),
],
```

#### 4. Migration Baru

File: `database/migrations/2026_05_XX_000001_add_midtrans_to_transactions_table.php`

- Tambah kolom `midtrans_snap_token` (text, nullable) ke tabel `transactions`
- Kolom `payment_method` sudah ada → akan diisi dari webhook (nullable terlebih dahulu)

#### 5. TransactionController@store() — Modifikasi

File: `app/Http/Controllers/TransactionController.php`

Yang dihapus:

- Validasi `payment_method` → `required|in:BCA,Dana,GoPay,ShopeePay,OVO`
- Field `payment_method` dari `Transaction::create()` (akan diisi webhook)

Yang ditambah (setelah `Transaction::create()`):

```php
// Setup Midtrans
\Midtrans\Config::$serverKey    = config('services.midtrans.server_key');
\Midtrans\Config::$isProduction = config('services.midtrans.is_production');
\Midtrans\Config::$isSanitized  = true;
\Midtrans\Config::$is3ds        = true;

$params = [
    'transaction_details' => [
        'order_id'     => 'OM-' . $transaction->id . '-' . time(),
        'gross_amount' => $transaction->item_price + $transaction->shipping_fee,
    ],
    'customer_details' => [
        'first_name' => $request->recipient_name,
        'phone'      => $request->recipient_phone,
        'email'      => Auth::user()->email,
    ],
    'item_details' => [
        ['id' => $transaction->listing_id, 'price' => $transaction->item_price, 'quantity' => 1, 'name' => Str::limit($listing->title, 50)],
        ['id' => 'OSHIGO-SHIPPING', 'price' => $transaction->shipping_fee, 'quantity' => 1, 'name' => 'Ongkir OshiGo'],
    ],
];

$snapToken = \Midtrans\Snap::getSnapToken($params);
$transaction->update(['midtrans_snap_token' => $snapToken]);
```

Kemudian redirect ke `transactions.show`.

#### 6. TransactionController@show() — Modifikasi

Tambah `midtrans_snap_token` ke Inertia props (hanya expose jika buyer dan payment_status = Pending):

```php
'midtrans_snap_token' => (Auth::id() === $transaction->buyer_id && $transaction->payment_status === 'Pending')
    ? $transaction->midtrans_snap_token
    : null,
```

#### 7. MidtransController — Baru

File: `app/Http/Controllers/MidtransController.php`

Method `webhook(Request $request)`:

1. Verifikasi signature Midtrans:
    ```php
    $serverKey    = config('services.midtrans.server_key');
    $orderId      = $request->order_id;
    $statusCode   = $request->status_code;
    $grossAmount  = $request->gross_amount;
    $validSig     = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
    if ($validSig !== $request->signature_key) abort(403);
    ```
2. Parse `order_id` → extract transaction ID (format: `OM-{id}-{timestamp}`)
3. Cek `transaction_status`:
    - `settlement` atau `capture` → payment sukses
    - `expire` / `cancel` / `deny` → bisa di-handle (optional: update status atau biarkan)
4. Pada payment sukses:
    - Update `payment_status = 'Confirmed'`
    - Update `payment_method` dari `$request->payment_type` (gopay, bank_transfer, dll.)
    - Broadcast `TransactionStatusUpdated($transaction->fresh())`
    - Notifikasi ke buyer: "✅ Pembayaran Terkonfirmasi oleh Midtrans!"
    - Notifikasi ke seller: "✅ Pembayaran Terverifikasi! Silakan packing pesanan."
5. Return `response()->json(['status' => 'ok'])` — wajib HTTP 200

#### 8. routes/web.php — Modifikasi

Tambah webhook route di luar CSRF protection:

```php
// Di bagian atas, atau dalam withoutMiddleware block
Route::post('/midtrans/webhook', [MidtransController::class, 'webhook'])
    ->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
```

Route yang bisa dihapus (tidak dibutuhkan lagi):

- `POST /transactions/{transaction}/proof` → uploadProof

Route yang dipertahankan sebagai fallback admin:

- `PATCH /transactions/{transaction}/confirm-payment` → tetap ada (admin Filament sudah punya action sendiri)

### Implementasi Frontend

#### 9. Checkout.jsx — Modifikasi

File: `resources/js/Pages/Checkout.jsx`

Yang dihapus:

- `PAYMENT_METHODS` array (array 5 payment methods)
- State `payment_method` dari `form` state
- Step 3 "Metode Pembayaran" section (seluruh Section component beserta isinya)
- `form.payment_method` dari `canSubmit` check

Yang dimodifikasi:

- `canSubmit`: hapus kondisi `form.payment_method`
- Form data yang dikirim: hapus `payment_method` field
- Import: hapus yang tidak dipakai setelah penghapusan di atas

Teks note di bawah submit button: ubah dari "bayar dalam 1×24 JAM" → "kamu akan diarahkan ke halaman pembayaran Midtrans"

#### 10. Transactions/Show.jsx — Modifikasi

File: `resources/js/Pages/Transactions/Show.jsx`

Yang dihapus:

- `BANK_INFO` object (mapping BCA/Dana/GoPay/ShopeePay/OVO ke nomor rekening)
- Section "Upload Bukti Transfer" untuk buyer (form upload proof + preview image)
- Import atau referensi ke `uploadProof` form/route

Yang ditambah:

- Import `midtrans_snap_token` dari `transaction` props
- Midtrans Snap.js script loader (via `useEffect` atau langsung di `<Head>`):
    ```jsx
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute(
            "data-client-key",
            import.meta.env.VITE_MIDTRANS_CLIENT_KEY,
        );
        document.head.appendChild(script);
        return () => document.head.removeChild(script);
    }, []);
    ```
- Tambah ke `.env` dan `vite.config.js`: `VITE_MIDTRANS_CLIENT_KEY`
- Kondisi baru untuk buyer ketika `payment_status === 'Pending'`:
    ```jsx
    // Tombol bayar
    <button
        onClick={() =>
            window.snap.pay(transaction.midtrans_snap_token, {
                onSuccess: () => {
                    /* webhook sudah handle, Reverb akan push update */
                },
                onPending: () => {
                    /* tampilkan pesan "menunggu pembayaran" */
                },
                onError: () => {
                    /* tampilkan pesan error */
                },
                onClose: () => {
                    /* user menutup popup, tampilkan reminder */
                },
            })
        }
    >
        SELESAIKAN PEMBAYARAN VIA MIDTRANS
    </button>
    ```

### Filament Admin — Modifikasi

File: `app/Filament/Resources/TransactionResource.php`

Yang dihapus/disesuaikan:

- `view_proof` action → tambah kondisi `visible(fn (Transaction $r) => (bool) $r->proof_of_transfer_path)` sudah ada, tapi setelah Midtrans tidak ada proof path → action otomatis tidak muncul. **Tidak perlu dihapus**, biarkan saja.
- `confirm_payment` action → tetap ada sebagai **manual fallback** admin jika ada issue dengan webhook

---

## Fitur 2: OshiGo Delivery Flow Fix

### Latar Belakang & Analisis Masalah

**Masalah:** Seller saat ini bisa mengupdate delivery status ke `Shipped` dan `OutForDelivery`, padahal OshiGo adalah kurir milik platform OshiMerch — bukan kurir pihak ketiga yang dikontrol seller.

**Logika yang benar:**

- Seller → hanya bisa Pack (siapkan barang, serahkan ke kurir OshiGo)
- Admin OshiMerch → yang update `Shipped` (OshiGo sudah ambil paket) dan `OutForDelivery` (sedang diantar)
- Buyer → konfirmasi `Delivered` (barang diterima)

**Kondisi saat ini (TransactionPolicy.php):**

```php
// confirmPayment() → return false ✅ sudah blokir seller
// ship()           → return seller check ❌ harus diblokir
// outForDelivery() → return seller check ❌ harus diblokir
```

**Admin sudah punya `override_delivery` di Filament** — tapi generic (any→any, tanpa notifikasi/broadcast). Perlu ditambah action yang lebih eksplisit dan mengikuti flow yang benar.

### Flow Baru Setelah Fix

```
Seller: [Pack] → delivery_status = Packed
  └─ Info muncul: "Paket menunggu penjemputan OshiGo. Admin akan update status."

Admin (Filament): [Tandai Dikirim] → delivery_status = Shipped + broadcast + notif buyer
Admin (Filament): [Tandai Dalam Perjalanan] → delivery_status = OutForDelivery + broadcast + notif buyer

Buyer: [Diterima ✓] → delivery_status = Delivered
```

### Implementasi Backend

#### 1. TransactionPolicy.php — Modifikasi

File: `app/Policies/TransactionPolicy.php`

```php
// SEBELUM:
public function ship(User $user, Transaction $transaction): bool
{
    return $user->id === $transaction->seller_id
        && $transaction->delivery_status === 'Packed';
}

public function outForDelivery(User $user, Transaction $transaction): bool
{
    return $user->id === $transaction->seller_id
        && $transaction->delivery_status === 'Shipped';
}

// SESUDAH (blokir seller, admin via before()):
public function ship(User $user, Transaction $transaction): bool
{
    return false; // Only admin (via before()) can trigger this
}

public function outForDelivery(User $user, Transaction $transaction): bool
{
    return false; // Only admin (via before()) can trigger this
}
```

Catatan: Method `before()` di TransactionPolicy sudah ada dan mengembalikan `true` untuk semua `Admin` instance — jadi admin tetap bisa trigger ship/outForDelivery via route atau Filament action.

#### 2. TransactionController — Tidak Ada Perubahan Code

`ship()` dan `outForDelivery()` menggunakan `Gate::authorize('ship', $transaction)` — cukup dengan mengubah policy, controller tidak perlu diubah. Admin bisa memanggil route ini via Filament action.

### Filament Admin — Modifikasi

File: `app/Filament/Resources/TransactionResource.php`

Tambah 2 action baru di `->actions([])` setelah action `confirm_payment`:

**Action: mark_shipped**

```php
Action::make('mark_shipped')
    ->label('🚚 Tandai Dikirim (OshiGo)')
    ->icon('heroicon-o-truck')
    ->color('warning')
    ->requiresConfirmation()
    ->modalHeading('Konfirmasi: Paket Dikirim')
    ->modalDescription('OshiGo sudah mengambil paket dari seller dan sedang dalam perjalanan?')
    ->visible(fn (Transaction $r) => $r->delivery_status === 'Packed')
    ->action(function (Transaction $record): void {
        $record->update(['delivery_status' => 'Shipped']);
        broadcast(new \App\Events\TransactionStatusUpdated($record->fresh()));
        \App\Models\Notification::create([
            'user_id' => $record->buyer_id,
            'type'    => 'item_shipped',
            'title'   => '🚚 Paketmu Sudah Dikirim OshiGo!',
            'body'    => "Paket ({$record->oshigo_tracking_number}) sudah diambil OshiGo dan dalam perjalanan.",
            'url'     => "/transactions/{$record->id}",
            'data'    => ['transaction_id' => $record->id],
        ]);
    }),
```

**Action: mark_out_for_delivery**

```php
Action::make('mark_out_for_delivery')
    ->label('📍 Tandai Dalam Perjalanan')
    ->icon('heroicon-o-map-pin')
    ->color('info')
    ->requiresConfirmation()
    ->modalHeading('Konfirmasi: Dalam Perjalanan')
    ->modalDescription('OshiGo sedang mengantar paket ke alamat pembeli?')
    ->visible(fn (Transaction $r) => $r->delivery_status === 'Shipped')
    ->action(function (Transaction $record): void {
        $record->update(['delivery_status' => 'OutForDelivery']);
        broadcast(new \App\Events\TransactionStatusUpdated($record->fresh()));
        \App\Models\Notification::create([
            'user_id' => $record->buyer_id,
            'type'    => 'out_for_delivery',
            'title'   => '📍 Paketmu Sedang Dalam Perjalanan!',
            'body'    => "Paket OshiGo ({$record->oshigo_tracking_number}) sedang menuju alamatmu.",
            'url'     => "/transactions/{$record->id}",
            'data'    => ['transaction_id' => $record->id],
        ]);
    }),
```

Pertahankan `override_delivery` untuk emergency override.

### Frontend — Modifikasi

File: `resources/js/Pages/Transactions/Show.jsx`

**Yang dihapus (seller actions):**

- Button "TANDAI DIKIRIM" beserta kondisinya (`delivery_status === 'Packed'` && isSeller)
- Button "TANDAI DALAM PERJALANAN" beserta kondisinya (`delivery_status === 'Shipped'` && isSeller)

**Yang ditambah:**

- Ketika `delivery_status === 'Packed'` dan user adalah seller → tampilkan info card:
    ```
    📦 Barang telah di-packing! Tunggu OshiGo mengambil paket.
    Admin OshiMerch akan memperbarui status pengiriman saat paket diambil.
    ```
- Ketika `delivery_status === 'Shipped'` dan user adalah buyer → tampilkan info:
    ```
    🚚 OshiGo sedang mengantarkan paketmu. Pantau statusnya di sini.
    ```

---

## Fitur 3: Ongkir OshiGo (Sudah Ada — Tidak Ada Perubahan Code)

### Status: ✅ Sudah Configurable

Admin dapat mengatur tarif ongkir per provinsi melalui:

- **URL:** `/admin/settings`
- **Section:** "OshiGo — Tarif Pengiriman"
- **Mekanisme:** Data disimpan ke tabel `settings` dengan key `oshigo_rate_{slug_provinsi}`, override nilai dari `config/shipping.php`

Tidak ada perubahan code yang diperlukan untuk fitur ini.

---

## Ringkasan File yang Diubah

### Baru (New Files)

| File                                                              | Keterangan                         |
| ----------------------------------------------------------------- | ---------------------------------- |
| `app/Http/Controllers/MidtransController.php`                     | Webhook handler Midtrans           |
| `database/migrations/2026_05_XX_add_midtrans_to_transactions.php` | Tambah kolom `midtrans_snap_token` |

### Dimodifikasi (Modified Files)

| File                                             | Perubahan                                                                                                  |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `app/Http/Controllers/TransactionController.php` | `store()`: hapus payment_method validasi, generate snap_token; `show()`: expose snap_token ke Inertia      |
| `app/Policies/TransactionPolicy.php`             | `ship()` dan `outForDelivery()` → return false                                                             |
| `app/Filament/Resources/TransactionResource.php` | Tambah `mark_shipped` dan `mark_out_for_delivery` actions                                                  |
| `config/services.php`                            | Tambah blok `midtrans`                                                                                     |
| `routes/web.php`                                 | Tambah `/midtrans/webhook` (exclude CSRF), hapus `/transactions/{id}/proof`                                |
| `resources/js/Pages/Checkout.jsx`                | Hapus payment method selection (Step 3)                                                                    |
| `resources/js/Pages/Transactions/Show.jsx`       | Hapus upload proof section, tambah Snap.js + bayar button, hapus ship/OFD seller buttons, tambah info card |
| `.env`                                           | Tambah MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION, VITE_MIDTRANS_CLIENT_KEY          |

---

## Urutan Implementasi (Dependency Order)

```
Step 1: Tambah kredensial ke .env
Step 2: Update config/services.php
Step 3: composer require midtrans/midtrans-php
Step 4: Buat & jalankan migration (midtrans_snap_token)
Step 5: Modifikasi TransactionController@store() + show()
Step 6: Buat MidtransController (webhook)
Step 7: Update routes/web.php
Step 8: Modifikasi TransactionPolicy (ship, outForDelivery → false)
Step 9: Modifikasi TransactionResource (tambah 2 Filament actions)
Step 10: Modifikasi Checkout.jsx (hapus payment method step)
Step 11: Modifikasi Show.jsx (hapus upload proof, tambah Snap, hapus ship/OFD buttons)
Step 12: Verifikasi end-to-end dengan Midtrans sandbox test cards
```

---

## Verifikasi

### Midtrans

- [ ] Checkout → submit tanpa pilih payment method → berhasil buat transaction
- [ ] Show.jsx → tombol "BAYAR SEKARANG" muncul saat `payment_status = Pending`
- [ ] Klik tombol → Snap popup Midtrans terbuka
- [ ] Bayar dengan Midtrans sandbox test number → webhook terpanggil
- [ ] `payment_status` berubah ke `Confirmed` tanpa refresh (via Reverb)
- [ ] Notifikasi muncul untuk buyer dan seller
- [ ] Seller bisa langsung Pack setelah payment_status = Confirmed

### OshiGo Fix

- [ ] Seller tidak lagi punya tombol "TANDAI DIKIRIM" dan "TANDAI DALAM PERJALANAN"
- [ ] Setelah Pack, seller melihat info card "Tunggu OshiGo ambil paket"
- [ ] Admin Filament melihat action "🚚 Tandai Dikirim (OshiGo)" saat delivery_status = Packed
- [ ] Admin Filament melihat action "📍 Tandai Dalam Perjalanan" saat delivery_status = Shipped
- [ ] Setelah admin tandai Shipped → buyer menerima notifikasi + Reverb push update
- [ ] Buyer masih bisa klik "DITERIMA ✓" saat delivery_status = OutForDelivery

---

## Catatan Teknis

### Midtrans Sandbox Test

- Kartu Kredit: `4811 1111 1111 1114`, CVV: `123`, Exp: any future date, OTP: `112233`
- GoPay: pilih GoPay → klik "Pay" di simulator → otomatis settle
- Webhook URL sandbox perlu bisa diakses publik → gunakan **ngrok** atau **expose** saat development lokal

### Keamanan Webhook

Selalu verifikasi signature Midtrans sebelum memproses webhook. Jangan langsung percaya payload tanpa verifikasi.

### CSRF Webhook

Route `/midtrans/webhook` harus exempt dari CSRF karena Midtrans adalah pihak eksternal. Gunakan `->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class])`.

### payment_method Field

Setelah Midtrans, kolom `payment_method` di DB akan diisi dari `payment_type` webhook Midtrans (contoh: `gopay`, `bank_transfer`, `credit_card`). Kolom bisa bernilai `null` sebelum webhook terpanggil.
