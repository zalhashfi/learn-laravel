<?php

use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Bandingkan dengan deck lama: dulu "routing" itu nama file (index.php,
| create.php, edit.php, delete.php). Sekarang jadi daftar eksplisit di sini.
|
| Route::resource('students', StudentController::class) menghasilkan 7 route:
|   GET     /students              index     -> tampil daftar
|   GET     /students/create       create    -> form tambah
|   POST    /students              store     -> simpan baru
|   GET     /students/{student}    show      -> detail
|   GET     /students/{student}/edit edit    -> form edit
|   PUT     /students/{student}    update    -> simpan perubahan
|   DELETE  /students/{student}    destroy   -> hapus
|
*/

Route::redirect('/', '/students');

/*
| Route tulis (store & update) diberi pembatas laju `throttle:10,1`.
| Ini lapis kedua proteksi double-submit: `disabled={processing}` di React
| baru aktif setelah request didispatch, sehingga klik ganda pada tick yang
| sama masih bisa lolos. Throttle menutup celah itu di sisi server.
*/
Route::resource('students', StudentController::class)->middleware([
    'store' => 'throttle:10,1',
    'update' => 'throttle:10,1',
]);
