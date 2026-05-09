# OshiMerch - E-Commerce Marketplace untuk JKT48 Fans

**OshiMerch** adalah platform marketplace modern yang khusus dirancang untuk fans JKT48 guna mempermudah jual-beli merchandise. Platform ini dibangun dengan teknologi full-stack terkini, mengintegrasikan backend Laravel yang powerful dengan frontend React yang responsif, dan dilengkapi dengan animasi smooth menggunakan GSAP.

🎀 **Website**: [OshiMerch](http://oshimerch.test)  
💬 **Deskripsi**: Marketplace khusus fans JKT48 untuk jual-beli merchandise. Aman, transparan, dan berbasis komunitas.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi](#-instalasi)
- [Setup Development](#-setup-development)
- [Menjalankan Project](#-menjalankan-project)
- [Dokumentasi Teknologi](#-dokumentasi-teknologi)
- [Struktur Project](#-struktur-project)
- [Database](#-database)
- [API & Routing](#-api--routing)
- [Contributing](#-contributing)

---

## ✨ Fitur Utama

- ✅ **Sistem Autentikasi Aman** - Login, register dengan validasi berlapis
- ✅ **Marketplace Listing** - User dapat membuat dan mengelola listing produk
- ✅ **Direct Messaging** - Chat real-time antar user
- ✅ **Transaksi & Payment** - Sistem pembayaran terintegrasi
- ✅ **Review & Rating** - User dapat memberikan review untuk produk
- ✅ **Favorites** - User dapat menyimpan listing favorit
- ✅ **Notifications** - Notifikasi real-time untuk aktivitas penting
- ✅ **Responsive UI** - Interface yang responsif di desktop, tablet, dan mobile
- ✅ **Smooth Animations** - Animasi halus menggunakan GSAP

---

## 🛠️ Tech Stack

### **Backend**

| Teknologi             | Versi | Deskripsi                               |
| --------------------- | ----- | --------------------------------------- |
| **Laravel**           | 13.7  | Web framework PHP modern untuk backend  |
| **PHP**               | 8.3+  | Bahasa pemrograman server-side          |
| **Laravel Sanctum**   | 4.0   | API authentication dan token management |
| **Laravel Socialite** | 5.27  | Social login integration                |
| **Inertia Laravel**   | 2.0   | Server-side adapter untuk Inertia.js    |

### **Frontend**

| Teknologi         | Versi | Deskripsi                                   |
| ----------------- | ----- | ------------------------------------------- |
| **React**         | 19.0  | Library UI components yang deklaratif       |
| **Inertia.js**    | 2.0   | Full-stack framework untuk SPA tanpa API    |
| **Vite**          | 6.0   | Build tool & dev server yang lightning-fast |
| **Tailwind CSS**  | 4.0   | Utility-first CSS framework                 |
| **GSAP**          | 3.15  | Animation library professional-grade        |
| **Framer Motion** | 12.38 | Animation library untuk React               |
| **Lenis**         | 1.3   | Smooth scroll library                       |

### **Tools & Utilities**

| Teknologi                    | Versi | Deskripsi                            |
| ---------------------------- | ----- | ------------------------------------ |
| **Composer**                 | -     | Dependency manager untuk PHP         |
| **npm**                      | -     | Package manager untuk Node.js        |
| **Tailwind CSS Vite Plugin** | 4.0   | Vite plugin untuk Tailwind CSS       |
| **Lucide React**             | 1.14  | Icon library untuk React             |
| **Axios**                    | 1.16  | HTTP client untuk request            |
| **Tailwind Merge**           | 3.5   | Utility untuk merge Tailwind classes |

### **Database**

| Komponen   | Deskripsi                          |
| ---------- | ---------------------------------- |
| **MySQL**  | Relational database utama          |
| **SQLite** | Alternative database (development) |

---

## 💻 Persyaratan Sistem

Sebelum memulai, pastikan Anda memiliki:

### **Minimum Requirements**

- **PHP**: 8.3 atau lebih tinggi
- **Node.js**: 18 atau lebih tinggi (dengan npm)
- **Composer**: 2.0 atau lebih tinggi
- **MySQL**: 8.0 atau lebih tinggi (atau gunakan SQLite untuk development)
- **Git**: Untuk version control

### **Recommended Setup**

- **OS**: Windows 10+, macOS 10.15+, atau Linux (Ubuntu 20.04+)
- **RAM**: Minimal 4GB (8GB recommended)
- **Disk Space**: Minimal 2GB
- **Browser**: Chrome, Firefox, Safari, atau Edge (modern versions)

### **Installation Environment (Windows)**

Untuk Windows, Anda dapat menggunakan **Laragon** atau **XAMPP**:

- [Laragon](https://laragon.org/) - Recommended, development environment terlengkap
- [XAMPP](https://www.apachefriends.org/) - Alternative

---

## 🚀 Instalasi

### **Step 1: Clone Repository**

```bash
# Clone project dari GitHub
git clone https://github.com/i7i7s/OshiMerch_E-Commerce.git

# Masuk ke directory project
cd OshiMerch
```

### **Step 2: Install PHP & Composer**

#### **Windows (PowerShell - Run as Administrator)**

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
```

#### **macOS**

```bash
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"
```

#### **Linux (Ubuntu/Debian)**

```bash
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"
```

**Verifikasi instalasi:**

```bash
php --version
composer --version
```

### **Step 3: Install Node.js & npm**

Download dari [nodejs.org](https://nodejs.org/) atau gunakan package manager:

#### **Windows (Menggunakan Chocolatey)**

```powershell
choco install nodejs
```

#### **macOS (Menggunakan Homebrew)**

```bash
brew install node
```

#### **Linux (Ubuntu/Debian)**

```bash
sudo apt update
sudo apt install nodejs npm
```

**Verifikasi instalasi:**

```bash
node --version
npm --version
```

### **Step 4: Install Laravel & Project Dependencies**

#### **Via Composer (Recommended)**

```bash
# Install PHP dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Install Node.js dependencies
npm install

# Build frontend assets
npm run build
```

### **Step 5: Setup Database**

#### **Konfigurasi Environment**

Edit file `.env`:

```env
# Database Configuration
DB_CONNECTION=mysql          # atau sqlite untuk development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=oshimerch
DB_USERNAME=root
DB_PASSWORD=                 # leave empty jika tanpa password

# Application
APP_NAME=OshiMerch
APP_URL=http://oshimerch.test
APP_DEBUG=true              # false untuk production

# Locale
APP_LOCALE=id               # locale Indonesia
APP_FALLBACK_LOCALE=en
```

#### **Create & Migrate Database**

```bash
# Create database (jika belum ada)
php artisan migrate:fresh

# Or untuk production (tanpa seeding)
php artisan migrate

# Seed database dengan data dummy (optional)
php artisan db:seed
```

**Daftar table yang dibuat:**

- `users` - Data user
- `listings` - Data produk yang dijual
- `transactions` - Riwayat transaksi
- `messages` - Pesan antar user
- `conversations` - Daftar percakapan
- `reviews` - Review & rating produk
- `notifications` - Notifikasi user
- `favorites` - Produk favorit user
- `direct_messages` - Direct message antar user

### **Step 6: Setup Virtual Host (Optional)**

Jika menggunakan Laragon:

```bash
# Laragon akan auto-generate virtual host
# Akses: http://oshimerch.test
```

Atau manual di `hosts` file:

**Windows** (`C:\Windows\System32\drivers\etc\hosts`):

```
127.0.0.1 oshimerch.test
```

**macOS/Linux** (`/etc/hosts`):

```
127.0.0.1 oshimerch.test
```

---

## 🎯 Setup Development

### **Environment Variables**

Semua konfigurasi tersedia di file `.env`. Key variables:

```env
# App Configuration
APP_NAME=OshiMerch
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_DATABASE=oshimerch
DB_USERNAME=root
DB_PASSWORD=

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Cache & Queue
CACHE_STORE=database
QUEUE_CONNECTION=database

# Mail (untuk development)
MAIL_MAILER=log

# Locale
APP_LOCALE=id
```

### **Tailwind CSS Setup**

Tailwind CSS sudah dikonfigurasi dengan Vite plugin. File konfigurasi:

```javascript
// vite.config.js
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
});
```

### **GSAP Animation Setup**

GSAP sudah ter-install di dependencies. Gunakan dengan:

```javascript
import gsap from "gsap";

// Basic animation
gsap.to(".element", {
    duration: 1,
    x: 100,
    rotation: 27,
    ease: "power2.inOut",
});

// Timeline untuk sequential animations
const tl = gsap.timeline();
tl.to("#element1", { duration: 1, x: 100 })
    .to("#element2", { duration: 1, x: 100 })
    .to("#element3", { duration: 1, x: 100 });
```

---

## ▶️ Menjalankan Project

### **Development Mode (All-in-One)**

Jalankan semua services sekaligus menggunakan script:

```bash
npm run dev
```

Ini akan menjalankan:

- 🖥️ Laravel development server (port 8000)
- 🚀 Vite dev server (port 5173)
- 📨 Queue listener
- 📝 Log streaming

**Akses aplikasi:**

- Web: `http://localhost:8000` atau `http://oshimerch.test`
- Vite HMR: `http://localhost:5173`

### **Frontend Development Only**

```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start Vite dev server
npm run dev
```

### **Production Build**

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Serve dengan production settings
php artisan serve --env=production
```

### **Database Commands**

```bash
# Create & migrate
php artisan migrate:fresh

# Seed dengan dummy data
php artisan db:seed

# Revert migrations
php artisan migrate:rollback

# Check migrations status
php artisan migrate:status
```

### **Queue & Background Jobs**

```bash
# Listen untuk queue jobs
php artisan queue:listen

# Process queue jobs once
php artisan queue:work --once
```

---

## 📚 Dokumentasi Teknologi

### **📖 Laravel 13.x**

**Dokumentasi Official**: https://laravel.com/docs/13.x

Laravel adalah web framework PHP modern yang menyediakan:

- ✅ Routing yang ekspresif
- ✅ Middleware & authentication
- ✅ Database abstraction layer (Eloquent ORM)
- ✅ Migration & seeding
- ✅ Dependency injection
- ✅ Testing tools

**Key Commands:**

```bash
# Create model dengan migration
php artisan make:model Listing -m

# Create controller
php artisan make:controller ListingController

# Create middleware
php artisan make:middleware CheckRole

# Create job untuk background tasks
php artisan make:job SendNotification
```

### **⚡ Inertia.js 2.0**

**Dokumentasi Official**: https://inertiajs.com

Inertia.js menghubungkan frontend dan backend tanpa perlu separate API:

```php
// Backend (Laravel Controller)
return Inertia::render('Listing/Show', [
    'listing' => $listing,
    'reviews' => $listing->reviews()->get(),
]);
```

```jsx
// Frontend (React Component)
import { usePage } from "@inertiajs/react";

export default function Show() {
    const { listing, reviews } = usePage().props;
    return <div>{listing.title}</div>;
}
```

**Fitur Utama:**

- Server-side routing dengan client-side feel
- Automatic code-splitting
- Props pagination
- Form handling validation

### **⚛️ React 19**

**Dokumentasi Official**: https://react.dev

React adalah library JavaScript untuk membangun interactive UIs:

**Hooks yang paling sering digunakan:**

```javascript
import { useState, useEffect, useContext } from "react";

function Component() {
    const [state, setState] = useState(initialValue);

    useEffect(() => {
        // Side effects
    }, [dependencies]);

    return <div></div>;
}
```

### **🎬 GSAP 3.15**

**Dokumentasi Official**: https://gsap.com/docs/v3

GSAP adalah animation library professional untuk web:

```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Basic Tween
gsap.to(".element", {
    duration: 1,
    x: 100,
    opacity: 0.5,
    ease: "power2.inOut",
});

// Timeline
const tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
});

tl.to(".box", { duration: 1, x: 100 }).to(".box", {
    duration: 1,
    rotation: 360,
});

// ScrollTrigger
gsap.to(".element", {
    scrollTrigger: ".element",
    x: 100,
    duration: 2,
});
```

**Common Methods:**

- `gsap.to()` - Animate TO these values
- `gsap.from()` - Animate FROM these values
- `gsap.fromTo()` - Define both start & end
- `gsap.timeline()` - Sequence animations

### **🎨 Tailwind CSS 4.0**

**Dokumentasi Official**: https://tailwindcss.com

Tailwind CSS adalah utility-first framework untuk styling:

```jsx
// Styling dengan utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <h1 className="text-2xl font-bold text-gray-900">Title</h1>
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Click me
    </button>
</div>
```

**Responsive Design:**

```jsx
<div className="text-sm md:text-base lg:text-lg">Text yang responsif</div>
```

**Dark Mode:**

```jsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
    Dark mode support
</div>
```

### **⚙️ Vite 6.0**

**Dokumentasi Official**: https://vite.dev

Vite adalah build tool super cepat:

```javascript
// vite.config.js
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": "/resources/js",
        },
    },
});
```

**Key Features:**

- ⚡ Instant server start
- 🔄 Lightning-fast HMR (Hot Module Replacement)
- 📦 Optimized production builds
- 🔌 Plugin ecosystem

---

## 📁 Struktur Project

```
OshiMerch/
├── app/
│   ├── Http/
│   │   ├── Controllers/          # Controllers untuk handling requests
│   │   ├── Middleware/           # Custom middleware
│   │   └── Requests/             # Form request validations
│   ├── Models/                   # Eloquent models
│   │   ├── User.php
│   │   ├── Listing.php
│   │   ├── Transaction.php
│   │   ├── Message.php
│   │   ├── Review.php
│   │   ├── Notification.php
│   │   └── Favorite.php
│   └── Policies/                 # Authorization policies
│
├── config/                        # Configuration files
│   ├── app.php
│   ├── auth.php
│   ├── database.php
│   └── ...
│
├── database/
│   ├── migrations/               # Database migrations
│   ├── factories/                # Model factories untuk testing
│   └── seeders/                  # Database seeders
│
├── resources/
│   ├── js/
│   │   ├── app.jsx              # Entry point React
│   │   ├── Pages/               # Page components
│   │   ├── Components/          # Reusable components
│   │   └── Layouts/             # Layout components
│   ├── css/                     # CSS files
│   └── views/
│       └── app.blade.php        # Main blade template
│
├── routes/
│   ├── web.php                  # Web routes
│   ├── api.php                  # API routes (jika ada)
│   └── auth.php                 # Auth routes
│
├── storage/
│   ├── app/                     # File storage
│   ├── logs/                    # Application logs
│   └── framework/               # Framework files
│
├── tests/                        # Test files
│   ├── Feature/                 # Feature tests
│   └── Unit/                    # Unit tests
│
├── public/
│   ├── index.php                # Entry point aplikasi
│   ├── storage/                 # Linked storage directory
│   └── images/                  # Public images
│
├── vendor/                       # PHP dependencies (Composer)
├── node_modules/               # Node dependencies (npm)
├── package.json                # npm dependencies
├── composer.json               # Composer dependencies
├── vite.config.js              # Vite configuration
├── .env                        # Environment variables
├── .env.example                # Environment template
└── README.md                   # Dokumentasi ini
```

---

## 🗄️ Database

### **Entity Relationship Diagram**

```
Users
├── Listings (1 user → many listings)
├── Messages (many to many antar user)
├── Conversations (many to many antar user)
├── Reviews (written by user)
├── Transactions (many to many)
├── Favorites (many to many)
└── Notifications (many to many)

Listings
├── Transactions
├── Reviews
├── Favorites
└── Messages

Transactions
├── Users (buyer & seller)
├── Listings
└── Messages

Reviews
├── Listings
├── Users (reviewer)
└── User (owner)

Messages
├── User (sender)
├── User (recipient)
├── Conversation
└── Listing (optional)
```

### **Models & Relationships**

#### **User Model**

```php
class User extends Model {
    public function listings() { } // Has many
    public function reviews() { }   // Has many
    public function transactions() { } // Many to many
    public function sentMessages() { } // Has many (sender)
    public function receivedMessages() { } // Has many (recipient)
    public function favorites() { } // Many to many
}
```

#### **Listing Model**

```php
class Listing extends Model {
    public function user() { } // Belongs to
    public function reviews() { } // Has many
    public function transactions() { } // Many to many
    public function favoritedBy() { } // Many to many
}
```

#### **Transaction Model**

```php
class Transaction extends Model {
    public function buyer() { } // Belongs to User
    public function seller() { } // Belongs to User
    public function listing() { } // Belongs to Listing
}
```

---

## 🔗 API & Routing

### **Main Routes (Web)**

File: `routes/web.php`

```php
Route::get('/', [HomeController::class, 'index'])->name('home');

// Listings
Route::resource('listings', ListingController::class);
Route::get('listings/{listing}/reviews', [ListingController::class, 'reviews']);

// Transactions
Route::resource('transactions', TransactionController::class);
Route::post('transactions/{transaction}/confirm', [TransactionController::class, 'confirm']);

// Messages & Conversations
Route::resource('conversations', ConversationController::class);
Route::post('messages', [MessageController::class, 'store']);

// Reviews
Route::post('reviews', [ReviewController::class, 'store']);
Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);

// Favorites
Route::post('favorites/{listing}', [FavoriteController::class, 'store']);
Route::delete('favorites/{listing}', [FavoriteController::class, 'destroy']);

// Notifications
Route::get('notifications', [NotificationController::class, 'index']);
Route::delete('notifications/{notification}', [NotificationController::class, 'destroy']);
```

### **Authentication Routes**

File: `routes/auth.php`

```php
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
```

---

## 📊 Available Commands

### **Laravel Artisan**

```bash
# Development
php artisan serve                    # Start development server
php artisan tinker                   # Interactive shell

# Database
php artisan migrate                  # Run migrations
php artisan migrate:fresh            # Fresh migration
php artisan migrate:rollback         # Rollback migrations
php artisan db:seed                  # Seed database
php artisan db:seed --class=YourSeeder

# Models & Scaffolding
php artisan make:model ModelName     # Create model
php artisan make:model ModelName -m  # With migration
php artisan make:model ModelName -mc # With migration & controller

# Controllers
php artisan make:controller ControllerName

# Middleware
php artisan make:middleware MiddlewareName

# Requests
php artisan make:request StoreUserRequest

# Jobs & Events
php artisan make:job JobName
php artisan make:event EventName

# Cache & Optimization
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Testing
php artisan test                     # Run tests
php artisan test --filter=TestName
```

### **npm Commands**

```bash
npm run dev          # Development with HMR
npm run build        # Production build
npm install          # Install dependencies
npm update           # Update packages
npm list             # List installed packages
```

### **Composer Commands**

```bash
composer install     # Install dependencies
composer update      # Update packages
composer require package-name
composer dump-autoload
composer validate    # Check composer.json
```

---

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run feature tests
php artisan test --filter=Feature

# Run specific test class
php artisan test tests/Feature/ListingTest.php

# Run with verbose output
php artisan test -v

# Generate coverage report
php artisan test --coverage
```

---

## 📝 Contributing

Contributions are welcome! Ikuti steps berikut:

1. **Fork** repository ini
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push ke branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request** dengan deskripsi yang jelas

### **Code Style**

- Gunakan PSR-12 untuk PHP
- Gunakan Prettier untuk JavaScript
- Tuliskan meaningful commit messages
- Tambahkan tests untuk fitur baru

---

## 📄 License

Proyek ini dilisensikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---

## 📞 Support & Contact

Jika mengalami masalah atau memiliki pertanyaan:

- 💬 Buka issue di GitHub
- 📧 Hubungi tim development
- 📖 Baca dokumentasi di `/docs`

---

## 🙏 Terima Kasih

Terima kasih kepada semua contributors dan framework yang digunakan:

- ❤️ **Laravel** - Web framework terbaik untuk PHP
- ⚛️ **React** - Library UI yang powerful
- ⚡ **Vite** - Build tool yang super cepat
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🎬 **GSAP** - Animation library professional
- ↗️ **Inertia.js** - Modern approach untuk SPA

---

**Selamat coding! 🚀**

_Last Updated: May 10, 2026_
_Version: 1.0.0_
