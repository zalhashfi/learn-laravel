<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Guardrail integritas skrip verifikasi dimensi slide (`verify-slide-dimensions.js`).
 *
 * Skrip ini menjalankan Chrome headless via CDP. Dua regresi yang pernah terjadi
 * dan harus dicegah selamanya:
 *
 *  1. Chrome dijalankan memakai profil pengguna bawaan, sehingga ekstensi nyata
 *     (mis. Google Hangouts) ikut termuat dan target CDP non-deck menyusup,
 *     membuat evaluasi `Reveal` gagal (ReferenceError).
 *  2. Proses Chrome tidak dimatikan sampai ke anak-anaknya di Windows, sehingga
 *     puluhan proses `chrome.exe` yatim menumpuk.
 *
 * Kedua invariant diuji lewat "antarmuka publik" skrip, yaitu teks sumbernya,
 * tanpa menjalankan browser (test harus tetap deterministik & offline).
 */
class SlideDimensionScriptGuardTest extends TestCase
{
    private function scriptSource(): string
    {
        $path = base_path('../../scripts/verify-slide-dimensions.js');

        $this->assertFileExists($path, 'Skrip verify-slide-dimensions.js harus ada.');

        return (string) file_get_contents($path);
    }

    public function test_script_isolates_browser_from_default_user_profile(): void
    {
        $source = $this->scriptSource();

        $this->assertStringContainsString(
            '--user-data-dir=',
            $source,
            'Chrome harus memakai --user-data-dir terisolasi agar ekstensi profil bawaan tidak menyusup.'
        );

        $this->assertStringContainsString(
            'mkdtemp',
            $source,
            'Profil terisolasi harus dibuat lewat mkdtemp supaya unik per jalan.'
        );

        $this->assertStringContainsString(
            '--disable-extensions',
            $source,
            'Ekstensi wajib dimatikan agar target CDP non-deck tidak ikut muncul.'
        );

        $this->assertStringContainsString(
            '--no-first-run',
            $source,
            'Flag --no-first-run mencegah Chrome menampilkan dialog interaktif.'
        );
    }

    public function test_script_tears_down_browser_tree_and_temp_profile(): void
    {
        $source = $this->scriptSource();

        $this->assertStringContainsString(
            'taskkill',
            $source,
            'Di Windows, pohon proses Chrome harus dimatikan memakai taskkill agar tidak ada proses yatim.'
        );

        $this->assertStringContainsString(
            "'/PID'",
            $source,
            'Pembersihan harus berbasis PID milik skrip sendiri.'
        );

        $this->assertStringContainsString(
            'String(child.pid)',
            $source,
            'PID proses Chrome yang kita luncurkan dipakai sebagai sasaran taskkill.'
        );

        $this->assertStringContainsString(
            "'/T'",
            $source,
            'taskkill harus memakai /T agar seluruh anak proses (renderer/GPU) ikut mati.'
        );

        $this->assertStringNotContainsString(
            "'/IM'",
            $source,
            'taskkill /IM chrome.exe akan membunuh SEMUA Chrome di mesin, termasuk jendela milik pengguna — dilarang keras.'
        );

        $this->assertStringContainsString(
            'rmSync',
            $source,
            'Profil sementara harus dibersihkan setelah selesai.'
        );

        $this->assertStringContainsString(
            'killBrowser',
            $source,
            'Harus ada satu titik masuk pembersihan (killBrowser) yang dipakai semua jalur keluar.'
        );
    }

    public function test_script_targets_only_html_deck_page_with_readiness_wait(): void
    {
        $source = $this->scriptSource();

        $this->assertStringContainsString(
            'waitForDeckReady',
            $source,
            'Skrip harus menunggu deck siap sebelum mengukur, bukan sekadar sleep tetap.'
        );

        $this->assertStringContainsString(
            "target.type !== 'page'",
            $source,
            'Hanya target bertipe page yang boleh dipakai untuk pengukuran.'
        );

        $this->assertStringContainsString(
            'res.result.value >= EXPECTED_SLIDE_COUNT',
            $source,
            'Kesiapan harus diukur dari jumlah slide ter-render: deck memuat markdown asinkron, ' .
                'dan `Reveal.slide()` yang dipanggil sebelum semua slide ada akan melempar ' .
                '`controlsLeft is not iterable`.'
        );
    }
}
