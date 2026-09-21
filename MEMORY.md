# Memory — Proyek "Dari PHP ke Laravel"

Catatan status & keputusan untuk melanjutkan pekerjaan di sesi berikutnya.
Terakhir diperbarui: 2026-09-21.

---

## Apa ini

Deck presentasi **"Dari PHP ke Laravel: Refactor Backend CRUD"** — lanjutan dari
deck sebelumnya `learn-php/phpdeck` ("Dari C ke PHP"). Kurikulum mengikuti
**<https://roadmap.sh/laravel>**.

Prinsip desain: **selalu mulai dari kode plain PHP lama**, lalu tunjukkan versi
Laravel-nya. Ini *refactor*, bukan tutorial framework dari nol.

## Lokasi & cara jalan

```
C:\BACKUP D PARTISION\file daskom\Academy-2026\BackEnd\learn-laravel\
├── lardeck.html              entry deck (port 8000)
├── lardeck/slides/*.md       7 file slide (30 slide total)
├── lardeck/css/lardeck.css   style deck
├── lardeck/docs/outline.md   outline lengkap + status
├── lardeck/project/lara-student/  proyek Laravel referensi (Laravel 13)
├── anti-slop/audit-001-2026-09-20.md  hasil audit antislop
└── vercel.json               konfigurasi deploy
```

**Jalankan deck lokal:**
```
cd learn-laravel && npm start      # → http://localhost:8000/lardeck.html
```
Server harus HTTP, JANGAN buka lewat `file://` (plugin markdown gagal).

**Jalankan aplikasi Laravel:**
```
cd lardeck/project/lara-student
php artisan serve --port=8001      # → http://localhost:8001/students
```
Butuh MySQL Laragon jalan. Kredensial ada di `.env` (gitignored).

## URL produksi

- **Deck live:** <https://learn-laravel-gold.vercel.app/>
- **GitHub:** <https://github.com/zalhashfi/learn-laravel>
- Setiap `git push` ke `main` → Vercel auto-redeploy.

---

## Status saat ini

| Bagian | Status |
|---|---|
| Deck | ✅ 30 slide, 9 LIVE badge, 30 speaker notes |
| Aplikasi | ✅ CRUD terverifikasi end-to-end dengan MySQL |
| Audit antislop | ✅ F-01, F-02, F-08, R-35 tuntas |
| GitHub | ✅ 11 commit ter-push |
| Vercel | ✅ Live, `/` → deck |

### Isi deck per Part

| Part | Slide | Isi |
|---|---|---|
| 0 Opening | 3 | Judul, peta proyek lama, What is Laravel |
| 1 Getting Started | 6 | Composer, create-project, jalankan, struktur, flow, `.env` |
| 2 Routing | 4 | URL lama vs baru, route dasar, resource controller, controller+named routes |
| 3 Database | 4 | Migration+seeder, Eloquent+`$fillable`, Responses |
| 4 Views & Blade | 3 | Blade+escape, layout+forelse+flash |
| 5 Forms & CRUD | 6 | Validasi, create/store, edit/update/destroy, search+pagination, debugging |
| 6 Relasi & Peta | 4 | Roadmap+relationships, recap, latihan+penutup |

---

## Keputusan penting (jangan diubah tanpa alasan)

1. **Tanpa build step frontend.** CSS polos (`public/css/style.css`), bukan
   Tailwind/Vite. Karena itu pakai `php artisan serve`, BUKAN `composer run dev`
   (yang menyalakan Vite + queue yang tidak dipakai).
2. **Instalasi pakai `composer create-project`** sebagai cara utama, dengan
   `laravel new` ditampilkan sebagai alternatif (`.cmp` di slide 5).
3. **Tidak pakai React.** Stack-nya Blade klasik — sesuai kurikulum. React/
   Livewire/Inertia adalah node `[LANJUT]` di roadmap, bukan materi sesi ini.
4. **Slide maksimal 30.** Deck sempat membengkak ke 42, dipangkas ke 29, kini 30
   (Request-Response & `.env` dipisah karena diagram butuh ruang penuh).
5. **Mode antislop = AFTER.** Artinya: audit dulu, user sebut nomor temuan yang
   mau diperbaiki, BARU edit. **Jangan edit sebelum approval** (pernah dilanggar
   2× untuk F-02 & F-01 — jangan diulang).
6. **CRLF wajib untuk file slide.** Reveal.js separator `^\r?\n\r?\n\r?\n\r?\n`.
   Menulis file dengan Python text-mode bisa mengubah ke LF dan MERUSAK render
   (deck jadi flat, tidak nested). Selalu tulis dengan `newline=''` + konversi
   CRLF, atau `"wb"` binary.

---

## Yang tersisa (TODO berikutnya)

### Prioritas rendah — audit MEDIUM/LOW (menunggu keputusan user)
- **F-03** · R-31/R-37 — tidak ada `DESIGN.md`. Arah desain (dials ENERGY/
  RHYTHM/MOTION + alasan warna) belum tertulis. Rekomendasi: tulis dokumen
  singkat.
- **F-04** · R-29 — palet app: merah + merah-gelap + hijau (3 warna inti).
  Perlu satu baris alasan, atau gabung `--danger` ke `--primary`.
- **F-06** · R-11 — radius campur (6px tombol, 8px card, 999px badge) tanpa
  sistem tertulis. Ini sebenarnya benar (R-11 melarang serba-pill), cuma belum
  ada dokumentasinya.

### Opsional / ide
- **Rotasi password root MySQL** setelah sesi selesai (password ada di `.env`,
  tidak bocor ke repo, tapi praktik baik untuk dirotasi).
- **Docker untuk app PHP** — kalau ingin aplikasi Laravel juga online. Vercel
  tidak bisa menjalankan PHP; butuh Railway/Render/VPS.

---

## Catatan teknis (jebakan yang sudah ditemukan)

1. **Blade comment vs HTML comment** — `@error` di dalam `<!-- -->` IKUT
   dikompilasi Blade dan menyebabkan ParseError. Gunakan `{{-- --}}`.
2. **Vercel `cleanUrls: true`** membuat `/lardeck.html` → redirect `/lardeck`.
   Rewrite root harus ke `/lardeck`, BUKAN `/lardeck.html` (kalau salah → `/`
   404).
3. **`dist/` di-gitignore** tapi dibutuhkan deck. Vercel membuatnya saat build
   via `node scripts/sync-reveal.js` (Vercel auto `npm install` dulu).
4. **`php artisan serve` perlu restart** setelah mengubah `.env`/config,
   kalau tidak route bisa 404.
5. **Validasi**: pesan Indonesia ada di `store()` DAN `update()` (harus
   konsisten — pernah tidak sinkron).
6. **Contrast AA**: `--primary` sudah digelapkan ke `#d1210f` (dari `#ff2d20`)
   agar teks putih di atasnya lolos 4.5:1. Jangan dikembalikan.

## Riwayat commit penting

- `2daeaa3` Deck awal 29 slide
- `3b97d73` F-01 kontras AA
- `42b5901` validasi update() + rewrite Vercel
- `673470a` arah panah RESPONSE (turun)
- `81b4efa` hapus CSS mati `.mvc-up`

**Author commit:** `zalhashfi <211019493+zalhashfi@users.noreply.github.com>`
(config repo-local; 2 commit awal masih pakai email gmail lama — dibiarkan atas
permintaan user).
