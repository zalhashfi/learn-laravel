# Dari PHP ke Laravel: Refactor Backend CRUD

Repositori materi workshop dan aplikasi referensi untuk memandu transisi dari PHP murni (prosedural/PDO) menuju arsitektur web modern menggunakan **Laravel 12**, **Inertia.js**, dan **React 18 SPA**.

Proyek ini disusun dengan pendekatan pedagogis *"satu rumah yang sama"*, di mana setiap fitur baru Laravel diperkenalkan dengan membandingkan kode PHP native yang telah dikuasai peserta sebelumnya.

---

## 🚀 Komponen Repositori

Repositori ini terdiri dari dua komponen utama:

```
learn-laravel/
├── lardeck/                      # Engine slide interaktif Reveal.js (Port 8000)
│   ├── css/lardeck.css           # Tema Midnight Laravel & guardrail anti-overflow
│   ├── docs/                     # Dokumentasi arsitektur publik & outline slide
│   ├── scripts/                  # Skrip pengujian dimensi slide & verifikasi
│   └── slides/                   # 40 slide materi markdown (Part 0 s.d. Part 6)
└── lardeck/project/lara-student/ # Aplikasi referensi Laravel 12 + Inertia React (Port 8001)
    ├── app/                      # Controller, Model, & Request
    ├── database/                 # Migration & Seeder data siswa
    └── resources/js/             # Komponen SPA React (Pages, Layouts, UI atoms)
```

1. **`lardeck/` (Interactive Slide Deck)**:
   - 40 slide materi atomik berbasis Reveal.js dengan tema *Midnight Laravel*.
   - Mengikuti kurikulum resmi [roadmap.sh/laravel](https://roadmap.sh/laravel).
   - Memuat **9 sesi Live Coding** terpandu (`Live #1` hingga `Live #8`).
   - Dilengkapi guardrail anti-overflow: seluruh slide teroptimasi untuk kanvas $1280 \times 800$ dan diuji bebas terpotong pada layar laptop ($1024 \times 532$).

2. **`lardeck/project/lara-student/` (Reference Application)**:
   - Aplikasi Student Management System lengkap dengan 6 aksi CRUD, validasi input, pencarian real-time, paginasi, dan notifikasi flash message.
   - Menggunakan **Inertia.js** sebagai jembatan backend-frontend tanpa memerlukan REST API terpisah maupun konfigurasi CORS.
   - Dilengkapi automated test suite berbasis PHPUnit / Pest.

---

## 🛠️ Prasyarat Lingkungan

Sebelum menjalankan proyek, pastikan perangkat Anda telah terpasang:
- **PHP** $\ge 8.2$ (dengan ekstensi `pdo`, `pdo_sqlite` atau `pdo_mysql`, `mbstring`)
- **Composer** $\ge 2.2$
- **Node.js** $\ge 18.0$ dan **npm**

---

## ⚡ Panduan Menjalankan Sistem (Dual-Server)

Workshop ini dirancang untuk dijalankan dalam konfigurasi **dua server bersamaan** agar instruktur dan peserta dapat berpindah mulus antara materi dan demo langsung:

### 1. Menjalankan Slide Deck (Port 8000)

Buka terminal pertama di root repositori:

```bash
# Pasang dependensi slide Reveal.js & Vite
npm install

# Jalankan server slide
npm start
```
Slide presentasi interaktif dapat diakses melalui browser di: **`http://localhost:8000/lardeck`**

### 2. Menjalankan Aplikasi Referensi lara-student (Port 8001)

Buka terminal kedua dan masuk ke folder proyek aplikasi:

```bash
cd lardeck/project/lara-student

# Pasang dependensi PHP dan JavaScript
composer install
npm install

# Siapkan file environment & generate app key
cp .env.example .env
php artisan key:generate

# Jalankan migrasi database dan pengisian data awal
php artisan migrate:fresh --seed

# Jalankan server backend Laravel (Port 8001)
php artisan serve --port=8001
```

Buka terminal ketiga di folder yang sama untuk menjalankan kompilator frontend Vite:

```bash
cd lardeck/project/lara-student
npm run dev
```

Aplikasi web dapat diakses melalui browser di: **`http://localhost:8001/students`**

---

## 🧪 Pengujian Otomatis & Verifikasi Kualitas

Proyek ini menerapkan pengujian otomatis menyeluruh untuk menjamin stabilitas kode aplikasi dan materi pelatihan:

### Pengujian Backend (PHPUnit)
Memverifikasi 12 endpoint dan fungsionalitas CRUD:
```bash
cd lardeck/project/lara-student
php artisan test
```

### Pengujian Dimensi Slide (Chrome DevTools Protocol)
Memastikan seluruh 40 slide muat dalam kanvas $1280 \times 800$ dan tidak terpotong di layar laptop:
```bash
node lardeck/scripts/verify-slide-dimensions.js
```

### Pengujian Integritas Materi Per Part
```bash
node lardeck/scripts/verify-part1-composer-first.js
node lardeck/scripts/verify-t1-slides.js
node lardeck/scripts/verify-t2-slides.js
node lardeck/scripts/verify-t3-slides.js
node lardeck/scripts/verify-t4-slides.js
```

---

## 📚 Dokumentasi Lanjutan

- [Arsitektur Teknis Publik](lardeck/docs/architecture.md)
- [Dokumentasi API & Kontrak Routing lara-student](lardeck/project/lara-student/README.md)
- [Struktur & Outline Slide-by-Slide](lardeck/docs/outline.md)
