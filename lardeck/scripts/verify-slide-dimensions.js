// Automated Slide Dimension & Overflow Verification
// Ensures every slide strictly fits within the 1280x800 presentation canvas
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CDP_PORT = 9334;
const TARGET_URL = 'http://localhost:8000/lardeck.html';
const MAX_ALLOWED_HEIGHT = 800; // Exact Reveal canvas height

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function getJson(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
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

async function main() {
    console.log('--- SLIDE DIMENSION & OVERFLOW GUARDRAIL ---');
    
    // 1. Launch Chrome Headless
    const chrome = spawn(CHROME_PATH, [
        '--headless=new',
        `--remote-debugging-port=${CDP_PORT}`,
        '--disable-gpu',
        '--window-size=1280,800',
        TARGET_URL
    ]);

    let wsUrl = null;
    for (let attempt = 0; attempt < 10; attempt++) {
        await sleep(500);
        try {
            const targets = await getJson(`http://localhost:${CDP_PORT}/json`);
            const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('lardeck.html'));
            if (pageTarget && pageTarget.webSocketDebuggerUrl) {
                wsUrl = pageTarget.webSocketDebuggerUrl;
                break;
            }
        } catch (e) {
            // Chrome still initializing
        }
    }

    if (!wsUrl) {
        chrome.kill();
        console.error('FAIL: Could not connect to Chrome DevTools Protocol.');
        process.exit(1);
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

    const sendCmd = (method, params = {}) => {
        return new Promise((resolve, reject) => {
            const id = msgId++;
            callbacks.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });
    };

    await new Promise(r => ws.onopen = r);

    // Wait for Reveal to initialize
    await sleep(1500);

    // Evaluate script on page to measure all leaf slides
    const evalExpression = `
        (async () => {
            const config = Reveal.getConfig();
            const slides = Array.from(document.querySelectorAll('.reveal .slides section:not(.stack)'));
            const measurements = [];
            for (let i = 0; i < slides.length; i++) {
                const s = slides[i];
                const indices = Reveal.getIndices(s);
                Reveal.slide(indices.h, indices.v);
                await new Promise(r => setTimeout(r, 40));
                measurements.push({
                    index: i + 1,
                    heading: (s.querySelector('h2, h3, h1')?.innerText || s.querySelector('.part-label')?.innerText || 'Slide ' + (i+1)).replace(/\\s+/g, ' ').trim(),
                    scrollHeight: s.scrollHeight,
                    offsetHeight: s.offsetHeight
                });
            }
            return { total: slides.length, measurements };
        })()
    `;

    const res = await sendCmd('Runtime.evaluate', {
        expression: evalExpression,
        awaitPromise: true,
        returnByValue: true
    });

    ws.close();
    chrome.kill();

    const { total, measurements } = res.result.value;
    console.log(`Total slides inspected: ${total}`);

    let failed = false;
    for (const m of measurements) {
        if (m.scrollHeight > MAX_ALLOWED_HEIGHT) {
            failed = true;
            console.error(`FAIL: Slide ${m.index} [${m.heading}] scrollHeight=${m.scrollHeight}px exceeds ${MAX_ALLOWED_HEIGHT}px (+${m.scrollHeight - MAX_ALLOWED_HEIGHT}px)`);
        } else {
            console.log(`ok: Slide ${m.index} [${m.heading}] height=${m.scrollHeight}px (within ${MAX_ALLOWED_HEIGHT}px)`);
        }
    }

    if (total !== 30) {
        failed = true;
        console.error(`FAIL: Expected 30 slides, got ${total}`);
    }

    if (failed) {
        console.error('\nOVERFLOW CHECK FAILED: Slides exceed maximum viewport dimensions.');
        process.exit(1);
    }

    console.log('\nALL SLIDES FIT WITHIN 1280x800 CANVASE. PASSED.');
}

main().catch(err => {
    console.error('Execution error:', err);
    process.exit(1);
});
