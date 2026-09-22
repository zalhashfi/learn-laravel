<!-- .slide: id="part-4" -->
<p class="part-label">Part 4 · Views dengan React <span class="badge badge-core">Core</span></p>

# Views dengan React

## Props: data dari Laravel masuk ke React

<div class="code-duo">
<div>
<p class="filename">StudentController.php</p>

```php
// Kirim data sebagai props
return Inertia::render('Students/Index', [
    'students' => $students,
    'q' => $q,
]);
```
</div>
<div>
<p class="filename">Pages/Students/Index.jsx</p>

```jsx
// Terima lewat props
export default function Index({ students, q }) {
    return (
        <h1>Daftar Siswa</h1>
        <p>Total: {students.total}</p>
    );
}
```
</div>
</div>

<p class="fineprint">Perhatikan pemetaannya: key di <code>Inertia::render()</code> (<code>'students'</code>) = nama parameter di React. Satu arah, eksplisit. React tidak tahu-menahu soal database: dia cuma menerima.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Ini konsep paling penting di Part 4, dan sebenarnya cuma satu kalimat: data mengalir SATU ARAH dari Laravel ke React."

"Lihat kiri. Controller mengembalikan `Inertia::render()` dengan argumen kedua: array berisi `'students'` dan `'q'`. Itu yang disebut props. Sekarang lihat kanan: komponen React menerimanya sebagai parameter fungsi — `Index({ students, q })`. Nama key di kiri HARUS sama dengan nama parameter di kanan. `'students'` jadi `students`."

"Kenapa ini penting? Karena banyak yang bingung di awal: 'kok variabel saya undefined?'. Jawabannya hampir selalu salah ketik nama key. Periksa nama di controller, periksa nama di React — harus persis sama."

"Dan satu hal yang saya ingin kalian pegang erat: React tidak tahu-menahu soal database. Tidak ada query di sini. React cuma menerima data yang sudah disiapkan Laravel. Pembagian tugasnya bersih: Laravel menyiapkan, React menggambar."

**🎯 Poin Kunci di Layar:**
- Tunjuk `Inertia::render('Students/Index', [...])` dan `Index({ students, q })`.
- Tekankan: nama key HARUS sama (sumber bug paling umum).
- Tekankan: React tidak menyentuh database; dia hanya menerima props.



<p class="part-label">Part 4 · Views dengan React</p>

## JSX: `{}` menggantikan `<?= ?>` dan aman default

<div class="cmp">
<div class="cmp-php">
<h4>Plain PHP: manual &amp; rawan</h4>

```php
<?php foreach ($students as $s): ?>
    <p><?= htmlspecialchars($s['name']) ?></p>
<?php endforeach; ?>
```

Lupa <code>htmlspecialchars</code>? Celah XSS terbuka.

</div>
<div class="cmp-laravel">
<h4>React JSX: aman secara default</h4>

```jsx
{students.map((s) => (
    <p key={s.id}>{s.name}</p>
))}
```

Otomatis di-escape. <code>key</code> unik per baris wajib untuk efisiensi render.

</div>
</div>

<p class="fineprint">Ini payoff keamanan dari deck lama: <code>htmlspecialchars()</code> yang dulu harus diingat tiap output, sekarang jadi <b>perilaku default</b> JSX. Untuk menampilkan HTML mentah (berbahaya) harus sengaja pakai <code>dangerouslySetInnerHTML</code> — namanya saja sudah memperingatkan.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Lihat kiri: PHP murni. Ada `<?php foreach`, `?>`, lalu `htmlspecialchars` yang harus diingat bungkus di SETIAP output. Lupa satu saja, itu celah XSS. Kanan: JSX. `{s.name}` — kurung kurawal menampilkan data dan OTOMATIS meng-escape. Ingat pelajaran keamanan kemarin? Di React, perlindungan itu jadi perilaku bawaan — kalian aman tanpa harus ingat."

"Perhatikan juga `key={s.id}` di dalam `map()`. React butuh itu untuk efisiensi — dia memakai `key` untuk melacak elemen mana yang berubah. Ini persis seperti PHP yang butuh loop; cuma React butuh identitas unik per baris."

"Dan kalau kalian benar-benar perlu menampilkan HTML mentah? Ada `dangerouslySetInnerHTML` — dan lihat namanya. React sengaja memberi nama yang menakutkan, supaya kalian sadar itu berbahaya. Persis seperti `<?= ?>` tanpa escape di deck lama: hanya untuk HTML yang kalian sendiri yang bikin."

**🎯 Poin Kunci di Layar:**
- Tunjuk `{s.name}` = auto-escape (payoff XSS deck lama).
- Jelaskan `key` wajib di `map()`.
- Sebut `dangerouslySetInnerHTML`: namanya peringatan, bukan tanpa alasan.



<p class="part-label">Part 4 · Views dengan React <span class="badge badge-live">Live #4</span></p>

## Layout, kondisi kosong, &amp; flash message

<div class="code-duo">
<div>
<p class="filename">resources/js/Layouts/AppLayout.jsx</p>

```jsx
export default function AppLayout({ children }) {
    const { flash } = usePage().props;

    return (
        <div>
            <header>Student Management</header>
            {flash?.success && (
                <div className="alert">{flash.success}</div>
            )}
            <main>{children}</main>
        </div>
    );
}
```
</div>
<div>
<p class="filename">resources/js/Pages/Students/Index.jsx</p>

```jsx
<AppLayout>
    {students.data.length === 0 ? (
        <div>Belum ada data siswa.</div>
    ) : (
        <table>{/* data */}</table>
    )}
</AppLayout>
```
</div>
</div>

<p class="fineprint"><b>Layout</b> menggantikan copy-paste <code>&lt;head&gt;</code> kemarin: sekali tulis, semua halaman pakai. <b><code>children</code></b> = tempat isi halaman dimasukkan. <b>Kondisi kosong</b> ditangani langsung di JSX dengan ternary. <b>Flash</b>: controller cukup <code>-&gt;with('success', ...)</code>, React membacanya dari <code>usePage().props.flash</code>.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Tiga hal sekaligus di slide ini, dan ketiganya menjawab masalah nyata dari proyek kemarin."

"Pertama, Layout. Kemarin setiap file punya `<head>` copy-paste — ganti judul aplikasi berarti edit semua file. Sekarang: satu komponen `AppLayout`, dan halaman lain memakainya. Perhatikan `{children}` — itu 'lubang' tempat isi halaman dimasukkan. Kalau kalian familiar React, ini pola yang sama persis dengan komponen React lain."

"Kedua, kondisi kosong. Perhatikan ternary di bawah: kalau `students.data.length === 0`, tampilkan pesan; kalau tidak, tampilkan tabel. Ingat `if (empty($students))` manual kemarin? Di React ini cuma ekspresi biasa — tidak perlu direktif khusus."

"Ketiga, flash message. Ingat `setFlash` dan `getFlash` yang kita bikin sendiri — lengkap dengan `unset` yang gampang lupa? Sekarang controller cukup `->with('success', 'pesan')`. Data itu otomatis dibagikan ke semua halaman lewat Inertia, dan React mengambilnya dari `usePage().props.flash`. Laravel mengurus penyimpanan dan pembersihannya."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Tunjukkan `AppLayout` dan `{children}` di file asli.
- Tunjukkan ternary kondisi kosong di `Index.jsx`.
- Tunjukkan `->with()` di controller, lalu `usePage().props.flash` di React.
