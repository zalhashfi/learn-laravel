<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Isi tabel students dengan data awal.
     *
     * Bandingkan dengan seed.sql di deck lama — sekarang jadi kode PHP,
     * dan bisa dijalankan berulang dengan `php artisan migrate:fresh --seed`.
     */
    public function run(): void
    {
        $students = [
            ['name' => 'Ayu Lestari',    'email' => 'ayu.lestari@campus.ac.id',    'major' => 'Informatika'],
            ['name' => 'Bagas Prakoso',  'email' => 'bagas.prakoso@campus.ac.id',  'major' => 'Sistem Informasi'],
            ['name' => 'Citra Maharani', 'email' => 'citra.m@campus.ac.id',        'major' => 'Informatika'],
            ['name' => 'Dimas Nugroho',  'email' => 'dimas.n@campus.ac.id',        'major' => 'Teknik Komputer'],
            ['name' => 'Eka Putri',      'email' => 'eka.putri@campus.ac.id',      'major' => 'Sistem Informasi'],
            ['name' => 'Fajar Ramadhan', 'email' => 'fajar.r@campus.ac.id',        'major' => 'Informatika'],
        ];

        foreach ($students as $student) {
            Student::create($student);
        }
    }
}
