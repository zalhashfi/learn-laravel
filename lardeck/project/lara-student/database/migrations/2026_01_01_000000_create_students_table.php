<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi.
     *
     * Bandingkan dengan schema.sql di deck lama:
     *
     *   CREATE TABLE students (
     *       id    INT AUTO_INCREMENT PRIMARY KEY,
     *       name  VARCHAR(100) NOT NULL,
     *       email VARCHAR(150) NOT NULL,
     *       major VARCHAR(80)  NOT NULL
     *   );
     *
     * Kolom yang sama, tapi sekarang sebagai KODE yang bisa di-version-control.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();                      // = INT AUTO_INCREMENT PRIMARY KEY
            $table->string('name', 100);       // = VARCHAR(100) NOT NULL
            $table->string('email', 150);      // = VARCHAR(150) NOT NULL
            $table->string('major', 80);       // = VARCHAR(80)  NOT NULL
            $table->timestamps();              // created_at & updated_at (otomatis)
        });
    }

    /**
     * Batalkan migrasi.
     *
     * Selalu tulis down() dengan benar supaya `migrate:rollback` aman.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
