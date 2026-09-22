// T3 verification: Part 3 migration snippet alignment + Part 4 slide consolidation.
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

const c3 = read('03-database.md');
const c4 = read('04-react.md');

// Part 4 must be exactly 3 slides.
const count3 = (c3.match(/\n\n\n\n/g) || []).length + 1;
const count4 = (c4.match(/\n\n\n\n/g) || []).length + 1;
check('Part 3 is 4 slides', count3 === 4, `got ${count3}`);
check('Part 4 is 3 slides', count4 === 3, `got ${count4}`);

// Part 3 Live #3 migration snippet must match the simplified schema.
check("03-database has string('name')", c3.includes("$table->string('name');"));
check("03-database has string('email')", c3.includes("$table->string('email');"));
check("03-database has string('major')", c3.includes("$table->string('major');"));
check('03-database has no numeric string length', !/\$table->string\('[a-z]+',\s*\d+\)/.test(c3));

// Part 4 must no longer have a standalone title slide: the intro topic
// "HTML yang sekarang ditulis di JavaScript" was merged away, and the deck
// title "# Views dengan React" now sits on the same slide as the Props topic.
check(
    'Part 4 dropped the standalone intro topic',
    !c4.includes('HTML yang sekarang ditulis di JavaScript'),
);
check(
    'Part 4 title and Props topic share one slide',
    /^# Views dengan React\n\n## Props: data dari Laravel masuk ke React$/m.test(c4),
);

if (failed) {
    console.error('T3 VERIFICATION FAILED');
    process.exit(1);
}
console.log('T3 VERIFICATION PASSED');
