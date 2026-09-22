// T4 verification: Part 5 Inertia debugger documentation + Part 6 slide consolidation.
// Bagian ini adalah guardrail dasar (dimensi & jumlah slide E2E ditangani
// lardeck/scripts/verify-slide-dimensions.js di T5).
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const slidesDir = path.join(__dirname, '..', 'slides');
const read = (f) => fs.readFileSync(path.join(slidesDir, f), 'utf8');

let failed = false;
const check = (label, ok, detail) => {
    if (!ok) {
        failed = true;
        console.error(`FAIL: ${label}${detail ? ' -> ' + detail : ''}`);
    } else {
        console.log(`ok: ${label}`);
    }
};

const c1 = read('01-getting-started.md');
const c5 = read('05-forms-crud.md');
const c6 = read('06-relasi-peta.md');

// Slide counts per plan 01-01: Part 5 grows from 6 to 8 (Task 4),
// Part 6 stays consolidated at 4.
const count5 = (c5.match(/\n\n\n\n/g) || []).length + 1;
const count6 = (c6.match(/\n\n\n\n/g) || []).length + 1;
check('Part 5 is 8 slides (plan 01-01 T4)', count5 === 8, `got ${count5}`);
check('Part 6 is 4 slides (plan 01-01 T5)', count6 === 4, `got ${count6}`);

// Part 5 Live #8 must document Inertia's client-side modal for dd() and HTTP 500.
const live8 = c5.split(/\n\n\n\n/).find((s) => s.includes('Live #8'));
check('Part 5 has a Live #8 slide', Boolean(live8));
if (live8) {
    check('Live #8 mentions the Inertia error modal', /Inertia Error Modal/i.test(live8));
    check('Live #8 covers dd() inside the modal', /dd\(\)/.test(live8));
    check('Live #8 covers HTTP 500 inside the modal', /500/.test(live8));
    check(
        'Live #8 explains no full page reload',
        /(tanpa|bukan|tidak).{0,40}(reload|muat ulang|pindah halaman)/i.test(live8),
    );
}

// Part 6 must drop the standalone Starter Kit theory slide and fold its
// summary into the concluding roadmap slide.
check(
    'Part 6 dropped the standalone Starter Kit slide',
    !c6.includes('Sekilas: di proyek nyata, kalian mulai dari Starter Kit'),
);
check(
    'Part 6 roadmap slide still summarises the Starter Kit',
    /Starter Kit/i.test(c6),
);
check(
    'Part 6 keeps the Composer-first install narrative',
    c6.includes('composer create-project') &&
        c6.includes('composer require inertiajs/inertia-laravel'),
);
check(
    'Part 6 retains the roadmap.sh roadmap table',
    c6.includes('roadmap.sh/laravel'),
);
check(
    'Part 6 recap slide is intact',
    c6.includes('## Recap: 6 file plain PHP'),
);

// Slide 7A ("Struktur Folder") & 7B ("Document Root") must state the
// Ignore & Co-exist policy for Breeze's bundled Auth folder.
const s7a = c1.split(/\n\n\n\n/).find((s) => /^## .*Struktur Folder/m.test(s));
const s7b = c1.split(/\n\n\n\n/).find((s) => /^## .*Document Root/m.test(s));
check('Part 1 has a "Struktur Folder" slide (7A)', Boolean(s7a));
check('Part 1 has a "Document Root" slide (7B)', Boolean(s7b));
if (s7a) {
    check(
        'Slide 7A calls out the bundled Auth folder',
        /Pages\/Auth\//.test(s7a) && /Breeze/i.test(s7a),
        'expected "resources/js/Pages/Auth/" + Breeze',
    );
    check(
        'Slide 7A keeps the audience on Pages/Students/',
        /Pages\/Students\//.test(s7a),
    );
}
if (s7b) {
    check(
        'Slide 7B frames the bundled Auth folder as a bonus',
        /Pages\/Auth\//.test(s7b) && /(bonus|bawaan)/i.test(s7b),
        'expected "Pages/Auth/" + "bonus"/"bawaan"',
    );
    check(
        'Slide 7B reaffirms the Pages/Students/ focus',
        /Pages\/Students\//.test(s7b),
    );
}

// Part 6 roadmap slide must explain the Starter Kit as a time-saver for
// Auth scaffolding in real-world projects.
check(
    'Part 6 frames the Starter Kit as an Auth-scaffolding time saver',
    /Starter Kit/i.test(c6) && /(Auth|autentikasi|auth)/.test(c6) && /(waktu|hemat|cepat)/i.test(c6),
);

if (failed) {
    console.error('T4 VERIFICATION FAILED');
    process.exit(1);
}
console.log('T4 VERIFICATION PASSED');
