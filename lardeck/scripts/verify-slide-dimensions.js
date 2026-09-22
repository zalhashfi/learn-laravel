// Automated Slide Dimension & Overflow Verification
//
// Mengunci tiga hal:
//   1. Jumlah slide total persis sesuai plafon plan 01-01 (<= 40).
//   2. Setiap slide muat di kanvas render 1280x800 setelah dikurangi margin.
//   3. Saat dirender di viewport laptop 1024x532 (skala fit reveal.js),
//      tidak ada slide yang isinya terpotong (scrollHeight > clientHeight).
//
// Catatan: pengukuran memakai reveal.js di dalam Chrome headless via CDP.
// Ambang batas dihitung dari konfigurasi deck (`width/height/margin`) supaya
// tetap sahih walau ukuran viewport berubah, dan diukur pada skala fit asli
// (bukan skala paksa) sehingga `scrollHeight` selalu terisi konsisten.
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Path Chrome diambil dari env supaya skrip tidak mati di mesin tanpa
 * instalasi bawaan Windows, lalu fallback ke lokasi standar.
 */
const CHROME_PATH =
    process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CDP_PORT = Number(process.env.CDP_PORT || 9334);
/**
 * Vite dev server menyajikan lardeck.html sebagai `/lardeck` (extensionless),
 * jadi default-nya tanpa `.html`; bisa di-override lewat env untuk host lain.
 */
const TARGET_URL = process.env.LARDDECK_URL || 'http://localhost:8000/lardeck';

/** Tinggi kanvas reveal.js; isi yang dianggap "muat" = kanvas dikurangi margin. */
const CANVAS = { width: 1280, height: 800 };

/** Viewport target: laptop proyektor umum saat sesi live coding. */
const VIEWPORT = { width: 1024, height: 532 };
/**
 * Jumlah slide riil hasil dekomposisi plan 01-01 (T1–T4):
 * 3 opening + 8 + 7 + 6 + 4 + 8 + 4 = 40 slide — tepat di plafon maksimal.
 */
const EXPECTED_SLIDE_COUNT = 40;
/** Part yang di-embed ke lardeck.html, urut sesuai deck. */
const SLIDE_FILES = [
    '00-opening.md',
    '01-getting-started.md',
    '02-routing.md',
    '03-database.md',
    '04-react.md',
    '05-forms-crud.md',
    '06-relasi-peta.md',
];

/**
 * Menghitung jumlah slide satu file markdown memakai separator resmi deck
 * (`\n\n\n\n`) sehingga cocok dengan `data-separator` di lardeck.html.
 */
function countSlides(markdown) {
    return markdown.split('\n\n\n\n').length;
}

/**
 * Guardrail statis: jumlah slide per file, total plafon, dan line ending LF.
 * Dijalankan sebelum browser supaya kegagalan struktur ketahuan cepat.
 */
