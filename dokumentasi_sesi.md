# Dokumentasi Pengembangan OshiMerch (Sesi Terakhir)

Dokumen ini berisi rangkuman seluruh fitur, perbaikan bug, dan integrasi UI/UX yang telah diselesaikan pada sesi ini untuk proyek **OshiMerch**.

---

## 1. Sistem Error Handling Global & Deteksi Sinyal
- **Custom Error Boundary**: Memodifikasi handler eksepsi Laravel (`bootstrap/app.php`) agar meneruskan semua pesan error HTTP (seperti `404 Not Found`, `403 Forbidden`, `500 Server Error`, dan `503 Maintenance`) ke halaman React khusus (`Pages/Error.jsx`).
- **Offline Detector**: Mengimplementasikan deteksi jaringan *real-time* di tingkat frontend (`app.jsx`) yang akan langsung menampilkan layar "Tidak Ada Koneksi Internet" ketika user kehilangan sinyal WiFi/Data, dan akan kembali normal saat sinyal kembali.
- **Desain Seragam**: Layar error didesain selaras dengan bahasa desain OshiMerch (modern, putih-abu, dengan icon animasi yang ramah).

## 2. Pembaruan Dashboard & API Member
- **Perbaikan Endpoint**: Mengganti URL API member yang usang dengan *endpoint* Vercel terbaru.
- **Fuzzy Matching Cerdas**: Mengubah algoritma pencocokan data dari database lokal ke API agar dapat mencocokkan *nickname* (sehingga member seperti "Erine" berhasil dicocokkan dengan "Catherina Vallencia").
- **Perbaikan Filter JKT48V**: Memperbaiki nilai parameter tim JKT48 Virtual (`VIRTUAL` menjadi `JKT48_VIRTUAL`) sehingga data mereka kembali muncul di beranda dan tab kategori.

## 3. Halaman Detail Member (Anti-Mainstream)
- **Navigasi Route Baru**: Mengubah aksi klik pada kartu member dari *Pop-up Modal* menjadi transisi rute penuh ke halaman `/members/{code}`.
- **Animasi Kelas Atas (GSAP & Framer Motion)**:
  - **Parallax Background**: Efek *glassmorphism* dan cahaya bias dinamis yang warnanya menyesuaikan tim member.
  - **3D Perspective Reveal**: Efek rotasi elegan pada foto member saat halaman pertama kali dimuat.
  - **Stagger & ScrollTrigger**: Teks, biodata, dan Jikoshoukai masuk secara berurutan dan memantul saat layar digulir (di-*scroll*).
- **Integrasi Produk**: Menampilkan *merchandise* (listing) yang terikat langsung dengan sang member pada bagian bawah halamannya.
- **Social Media Hub**: Menambahkan desain antarmuka bergaya "Feed Sosial Media" sebagai *mockup* interaktif untuk menghubungkan user ke akun resmi Instagram, TikTok, dan X milik member.
- **Bug Fix (Error 500)**: Menuntaskan *fatal error* "Undefined relationship seller" dengan mengubah relasi query Eloquent dari `seller` menjadi `user` pada `MemberController`.

## 4. Pusat Bantuan & Kebijakan (Unified Help Center)
- **Single Page Application (SPA) Kuat**: Alih-alih membuat 9 rute dan halaman HTML terpisah yang kaku, seluruh dokumen bantuan dikemas ke dalam satu halaman dinamis (`Pages/Help.jsx`).
- **Fitur Halaman Help**:
  - Terdapat **Live Search** untuk mencari kata kunci secara instan (misal: "retur").
  - Sistem **Vertical Tabs** di sisi kiri dengan animasi geser dan penanda aktif (*ChevronRight*).
  - Integrasi **URL Query Parameter** (`?tab=cara-jual`) sehingga setiap topik bisa dibagikan (*shareable*).
  - Tautan *Footer* di seluruh situs web telah dipetakan ke tab yang benar.

---
*Pekerjaan selesai, aplikasi siap di-deploy!* 🚀
