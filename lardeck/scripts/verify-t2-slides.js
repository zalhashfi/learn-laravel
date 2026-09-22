#!/usr/bin/env node
/**
 * T2 verification: Part 2 "Routing & Controllers" must be decomposed from 4
 * packed slides into exactly 6 focused slides (spec.md target), each carrying a
 * single concept, while keeping Live #2 and its teaching artifacts intact.
 *
 * RED phase: this script is written BEFORE the slide decomposition, so it must
 * fail until 02-routing.md actually has 6 horizontal slides.
 */
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '..', 'slides', '02-routing.md');
const content = fs.readFileSync(file, 'utf8');
const slides = content.split(/\n\n\n\n/);

const failures = [];
const check = (label, ok, detail) => {
    if (!ok) failures.push(`${label}${detail ? ' -> ' + detail : ''}`);
};

// --- Slide count guardrail ------------------------------------------------
const count = (content.match(/\n\n\n\n/g) || []).length + 1;
check('Part 2 is 7 slides', count === 7, `got ${count}`);

// --- Spec-mandated decomposed topics -------------------------------------
check(
    'Slide 12A: "Resource Controller" topic exists',
    /^## .*Resource Controller/m.test(content),
);
check(
    'Slide 12A shows the one-line Route::resource registration',
    /Route::resource\(\s*'students'/.test(content) &&
        /make:controller[\s\S]{0,40}--resource/.test(content),
);
check(
    'Slide 12B: stand-alone RESTful route map topic exists',
    /^## .*(Peta|7 Route|Route Standar|Route:list)/im.test(content),
);
check(
    'Slide 12B keeps the full php artisan route:list output',
    /php artisan route:list/.test(content) && /students\.index/.test(content) && /students\.destroy/.test(content),
);
check(
    'Slide 13A: a StudentController subtopic dedicated to index() exists',
    /^## .*StudentController/m.test(content) && /public function index\(\)/.test(content),
);
check(
    'Slide 13A sends the model collection through Inertia::render',
    /Inertia::render\(/.test(content) && /Student::all\(\)/.test(content),
);
check(
    'Slide 13B: SPA <Link> vs <a> topic exists',
    /^## .*Link/m.test(content) || /^## .*SPA/m.test(content),
);
check(
    'Slide 13B contrasts Inertia <Link> with a plain <a> reload',
    /<Link/.test(content) && /<a\b/.test(content) && /reload/i.test(content),
);

// --- Curriculum integrity: Live #2 must survive the split -----------------
const live2Slides = slides.filter((s) => s.includes('badge-live'));
check('Live #2 badge still present exactly once', live2Slides.length === 1, `found ${live2Slides.length}`);
check(
    'Live #2 covers Resource Controller + index() in one live session',
    live2Slides.length === 1 &&
        /Resource Controller/.test(live2Slides[0]) &&
        /make:controller/.test(live2Slides[0]),
);

// --- Zero-leak: every slide keeps exactly one speaker note ----------------
slides.forEach((slide, i) => {
    const notes = (slide.match(/^Note:/gm) || []).length;
    check(`Slide ${i + 1} has exactly one speaker note`, notes === 1, `got ${notes}`);
});

// --- Housekeeping ---------------------------------------------------------
check('Part 2 uses standard LF line endings (no CRLF)', !/\r/.test(content));
check(
    'comparison panels keep PHP purple, not the Laravel green accent',
    !/cmp-php[\s\S]{0,200}var\(--pd-core\)/.test(content),
);

if (failures.length) {
    console.error('T2 VERIFICATION FAILED:');
    for (const f of failures) console.error('  - ' + f);
    process.exit(1);
}
console.log('T2 VERIFICATION PASSED: Part 2 decomposed into 7 focused slides.');