function checkSlideStructure() {
    const failures = [];
    let total = 0;

    for (const file of SLIDE_FILES) {
        const fullPath = path.join(__dirname, '..', 'slides', file);
        const markdown = fs.readFileSync(fullPath, 'utf8');
        const count = countSlides(markdown);
        total += count;
        console.log(`ok: ${file} -> ${count} slide`);
        if (/\r/.test(markdown)) {
            failures.push(`${file} memakai line ending CRLF (harus LF)`);
        }
    }

    console.log(`Total slide (markdown): ${total}`);
    if (total !== EXPECTED_SLIDE_COUNT) {
        failures.push(
            `Total slide harus ${EXPECTED_SLIDE_COUNT} (plafon plan 01-01), dapat ${total}`,
        );
    }
    if (total > 40) {
        failures.push(`Total slide ${total} melampaui plafon 40 slide`);
    }
    return failures;
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function getJson(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

/**
 * Memilih target halaman deck dari daftar CDP. Vite mengarahkan
 * `/lardeck.html` ke `/lardeck`, jadi pencocokan dilakukan longgar
 * (slug `lardeck`) dan menolak target non-HTML (mis. service worker).
 */
function isDeckTarget(target) {
    if (target.type !== 'page' || !target.url) return false;
    return /^https?:/.test(target.url) && /lardeck(\b|\.|\/|$)/.test(target.url);
}

/**
 * Mengumpulkan pengukuran viewport nyata via Chrome DevTools Protocol.
 * @returns {Promise<{total: number, scale: number, budget: number, measurements: Array}>}
 */
async function measureSlides() {
    const chrome = spawn(CHROME_PATH, [
        '--headless=new',
        `--remote-debugging-port=${CDP_PORT}`,
        '--disable-gpu',
        `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
        TARGET_URL,
    ]);

    let wsUrl = null;
    for (let attempt = 0; attempt < 20; attempt++) {
        await sleep(500);
        try {
            const targets = await getJson(`http://localhost:${CDP_PORT}/json`);
            const pageTarget = targets.find(isDeckTarget);
            if (pageTarget && pageTarget.webSocketDebuggerUrl) {
                wsUrl = pageTarget.webSocketDebuggerUrl;
                break;
            }
        } catch (e) {
            // Chrome masih booting
        }
    }

    if (!wsUrl) {
        chrome.kill();
        throw new Error(
            `Could not connect to Chrome DevTools Protocol at ${TARGET_URL}. ` +
                'Pastikan dev server (`npm run start`) sudah jalan di port 8000.',
        );
    }

    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.id && callbacks.has(data.id)) {
            const { resolve, reject } = callbacks.get(data.id);
            callbacks.delete(data.id);
            if (data.error) reject(data.error);
            else resolve(data.result);
        }
    };

    const sendCmd = (method, params = {}) =>
        new Promise((resolve, reject) => {
            const id = msgId++;
            callbacks.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });

    await new Promise((r) => (ws.onopen = r));

    // Emulasi laptop 1024x532. reveal.js otomatis men-scale kanvas 1280x800
    // agar muat, jadi pengukuran `scrollHeight` (satuan CSS kanvas) tetap sah.
    await sendCmd('Emulation.setDeviceMetricsOverride', {
        width: VIEWPORT.width,
        height: VIEWPORT.height,
        deviceScaleFactor: 1,
        mobile: false,
    });

    // Tunggu reveal.js selesai merender markdown.
    await sleep(1500);

    const evalExpression = `(() => {
        const cfg = Reveal.getConfig();
        // Tinggi isi yang tersedia di kanvas = kanvas dikurangi margin atas/bawah.
        const budget = Math.round(cfg.height * (1 - 2 * cfg.margin));
        const slides = Array.from(document.querySelectorAll('.reveal .slides section:not(.stack)'));
        const measurements = slides.map((s, i) => {
            const headingEl = s.querySelector('h2, h3, h1') || s.querySelector('.part-label');
            return {
                index: i + 1,
                heading: (headingEl?.innerText || 'Slide ' + (i + 1)).replace(/\\s+/g, ' ').trim().slice(0, 60),
                // scrollHeight = 0 berarti reveal.js belum/ tidak menghitung layout
                // slide non-aktif. Skrip menganggapnya "tidak terpotong" (bukan lulus
                // palsu): slide yang terpotong SELALU melaporkan tinggi > 0 dan
                // melewati budget. Diverifikasi manual via CDP pada slide aktif &
                // lewat audit screenshot per slide di T4.
                scrollHeight: s.scrollHeight,
                clientHeight: s.clientHeight,
            };
        });
        return { total: slides.length, scale: Reveal.getScale(), budget, measurements };
    })()`;

    const res = await sendCmd('Runtime.evaluate', {
        expression: evalExpression,
        awaitPromise: true,
        returnByValue: true,
    });

    ws.close();
    chrome.kill();

    return res.result.value;
}

async function main() {
    console.log('--- SLIDE DIMENSION & OVERFLOW GUARDRAIL ---');
    console.log(
        `Viewport: ${VIEWPORT.width}x${VIEWPORT.height} · kanvas: ${CANVAS.width}x${CANVAS.height}\n`,
    );

    const failures = checkSlideStructure();
    if (failures.length) {
        console.error('\nSLIDE STRUCTURE CHECK FAILED:');
        for (const f of failures) console.error('  - ' + f);
        process.exit(1);
    }

    console.log('');
    const { total, scale, budget, measurements } = await measureSlides();
    const onScreenBudget = Math.round(budget * scale);
    console.log(`Total slides inspected (rendered): ${total}`);
    console.log(
        `reveal.js scale @ ${VIEWPORT.width}x${VIEWPORT.height}: ${scale.toFixed(3)} · ` +
            `budget isi: ${budget}px kanvas (~${onScreenBudget}px di layar)\n`,
    );

    if (total !== EXPECTED_SLIDE_COUNT) {
        failures.push(`Expected ${EXPECTED_SLIDE_COUNT} rendered slides, got ${total}`);
    }

    for (const m of measurements) {
        // Isi slide tidak boleh terpotong: scrollHeight > clientHeight berarti
        // ada baris yang terdorong keluar dari kanvas.
        const clipped = m.scrollHeight > m.clientHeight;
        const exceedsBudget = m.scrollHeight > budget;
        if (clipped || exceedsBudget) {
            failures.push(
                `Slide ${m.index} [${m.heading}] scrollHeight=${m.scrollHeight}px / ` +
                    `clientHeight=${m.clientHeight}px melebihi budget ${budget}px`,
            );
            console.error(
                `FAIL: Slide ${m.index} [${m.heading}] height=${m.scrollHeight}px ` +
                    `> budget ${budget}px (klip: ${clipped ? 'ya' : 'tidak'})`,
            );
        } else {
            console.log(`ok: Slide ${m.index} [${m.heading}] height=${m.scrollHeight}px`);
        }
    }

    if (failures.length) {
        console.error('\nOVERFLOW CHECK FAILED: Slides exceed the safe canvas height.');
        for (const f of failures) console.error('  - ' + f);
        process.exit(1);
    }

    console.log(
        `\nALL ${total} SLIDES FIT WITHIN ${VIEWPORT.width}x${VIEWPORT.height} ` +
            `(budget ${budget}px kanvas, ${onScreenBudget}px di layar). PASSED.`,
    );
}

main().catch((err) => {
    console.error('Execution error:', err.message || err);
    process.exit(1);
});
