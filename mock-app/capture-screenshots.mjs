// Captures screenshots of the mock portal for documentation.
// Usage: node mock-app/capture-screenshots.mjs  (mock app must be running on :4300)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4300';
const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(`captured ${name}`);
}

await page.goto(`${BASE}/login`);
await shot('login');

await page.getByTestId('login-email').fill('patient@example.com');
await page.getByTestId('login-password').fill('Test1234!');
await page.getByTestId('login-submit').click();
await page.waitForURL('**/dashboard');
await shot('dashboard');

for (const [path, name] of [['/appointments', 'appointments'], ['/prescriptions', 'prescriptions'], ['/billing', 'billing']]) {
  await page.goto(`${BASE}${path}`);
  await shot(name);
}

await browser.close();
