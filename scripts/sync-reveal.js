// sync-reveal.js — salin aset reveal.js dari node_modules ke dist/
// supaya lardeck.html bisa memakai pola yang sama dengan phpdeck.html
// (link langsung ke dist/reveal.js dst).
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'node_modules/reveal.js/dist');
const dest = resolve(root, 'dist');

if (!existsSync(src)) {
	console.error('✗ node_modules/reveal.js/dist tidak ditemukan. Jalankan `npm install` dulu.');
	process.exit(1);
}

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });

// hanya butuh tema black, tapi biarkan semua tema ikut (ukuran kecil)
console.log('✓ Aset reveal.js disalin ke dist/');
