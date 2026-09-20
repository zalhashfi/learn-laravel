<!-- .slide: id="part-6" -->
<p class="part-label">Part 6 · Relasi &amp; Peta Jalan <span class="badge badge-core">Core</span></p>

# Relasi &amp; Peta Jalan

## Ke mana setelah ini

Note: **🗣️ Ngomong ke Peserta:**
"Kita sudah menyelesaikan CRUD lengkap. Sebelum menutup, dua hal: sedikit bocoran tentang relasi antar-tabel — yang di capstone kemarin sengaja saya biarkan menggantung. Dan yang lebih penting: peta jalan kalian setelah sesi ini."

**🎯 Poin Kunci di Layar:**
- Santai — bagian ringan, bukan materi padat.
- Tujuan: peserta tahu di mana melanjutkan.



<p class="part-label">Part 6 · Relasi &amp; Peta Jalan</p>

## Peta jalan roadmap.sh &amp; Relationships

<table class="plain">
<tr><th>Sudah kita sentuh hari ini</th><th>Arah lanjutan (belum)</th></tr>
<tr><td>Installing &amp; Project Structure</td><td>Authentication (Breeze/Sanctum)</td></tr>
<tr><td>Routing &amp; Controllers</td><td>Testing (Pest / PHPUnit)</td></tr>
<tr><td>Migrations &amp; Eloquent</td><td>Queues, Events, Notifications</td></tr>
<tr><td>Blade &amp; Layouts</td><td>Caching, File Storage, Deployment</td></tr>
<tr><td>Forms, Validation &amp; CRUD</td><td>Telescope, Octane, Performance</td></tr>
</table>

<div class="cmp">
<div class="cmp-php">
<h4>Pertanyaan capstone (deck lama)</h4>

&ldquo;Buat tabel penghubung <code>enrollments(student_id, course_id)</code>... ini memunculkan pertanyaan <code>ON DELETE CASCADE</code> vs <code>RESTRICT</code>, sengaja belum dijawab.&rdquo;

Menulis JOIN manual untuk menggabungkan dua tabel.

</div>
<div class="cmp-laravel">
<h4>Jawaban Laravel: relasi Eloquent</h4>

```php
class Student extends Model {
    public function enrollments() {
        return $this->hasMany(Enrollment::class);
    }
}

// CASCADE vs RESTRICT: satu method:
$table->foreignId('student_id')
      ->constrained()->cascadeOnDelete();
```

</div>
</div>

<p class="fineprint">Materi kita mengikuti <a href="https://roadmap.sh/laravel">roadmap.sh/laravel</a> dari atas ke bawah. Relasi tidak didemokan penuh; cukup memancing rasa ingin tahu; detailnya di dokumentasi resmi.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Saya mau tunjukkan sesuatu. Ada situs bernama roadmap.sh — peta belajar dari komunitas, dengan jalur khusus Laravel. Materi kita hari ini mengikuti peta itu dari atas ke bawah. Kolom kiri: yang sudah kita sentuh. Kolom kanan: yang belum — bukan berarti tidak penting, hanya butuh sesi tersendiri. Buka roadmap.sh/laravel nanti, tandai sendiri mana yang sudah kalian pahami."

"Lalu, ingat pertanyaan yang sengaja saya tinggalkan di capstone kemarin? Soal relasi `students` dan `courses`, dan `ON DELETE CASCADE` versus `RESTRICT`. Sekilas jawabannya ada di kanan. Di Eloquent, relasi jadi method: `hasMany`, `belongsTo`, `belongsToMany`. Kalian tidak menulis JOIN manual. Dan pertanyaan CASCADE vs RESTRICT tadi? Jadi satu method: `cascadeOnDelete()`."

"Saya tidak akan demokan penuh hari ini — satu sesi tidak cukup. Tapi saya ingin kalian tahu: pertanyaan yang kemarin menggantung itu jawabannya ada dan elegan."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Buka roadmap.sh/laravel di tab browser, tunjukkan nodenya.
- Sambungkan eksplisit ke pertanyaan capstone deck lama.
- Jujur: "tidak didemokan penuh" — itu tidak apa-apa.



<p class="part-label">Part 6 · Relasi &amp; Peta Jalan</p>

## Recap: 6 file plain PHP → 1 resource Laravel

