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
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
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
 * Memilih target halaman deck dari daftar CDP.
 *
 * Sengaja ketat: hanya halaman HTML sungguhan yang boleh lolos. Chrome dengan
 * `--headless` baru tetap bisa memunculkan target `chrome://` (mis. Omnibox
 * Popup) yang teksnya kebetulan memuat kata "lardeck"; target seperti itu tidak
 * punya objek `Reveal` dan pernah membuat pengukuran gagal.
 */
function isDeckTarget(target) {
    if (target.type !== 'page') return false;
    if (typeof target.url !== 'string') return false;
    return /^https?:\/\//.test(target.url) && /\/lardeck(\b|\.|\/|$|\?|#)/.test(target.url);
}

/**
 * Mematikan Chrome yang KITA luncurkan saja, sampai ke seluruh anak prosesnya,
 * lalu menghapus profil sementara.
 *
 * Dua jebakan Windows yang harus dihindari:
 *   1. `child.kill()` hanya membunuh proses induk dan menyisakan puluhan
 *      `chrome.exe` yatim (pernah terjadi: 44 proses menumpuk).
 *   2. `taskkill /IM chrome.exe /T` membunuh SEMUA Chrome di mesin, termasuk
 *      jendela browser milik pengguna — dilarang.
 *
 * Karena itu pembunuhan dilakukan berbasis PID kita sendiri: `taskkill /PID`
 * dengan `/T` cukup untuk merobohkan pohon anak (renderer/GPU) tanpa menyentuh
 * proses Chrome lain.
 */
function killBrowser(child, profileDir) {
    if (child && child.pid && !child.killed) {
        try {
            if (process.platform === 'win32') {
                // Sinkron: kita harus menunggu proses benar-benar mati sebelum
                // menghapus profil, kalau tidak Chrome masih mengunci file.
                spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
                    stdio: 'ignore',
                });
            } else {
                child.kill('SIGKILL');
            }
        } catch (e) {
            // proses mungkin sudah berhenti sendiri
        }
    }
    if (profileDir) {
        // Chrome kadang masih melepas handle-nya sesaat setelah taskkill;
        // coba beberapa kali dengan jeda nyata sebelum menyerah.
        for (let attempt = 0; attempt < 8; attempt++) {
            try {
                fs.rmSync(profileDir, { recursive: true, force: true });
                return;
            } catch (e) {
                // masih terkunci — tunggu sebentar lalu ulangi
            }
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150);
        }
    }
}

/**
 * Menunggu deck benar-benar siap diukur.
 *
 * Deck memuat markdown-nya secara asinkron (plugin RevealMarkdown), sehingga
 * `typeof Reveal === 'function'` saja TIDAK cukup: pada jendela waktu itu
 * `Reveal.getSlides` bahkan belum ada, dan `Reveal.slide()` yang dipanggil
 * terlalu dini melempar `TypeError: this.controlsLeft is not iterable`.
 *
 * Jadi kesiapan diukur dari jumlah slide yang benar-benar sudah ter-render
 * (harus mencapai plafon `EXPECTED_SLIDE_COUNT`).
 */
async function waitForDeckReady(sendCmd, attempts = 60) {
    for (let i = 0; i < attempts; i++) {
        try {
            const res = await sendCmd('Runtime.evaluate', {
                expression: '(function () { try { return Reveal.getSlides().length } catch (e) { return -1 } })()',
                returnByValue: true,
            });
            if (typeof res?.result?.value === 'number' && res.result.value >= EXPECTED_SLIDE_COUNT) return true;
        } catch (e) {
            // dokumen masih berpindah / reveal.js belum attach
        }
        await sleep(250);
    }
    return false;
}

/**
 * Mengumpulkan pengukuran viewport nyata via Chrome DevTools Protocol.
 * @returns {Promise<{total: number, scale: number, budget: number, measurements: Array}>}
 */
async function measureSlides() {
    // Profil sekali pakai: mencegah ekstensi/status profil pengguna nyata
    // (Google Hangouts dll.) ikut termuat dan menyusup ke daftar target CDP.
    const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lardeck-cdp-'));

    const chrome = spawn(CHROME_PATH, [
        '--headless=new',
        `--remote-debugging-port=${CDP_PORT}`,
        `--user-data-dir=${profileDir}`,
        '--disable-extensions',
        '--no-first-run',
        '--no-default-browser-check',
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
        killBrowser(chrome, profileDir);
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

    // Tunggu reveal.js benar-benar siap (bukan sekadar sleep tetap): deck di
    // Vite di-serve asinkron, dan pengukuran sebelum `Reveal` ada akan gagal.
    const ready = await waitForDeckReady(sendCmd);
    if (!ready) {
        ws.close();
        killBrowser(chrome, profileDir);
        throw new Error(
            'reveal.js (`Reveal`) tidak pernah siap di ' +
                `${TARGET_URL}. Pastikan deck memuat reveal.js dengan benar.`,
        );
    }

    const evalExpression = `(async () => {
        Reveal.configure({ transition: 'none' });
        const cfg = Reveal.getConfig();
        // Tinggi isi yang tersedia di kanvas = kanvas dikurangi margin atas/bawah.
        const budget = Math.round(cfg.height * (1 - 2 * cfg.margin));
        const slides = Array.from(document.querySelectorAll('.reveal .slides section:not(.stack)'));
        const measurements = [];
        for (let i = 0; i < slides.length; i++) {
            const s = slides[i];
            const idx = Reveal.getIndices(s);
            Reveal.slide(idx.h, idx.v);
            await new Promise(r => setTimeout(r, 40));
            const headingEl = s.querySelector('h2, h3, h1') || s.querySelector('.part-label');
            measurements.push({
                index: i + 1,
                heading: (headingEl?.innerText || 'Slide ' + (i + 1)).replace(/\\s+/g, ' ').trim().slice(0, 60),
                scrollHeight: s.scrollHeight,
                clientHeight: s.clientHeight,
            });
        }
        return { total: slides.length, scale: Reveal.getScale(), budget, measurements };
    })()`;

    const res = await sendCmd('Runtime.evaluate', {
        expression: evalExpression,
        awaitPromise: true,
        returnByValue: true,
    });

    ws.close();
    killBrowser(chrome, profileDir);

    if (res?.exceptionDetails) {
        throw new Error('Chrome eval exception: ' + JSON.stringify(res.exceptionDetails));
    }
    const val = res?.result?.value !== undefined ? res.result.value : res?.value;
    if (!val) {
        throw new Error('Chrome eval returned empty: ' + JSON.stringify(res));
    }
    return val;
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
