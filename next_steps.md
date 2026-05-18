# Panduan Pengembangan Selanjutnya: Webhook & Deployment

Dokumen ini berisi langkah-langkah untuk mengaktifkan fitur otomatisasi pembayaran (Webhook) dan persiapan deployment.

## 1. Setup Webhook Otomatis (Localhost via ngrok)

Agar status pembayaran berubah otomatis dari **Pending** ke **Confirmed** tanpa bantuan Admin, gunakan ngrok:

1.  **Jalankan ngrok:**
    ```bash
    ngrok http 8000
    ```
2.  **Ambil URL ngrok:** Copy URL `https` yang diberikan (contoh: `https://abcd-123.ngrok-free.app`).
3.  **Daftarkan di Midtrans:**
    *   Buka [Dashboard Midtrans Sandbox](https://dashboard.sandbox.midtrans.com/)
    *   Menu: **Settings > Configuration**
    *   Isi **Payment Notification URL** dengan: `[URL-NGROK-KAMU]/midtrans/webhook`
    *   Klik **Update** di bagian bawah.
4.  **Uji Coba:**
    *   Lakukan transaksi baru.
    *   Bayar di popup Midtrans.
    *   Tunggu 1-2 detik, status di website akan berubah otomatis menjadi lunas (Confirmed).

---

## 2. Persiapan Deployment (Hosting)

Jika proyek ini akan di-upload ke server (VPS/Shared Hosting):

1.  **Update .env di Server:**
    *   Ubah `MIDTRANS_IS_PRODUCTION` menjadi `true` (jika menggunakan akun production).
    *   Ubah `MIDTRANS_SNAP_URL` menjadi `https://app.midtrans.com/snap/snap.js`.
    *   Gunakan Server Key & Client Key Production.
2.  **Ganti Notification URL:**
    *   Di dashboard Midtrans, ganti URL ngrok tadi dengan domain asli kamu.
    *   Contoh: `https://oshimerch.com/midtrans/webhook`.
3.  **Real-time (Laravel Reverb):**
    *   Pastikan `php artisan reverb:start` jalan di server agar notifikasi status pengiriman bisa muncul tanpa refresh.

---

## 3. Fitur Tambahan yang Bisa Dieksplor

- **Refund System:** Menambahkan fitur pengembalian dana otomatis jika pesanan dibatalkan admin.
- **Auto-Cancel:** Membuat command `php artisan` untuk membatalkan transaksi yang tidak dibayar dalam 24 jam.
- **WhatsApp Notification:** Integrasi dengan API WhatsApp (seperti Fonnte) untuk mengirim resi OshiGo langsung ke WA pembeli.

---

**OshiMerch Team**
*Development Status: Midtrans Integrated, OshiGo Logistics Verified.*
