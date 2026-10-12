import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://127.0.0.1:5173/');
const counts = () =>
  page.evaluate(() => ({
    elements: document.querySelectorAll('*').length,
    canvases: document.querySelectorAll('canvas').length,
    images: document.querySelectorAll('img').length,
  }));
const baseline = await counts();
await page.getByRole('button', { name: 'Take a seat' }).click();
await page.locator('canvas').waitFor();
const graphics = await page.evaluate(() => {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return null;
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  return {
    renderer: gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
    vendor: gl.getParameter(info ? info.UNMASKED_VENDOR_WEBGL : gl.VENDOR),
  };
});
await page.evaluate(() => {
  window.__qaFrames = [];
  window.__qaRunning = true;
  let last = performance.now();
  function tick(now) {
    if (!window.__qaRunning) return;
    window.__qaFrames.push(now - last);
    last = now;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});
await page.getByRole('button', { name: 'Draw 2 cards' }).click();
await page.waitForFunction(() => {
  const button = document.querySelector('.turn-actions button');
  return button && !button.disabled && button.textContent.includes('End turn');
});
const frames = await page.evaluate(() => {
  window.__qaRunning = false;
  return window.__qaFrames;
});
await page.getByRole('button', { name: 'SIDE EFFECTS' }).click();
await page.getByRole('button', { name: 'Leave without saving' }).click();
const cycles = [];
for (let i = 0; i < 3; i++) {
  await page.getByRole('button', { name: 'Take a seat' }).click();
  await page.locator('canvas').waitFor();
  await page.getByRole('button', { name: 'SIDE EFFECTS' }).click();
  await page.getByRole('button', { name: 'Leave without saving' }).click();
  cycles.push(await counts());
}
const averageMs = frames.reduce((a, b) => a + b, 0) / frames.length;
const report = {
  environment:
    'Playwright headless Chromium, software WebGL; not a hardware performance certification',
  baseline,
  graphics,
  cycles,
  frameSample: {
    frames: frames.length,
    averageMs: +averageMs.toFixed(2),
    averageRafFps: +(1000 / averageMs).toFixed(1),
    worstMs: +Math.max(...frames).toFixed(2),
  },
  pageErrors: errors,
};
writeFileSync('artifacts/performance.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
await browser.close();
