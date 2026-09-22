# Arsitektur Teknis Publik: lardeck & lara-student

Dokumen ini menguraikan arsitektur teknis sistem workshop `learn-laravel`, mencakup integrasi antara engine slide presentasi interaktif dan aplikasi web acuan.

---

## 1. Arsitektur Dual-Server

Untuk menunjang pengalaman belajar yang interaktif dan mulus, sistem dijalankan pada dua server lokal terpisah dengan pemisahan port yang tegas:

```
+-------------------------------------------------------------+
|                     Browser Pengguna                        |
+------------------------------+------------------------------+
                               |
            +------------------+------------------+
            |                                     |
            v                                     v
+-----------------------+             +-----------------------+
|  lardeck Slide Deck   |             | lara-student Web App  |
|  (Port 8000)          |             | (Port 8001)           |
|  - Engine: Reveal.js  |             | - Backend: Laravel 12 |
|  - Host: Vite Server  |             | - Bridge: Inertia.js  |
|  - Content: 40 Slides |             | - View: React 18 SPA  |
+-----------------------+             +-----------------------+
```

1. **Port 8000 (`http://localhost:8000/lardeck`)**:
   - Menjalankan slide presentasi Reveal.js.
   - Menyajikan konten markdown modular, blok perbandingan visual, mock terminal, dan speaker notes instruktur.
2. **Port 8001 (`http://localhost:8001/students`)**:
   - Menjalankan aplikasi referensi Laravel 12.
   - Tempat instruktur mendemonstrasikan sesi live coding dan tempat peserta mempraktikkan materi.

---

## 2. Alur Data End-to-End (Request–Response Lifecycle)

Aplikasi `lara-student` menggunakan Inertia.js sebagai jembatan yang menyatukan alur MVC Laravel dengan antarmuka React:

```
+-----------+        HTTP GET /students        +------------------+
|           | -------------------------------> |  routes/web.php  |
|           |                                  +------------------+
|           |                                           |
|           |                                           v
|           |                                  +-------------------+
|  Browser  |                                  | StudentController |
|  (React)  |                                  |     @index()      |
|           |                                  +-------------------+
|           |                                           |
|           |                                           v
|           |       Inertia Response (Props)   +-------------------+
|           | <------------------------------- | Model: Student::  |
+-----------+     HTML + JSON component state  +-------------------+
                                                        |
                                                        v
                                               +-------------------+
                                               |     Database      |
                                               +-------------------+
```

### Langkah-Langkah Alur Data:
1. **Navigasi Client-Side**: Pengguna mengklik `<Link href="/students">` di React. Inertia menangkap event dan mengirimkan AJAX request ke backend dengan header khusus `X-Inertia: true`.
2. **Routing & Controller**: Router `routes/web.php` mengarahkan permintaan ke `StudentController@index`.
3. **Query Eloquent**: Controller memanggil model `Student::query()` dengan conditional filter pencarian dan paginasi 5 item per halaman.
4. **Inertia Response**: Controller mengeksekusi `Inertia::render('Students/Index', ['students' => $students])`.
5. **Rendering Halaman**: Inertia di browser menerima payload props dan memperbarui komponen React `Students/Index.jsx` di dalam kerangka `AppLayout.jsx` tanpa memicu reload halaman utuh.

---

## 3. Fitur Debugging: Inertia Error Modal

Saat proses pengembangan atau sesi live coding, jika developer memanggil `dd()` (dump and die) atau terjadi error fatal HTTP 500:
- Inertia **tidak** mengalihkan browser ke halaman error putih atau halaman eksternal.
- Inertia menangkap output HTML debugger Laravel dan menampilkannya di dalam **modal dialog interaktif** yang melayang di atas aplikasi aktif.
- Developer dapat memeriksa call stack atau variabel yang di-dump, menutup modal, dan langsung melanjutkan koding tanpa kehilangan state halaman saat itu.

---

## 4. Guardrail Dimensi Slide & Anti-Overflow

Slide presentasi dirancang agar dapat ditampilkan dengan sempurna di layar laptop (termasuk rasio $16:10$ atau $16:9$ beresolusi rendah):
- **Dimensi Kanvas Dasar**: $1280 \times 800\text{ px}$.
- **Margin Luar**: $0.06$ (6%), menghasilkan budget tinggi aktif maksimal **$704\text{ px}$**.
- **Prinsip "Satu Ide per Slide"**: Materi dibagi ke dalam 40 slide atomik. Slide yang sebelumnya menumpuk 2 hingga 3 konsep dipecah menjadi beberapa slide terpisah untuk mencegah teks terpotong (*zero overflow*).
- **Pengujian Otomatis CDP**: Skrip `lardeck/scripts/verify-slide-dimensions.js` mengemulasikan viewport laptop $1024 \times 532$ via Chrome DevTools Protocol dan memverifikasi bahwa tinggi konten aktif seluruh 40 slide berada di bawah $704\text{ px}$.