<table class="plain">
<tr><th>Plain PHP (pertemuan lalu)</th><th>Laravel (hari ini)</th></tr>
<tr><td><code>config/database.php</code> (kredensial keras)</td><td><code>.env</code> + <code>database/migrations/</code></td></tr>
<tr><td><code>$pdo->query(...)->fetchAll()</code></td><td><code>Student::all()</code></td></tr>
<tr><td><code>prepare()</code> + <code>execute()</code></td><td><code>validate()</code> + <code>Student::create()</code></td></tr>
<tr><td><code>helpers.php</code> (setFlash/getFlash)</td><td><code>->with('success', ...)</code></td></tr>
<tr><td><code>header('Location:...')</code> + <code>exit</code></td><td><code>redirect()->route(...)</code></td></tr>
<tr><td><code>htmlspecialchars()</code> tiap output</td><td><code>{{ }}</code> auto-escape</td></tr>
<tr><td><code>if (empty($students))</code></td><td><code>@forelse / @empty</code></td></tr>
<tr><td>6 file + config + helpers</td><td>1 <code>Route::resource()</code></td></tr>
</table>

<p class="fineprint">Logikanya <b>sama</b>. Yang berubah: siapa yang mengurus detail berulang: kalian, atau framework.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Ini ringkasan perjalanan kita. Baca tabelnya dari atas ke bawah: setiap baris kiri adalah sesuatu yang HARUS kalian tulis sendiri kemarin; setiap baris kanan versi Laravel-nya."

"Perhatikan satu hal penting: logikanya sama sekali tidak berubah. `Student::create()` tetap menjalankan INSERT di belakang layar. `{{ }}` tetap memanggil sesuatu seperti `htmlspecialchars`. Yang berubah cuma satu: framework mengurus detail berulang, supaya kalian fokus ke logika aplikasi."

"Coba renungkan: kemarin 10 bagian, hari ini kita lipat habis. Bukan karena sihir — tapi karena kalian sudah membangun fondasi yang tepat."

**🎯 Poin Kunci di Layar:**
- Telusuri tabel; tiap baris = satu "aha" yang tadi dibahas.
- Momen "lihat betapa jauhnya" — beri jeda.



<p class="part-label">Part 6 · Relasi &amp; Peta Jalan</p>

## Latihan mandiri &amp; penutup

<div class="checkpoint">
<b>Tugas: porting ke Laravel</b><br>
Ulangi seluruh alur hari ini untuk entity yang <b>sama</b> (<code>students</code>) dari nol di proyek Laravel kalian sendiri: model &rarr; migration &rarr; seeder &rarr; route resource &rarr; controller &rarr; Blade views &rarr; validasi. Target: bisa menjelaskan SETIAP baris tanpa membuka referensi.
</div>

<table class="plain">
<tr><th>Gejala</th><th>Penyebab umum</th></tr>
<tr><td><i>Connection refused</i> saat migrate</td><td>MySQL belum jalan / <code>.env</code> salah</td></tr>
<tr><td>Halaman putih / 500</td><td><code>APP_DEBUG=false</code> di lokal, atau isi <code>.env</code> belum lengkap</td></tr>
<tr><td>Blank page (bukan error)</td><td>Buka lewat <code>file://</code>; harus lewat <code>php artisan serve</code></td></tr>
<tr><td><i>Class not found</i></td><td>Lupa <code>composer install</code> atau <code>composer dump-autoload</code></td></tr>
</table>

<p class="fineprint"><b>Peta lanjutan:</b> <a href="https://roadmap.sh/laravel">roadmap.sh/laravel</a> &middot; dokumentasi resmi <a href="https://laravel.com/docs">laravel.com/docs</a></p>

Note: **🗣️ Ngomong ke Peserta:**
"Tugas kalian: ulangi seluruh alur hari ini untuk entity yang SAMA — `students` — dari nol, di proyek Laravel kalian sendiri. Sengaja entity-nya sama, supaya kalian fokus ke CARA menulisnya di Laravel, bukan ke hal baru. Targetnya seperti capstone kemarin: bisa menjelaskan setiap baris tanpa membuka referensi. Kalau itu tercapai, sesi ini sukses."

"Tabel kedua itu troubleshooting yang paling sering muncul. Kalau nanti stuck, cek tabel ini dulu: koneksi database, `.env`, cara membuka aplikasi, dan autoload. Empat hal ini menyelesaikan sebagian besar masalah setup."

"Terakhir — peta belajar kalian ada di roadmap.sh/laravel. Semua yang belum kita bahas ada di sana, jadi kalian tidak akan tersesat. Terima kasih sudah mengikuti sesi ini, dan jangan ragu bertanya. Q&A kita buka sekarang."

**🎯 Poin Kunci di Layar:**
- Tegaskan tugas: entity SAMA (`students`), dari nol.
- Tunjuk tabel troubleshooting — sarankan difoto.
- Buka Q&A, termasuk pertanyaan yang di-parking dari awal sesi.
