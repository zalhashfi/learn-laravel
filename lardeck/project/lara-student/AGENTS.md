# Panduan Agent — `lara-student`

Proyek referensi untuk deck **"Dari PHP ke Laravel"** (`lardeck/`). Aplikasi CRUD
siswa sederhana, dipakai sebagai demo live coding.

## Stack

| Lapis | Teknologi |
|---|---|
| Framework | **Laravel 12** (`^12.0`, minimum PHP 8.2) |
| Frontend | **React 19 + Inertia.js 2**, ditulis **JavaScript/JSX** (bukan TypeScript) |
| Build | Vite 7 + `@vitejs/plugin-react` ^5 |
| Styling | Tailwind CSS 4 |
| Database | MySQL (Laragon): `student_db` |

## Perintah Penting

```sh
php artisan serve --port=8001   # backend (port 8001; deck jalan di 8000)
npm run dev                     # Vite dev server (React)
npm run build                   # build produksi

php artisan migrate:fresh --seed # reset + isi data (6 siswa seed)
php artisan route:list           # 7 route resource
```

## Struktur yang Relevan

```
app/Http/Controllers/StudentController.php   → Inertia::render()
app/Http/Middleware/HandleInertiaRequests.php → share flash.success
app/Models/Student.php                        → $fillable
resources/views/app.blade.php                 → SATU-SATUNYA Blade (root @inertia)
resources/js/
├── app.jsx                        → createInertiaApp
├── Layouts/AppLayout.jsx          → layout + flash
├── Components/ui.jsx              → Button, Input
├── Components/StudentForm.jsx     → useForm (create + edit)
└── Pages/Students/{Index,Create,Edit,Show}.jsx
```

## Aturan yang Harus Dipatuhi

1. **Frontend selalu JSX (`.jsx`).** Jangan pakai TypeScript — audiens memakai
   JavaScript. Jangan menambahkan `tsconfig.json` atau `@types/*`.
2. **Jangan pakai Blade untuk halaman.** `app.blade.php` hanya root template.
   Tampilan ditulis sebagai komponen React di `resources/js/`.
3. **Data mengalir satu arah.** Controller mengirim props lewat
   `Inertia::render()`, React hanya menerima. Tidak ada query database di JSX.
4. **Nama key props harus sama** antara `Inertia::render()` dan komponen React —
   ini sumber bug paling umum.
5. **Pesan validasi berbahasa Indonesia**, ditulis di controller sebagai argumen
   kedua `validate()`.
6. **Ziggy tidak dipasang.** Jangan memakai `route()` di JSX. Pakai path relatif
   (mis. `/students/${student.id}/edit`) dengan `<Link>` dari Inertia.
7. **Versi dikunci ke Laravel 12** agar selaras dengan proyek Backend yang sudah
   berjalan. Jangan menaikkan ke 13.

## Sebelum Menyatakan Selesai

- `npx tsc` tidak berlaku (proyek JSX). Cukup `npm run build` harus hijau.
- `php artisan route:list` harus menampilkan 7 route `students`.
- Uji CRUD **di browser sungguhan** — validasi tampil, old input terjaga, flash
  muncul. Jangan hanya mengandalkan HTTP status code.
