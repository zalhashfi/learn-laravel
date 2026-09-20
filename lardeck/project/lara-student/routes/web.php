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

Route::resource('students', StudentController::class);
