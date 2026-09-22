#!/usr/bin/env node
/**
 * T3 verification: Part 3 "Database & Eloquent" must be decomposed from 4
 * packed slides into exactly 6 focused slides (plan 01-01 Task 3), each
 * carrying a single concept, while keeping Live #3 and the simplified
 * schema (generic string columns, no arbitrary length) intact.
 *
 * RED phase: this script is written BEFORE the slide decomposition, so it must
 * fail until 03-database.md actually has 6 horizontal slides.
 */
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const slidesDir = path.join(__dirname, '..', 'slides');
const file = path.join(slidesDir, '03-database.md');
const content = fs.readFileSync(file, 'utf8');
const slides = content.split(/\n\n\n\n/);

const failures = [];
const check = (label, ok, detail) => {
    if (!ok) failures.push(`${label}${detail ? ' -> ' + detail : ''}`);
};

// --- Slide count guardrails -----------------------------------------------
const count = (content.match(/\n\n\n\n/g) || []).length + 1;
check('Part 3 is 6 slides', count === 6, `got ${count}`);

// Part 4 "React & Views" ikut dijaga di sini karena T3/T4 adalah satu wave
// dekomposisi: Part 4 harus tetap 4 slide (plan 01-01 T4).
const part4 = fs.readFileSync(path.join(slidesDir, '04-react.md'), 'utf8');
const count4 = (part4.match(/\n\n\n\n/g) || []).length + 1;
check('Part 4 is 4 slides', count4 === 4, `got ${count4}`);

// --- Spec-mandated decomposed topics -------------------------------------
check(
    'Slide 15A: a migration-as-code subtopic exists',
    /^## .*Migration/m.test(content) && /Schema::create\(\s*'students'/.test(content),
);
check(
    'Slide 15A contrasts schema.sql with the Blueprint up()/down() pair',
    /schema\.sql/i.test(content) && /up\(\)/.test(content) && /down\(\)/.test(content),
);
check(
    'Slide 15B: a make:model / migrate / db:seed terminal topic exists',
    /^## .*(Seeder|Menjalankan|Migrate)/im.test(content) &&
        /php artisan make:model/.test(content) &&
        /php artisan migrate/.test(content),
);
check(
    'Slide 15B keeps the one-shot migrate:fresh --seed reset',
    /migrate:fresh --seed/.test(content),
);
check(
    'Slide 16A: an Eloquent ORM topic exists',
    /^## .*Eloquent/m.test(content),
);
check(
    'Slide 16A contrasts manual PDO with Student::all()',
    /PDO/i.test(content) && /Student::all\(\)/.test(content) && /\$pdo->query/.test(content),
);
check(
    'Slide 16B: a Model & mass-assignment subtopic exists',
    /^## .*(Model|fillable|Mass Assignment)/im.test(content),
);
check(
    'Slide 16B declares the $fillable whitelist',
    /protected \$fillable = \[/.test(content) &&
        /\$fillable[\s\S]{0,200}(whitelist|boleh)/i.test(content),
);

// --- Curriculum integrity: Live #3 must survive the split -----------------
const live3Slides = slides.filter((s) => s.includes('badge-live'));
check('Live #3 badge still present exactly once', live3Slides.length === 1, `found ${live3Slides.length}`);
check(
    'Live #3 still teaches migration + seeder in one live session',
    live3Slides.length === 1 &&
        /Migration/i.test(live3Slides[0]) &&
        /Seeder/i.test(live3Slides[0]),
);

// --- Schema integrity: generic string columns, no arbitrary length --------
check("03-database has string('name')", content.includes("$table->string('name');"));
check("03-database has string('email')", content.includes("$table->string('email');"));
check("03-database has string('major')", content.includes("$table->string('major');"));
check('03-database has no numeric string length', !/\$table->string\('[a-z]+',\s*\d+\)/.test(content));

// --- Zero-leak: every slide keeps exactly one speaker note ----------------
slides.forEach((slide, i) => {
    const notes = (slide.match(/^Note:/gm) || []).length;
    check(`Slide ${i + 1} has exactly one speaker note`, notes === 1, `got ${notes}`);
});

// --- Housekeeping ---------------------------------------------------------
check('Part 3 uses standard LF line endings (no CRLF)', !/\r/.test(content));

if (failures.length) {
    console.error('T3 VERIFICATION FAILED:');
    for (const f of failures) console.error('  - ' + f);
    process.exit(1);
}
console.log('T3 VERIFICATION PASSED: Part 3 decomposed into 6 focused slides; Part 4 is 4 slides.');
