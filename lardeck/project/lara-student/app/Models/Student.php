<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     *
     * Ini adalah WHITELIST, hanya field di sini yang boleh diisi lewat
     * Student::create([...]) atau $student->update([...]).
     *
     * Paralel dengan prinsip whitelist di Part 9 deck lama
     * (in_array($_POST['major'], $jurusanValid)).
     *
     * @var list<string>
     */
    protected $fillable = ['name', 'email', 'major'];
}
