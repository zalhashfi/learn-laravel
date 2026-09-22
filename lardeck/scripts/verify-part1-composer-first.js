#!/usr/bin/env node
/**
 * T5 verification: Part 1 must present a Composer-first-only install flow.
 * The global Laravel Installer (`composer global require laravel/installer`
 * + `laravel new`) must no longer be offered as a co-equal path inside the
 * Part 1 "Getting Started" slide, and the part must stay decomposed into
 * exactly 8 focused slides (plan 01-01 T1).
 */
import fs from 'node:fs';

const file = 'lardeck/slides/01-getting-started.md';
const content = fs.readFileSync(file, 'utf8');
const failures = [];

if (!/composer create-project laravel\/laravel:\^12\.0 lara-student/.test(content)) {
  failures.push('Part 1 dropped the canonical `composer create-project laravel/laravel:^12.0 lara-student` command');
}

if (!/composer require inertiajs\/inertia-laravel/.test(content)) {
  failures.push('Part 1 dropped `composer require inertiajs/inertia-laravel`');
}

const forbidden = [
  ['composer global require laravel/installer', 'global Laravel Installer install command'],
  ['laravel new lara-student', '`laravel new lara-student` installer path'],
];
for (const [needle, label] of forbidden) {
  if (content.includes(needle)) failures.push(`Part 1 still offers the ${label}: \`${needle}\``);
}

const count = (content.match(/\n\n\n\n/g) || []).length + 1;
if (count !== 8) failures.push(`Part 1 expected 8 slides but got ${count}`);

if (failures.length) {
  console.error('T5 PART 1 COMPOSER-FIRST VERIFICATION FAILED:');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}

console.log('T5 PART 1 COMPOSER-FIRST VERIFICATION PASSED: Composer-only install flow, 8 slides.');
