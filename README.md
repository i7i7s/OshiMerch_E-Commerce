<div align="center">
  <img src="public/images/heroassets/oshi-merch-logo.png" alt="OshiMerch Logo" width="200" style="border-radius:20%" />
  
  # OshiMerch E-Commerce
  
  **A secure, intuitive, and modern e-commerce platform specially designed for the JKT48 fandom.**
  
  [![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

<br/>

## 📖 Overview

Merchandise trading in the JKT48 fandom (photocards, lightsticks, apparel, etc.) is currently scattered across various social media platforms and general marketplaces. This fragmentation leads to risks like fraud, non-transparent pricing, difficulty in finding specific items, and the lack of an ecosystem that deeply understands the fandom culture.

**OshiMerch** solves this by providing a hyper-focused platform for JKT48 fans. We adopt a **"Healthy MVP"** approach—prioritizing core product value such as a strong fandom identity (API-based Oshi profiles), seamless product listing, and dynamic discoverability. Complex features like automated payment gateways, cloud storage migration, and real-time WebSockets are planned for our Future Roadmap phase to ensure rock-solid stability in the MVP stage.

---

## 🚀 Key Features and Benefits

### 🔸 Phase 1: Foundation & Identity

- **Google Authentication:** Secure and seamless one-click login powered by Laravel Socialite.
- **API-Driven Oshi Onboarding:** Real-time fetching of JKT48 members via external APIs to build a deep fanatic identity from Day 1.

### 🔸 Phase 2: Supply & Discoverability

- **Dynamic Discoverability:** Browse listings with multi-criteria filters (member, team: PASSION/LOVE/DREAM/TRAINEE, item condition, price range) synchronized directly from API architectures.
- **Debounced Smart Search:** A hyper-optimized search mechanism across `navbar`, `/members`, and `/products` implementing localized `useDebounce` (>300ms) to ensure smooth operations and reduce server load limits.
- **Listing Management:** Robust CRUD ops, local file uploads, description tags natively tied to the JKT48 API.

### 🔸 Phase 3: Transaction & Communication

- **Standardized Chats:** Built-in HTTP polling conversational UI featuring modern chat bubbles to facilitate seamless price negotiation and logistics coordination.
- **Manual Order Tracking Pipeline:** Trust-based manual checkout mechanics tracking items from _Pending_ ➔ _Paid (Receipt Verification)_ ➔ _Shipped_ ➔ _Completed_.

### 🔮 Future Roadmap

- **Automated Payments:** Webhook integrations via Midtrans/Xendit.
- **Logistics Sync:** API mapping using RajaOngkir/Biteship.
- **Performance Scaling:** Storage and database migration targeting Supabase (PostgreSQL + S3 Storage).
- **Real-time Operations:** Upgrading polling chat protocols to Laravel Reverb for highly-concurrent WebSocket capabilities.

---

## 🛠️ Technology Stack

OshiMerch leverages a highly modern **VILT/VIRT Stack** modified for React, aiming for a Gen Z-friendly user experience.

- **Backend:** [Laravel 13.x](https://laravel.com/) (PHP ^8.3)
- **Frontend:** [React 19.x](https://react.dev/) + [Inertia.js v2.x](https://inertiajs.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), Framer Motion, GSAP, Lenis (Smooth Scrolling)
- **Database:** MySQL (Local setup for MVP)
- **Authentication:** Laravel Breeze, Laravel Socialite
- **Tooling:** Vite v6

**External Data Integration:** [JKT48 Member API](https://jkt-48-member-api-i7i7.vercel.app/)

---

## 🚦 Getting Started

Follow these steps to set up OshiMerch in your local development environment.

### Prerequisites

- PHP ^8.3
- Composer
- Node.js (v18+) & npm
- MySQL/MariaDB

### Installation Instructions

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/i7i7s/OshiMerch_E-Commerce.git
    cd OshiMerch_E-Commerce
    ```

2.  **Install PHP & Node Dependencies:**

    ```bash
    composer install
    npm install
    ```

3.  **Environment Setup:**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    _Make sure to configure your database settings, and add your Google OAuth credentials for Laravel Socialite inside the `.env` file._

4.  **Database Migration & Seeding:**

    ```bash
    php artisan migrate --seed
    ```

    _Note: We use gracefully tracked migrations ensuring smooth CI/CD operations._

5.  **Storage Link:**
    Create a symbolic link for local file uploads to be publicly accessible.

    ```bash
    php artisan storage:link
    ```

6.  **Run Development Servers:**
    Run both Vite and Laravel Serve concurrently.

    ```bash
    npm run dev
    ```

    This triggers a cross-platform concurrent spin up of `php artisan serve`, `queue:listen`, and `vite`.

    Visit `http://localhost:8000` to start exploring OshiMerch!

---

## 🎨 UI/UX and Development Guidelines

To maintain our targeted "Gen-Z Vibe" standard and project scope, developers must adhere to the following when contributing:

1.  **UI/UX Quality over Quantity:** Never use default/bare HTML styles. Heavily utilize Tailwind CSS, Framer Motion, and GSAP micro-interactions to create a rich client sensation.
2.  **API Fallbacks:** Treat the JKT48 External API safely. Employ local/app caching for member names, unique codes, and teams to preserve performance metrics.
3.  **Debounce Search Hooks:** Any new text inputs hitting endpoints **must** employ a `setTimeout/clearTimeout` logic custom-hook with a 300ms minimum threshold.
4.  **Security Standards:** Ensure CSRF protection via Inertia, output sanitization against XSS, and proper auth middleware (`auth`, `verified`) protecting the user transaction pipelines.

---

## 🤝 How to Get Help & Contribute

We welcome open-source contributions focusing exclusively on fulfilling our MVP specifications.

- **Found a bug?** Please use the [Issue Tracker](../../issues) to report bugs, glitches, or UX problems.
- **Want to contribute?** See our current objectives mapped out in `PRD_OSHI MERCH FIX.md`.
    1. Fork the repo and create your feature branch (`git checkout -b feature/amazing-feature`)
    2. Commit your changes strictly following conventional commits (`git commit -m 'feat: Add amazing feature'`)
    3. Push to the branch (`git push origin feature/amazing-feature`)
    4. Open a Pull Request on GitHub.

### Maintaining Team

Managed and curated by **[@i7i7s](https://github.com/i7i7s)** & the OshiMerch E-Commerce core maintenance team.

---

<p align="center">
  Released under the <a href="https://opensource.org/licenses/MIT">MIT License</a>. <br/>
  Powered by Community & Fandom Love.
</p>
