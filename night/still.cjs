const { chromium } = require('/vercel/sandbox/node_modules/playwright'); const fs = require('fs');
(async () => {
  const [, , times, out, mode] = process.argv;
  const b = await chromium.launch({ executablePath: '/usr/local/bin/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log('PAGE', m.text()));
  await p.goto('file:///data/night/night.html'); await p.waitForFunction(() => window.READY || window.ERR, null, { timeout: 60000 });
  const err = await p.evaluate(() => window.ERR); if (err) { console.log('LOAD ERR', err); process.exit(1); }
  if (mode) await p.evaluate(m => window.MODE = m, mode);
  fs.mkdirSync(out, { recursive: true });
  for (const t of times.split(',').map(Number)) { const d = await p.evaluate(t => { renderAt(t); return C.toDataURL('image/jpeg', .88); }, t); fs.writeFileSync(`${out}/f_${t.toFixed(2)}.jpg`, Buffer.from(d.split(',')[1], 'base64')); }
  await b.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
