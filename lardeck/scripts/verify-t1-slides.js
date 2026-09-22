#!/usr/bin/env node
/**
 * T1 verification: Part 1 "Getting Started" must be decomposed from 6 packed
 * slides into exactly 8 focused slides (spec.md target), each carrying a
 * single concept, while keeping the Composer-first install flow and Live #1 intact.
 *
 * RED phase: this script is written BEFORE the slide decomposition, so it must
 * fail until 01-getting-started.md actually has 8 horizontal slides.
 */
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '..', 'slides', '01-getting-started.md');
const content = fs.readFileSync(file, 'utf8');

const failures = [];
const check = (label, ok, detail) => {
    if (!ok) failures.push(`${label}${detail ? ' -> ' + detail : ''}`);
};

// --- Slide count guardrail ------------------------------------------------
const count = (content.match(/\n\n\n\n/g) || []).length + 1;
check('Part 1 is 8 slides', count === 8, `got ${count}`);

// --- Spec-mandated decomposed topics -------------------------------------
check(
    'Slide 5A: "Kenapa Composer?" topic exists',
    /^## .*Composer/m.test(content) && /require/i.test(content),
);
check(
    'Slide 5B: "Create a New Project" topic exists',
    /^## .*(Create a New Project|New Project)/m.test(content),
);
check(
    'Slide 5B installs Inertia for React',
    /inertiajs\/inertia-laravel/.test(content) && /^(##|#).*Inertia/m.test(content),
);
check(
    'Slide 7A: "Struktur Folder" topic exists',
    /^## .*Struktur Folder/m.test(content),
);
check(
    'Slide 7B: "Document Root public/" topic exists',
    /^## .*Document Root/m.test(content),
);
check(
    'Slide 7B keeps the Inertia app.blade.php bridge narrative',
    /app\.blade\.php/.test(content) && /@inertia/.test(content),
);

// --- Curriculum integrity: Live #1 must survive the split -----------------
const live1Slides = content.split(/\n\n\n\n/).filter((s) => s.includes('badge-live'));
check('Live #1 badge still present', live1Slides.length >= 1, `found ${live1Slides.length}`);
check(
    'Live #1 keeps the canonical composer create-project command',
    /composer create-project laravel\/laravel:\^12\.0 lara-student/.test(content),
);
check(
    'Live #1 keeps the composer require inertiajs command',
    /composer require inertiajs\/inertia-laravel/.test(content),
);

// --- Zero-leak: every slide keeps exactly one speaker note ----------------
const slides = content.split(/\n\n\n\n/);
slides.forEach((slide, i) => {
    const notes = (slide.match(/^Note:/gm) || []).length;
    check(`Slide ${i + 1} has exactly one speaker note`, notes === 1, `got ${notes}`);
});

if (failures.length) {
    console.error('T1 VERIFICATION FAILED:');
    for (const f of failures) console.error('  - ' + f);
    process.exit(1);
}
console.log('T1 VERIFICATION PASSED: Part 1 decomposed into 8 focused slides.');
