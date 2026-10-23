const { chromium } = require('/vercel/sandbox/node_modules/playwright');
const { spawn } = require('child_process'); const fs = require('fs');
(async () => {
  const [, , start, end, out] = process.argv;
  const b = await chromium.launch({ executablePath: '/usr/local/bin/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('console', m => console.log('PAGE', m.text())); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file:///data/crab/crab.html');
  await p.waitForFunction(() => window.READY || window.ERR, null, { timeout: 60000 });
  const err = await p.evaluate(() => window.ERR); if (err) { console.log('LOAD ERR', err); process.exit(1); }
  if (out === 'sfx') { fs.writeFileSync('/data/song/mv/sfx.json', JSON.stringify(await p.evaluate(() => sfxEvents()))); fs.writeFileSync('/data/song/mv/rain.json', JSON.stringify(await p.evaluate(() => rainLevels()))); }
  else if (out.endsWith('.mp4')) {
    const s = +start, e = +end;
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = s; f < e; f++) {
      const d = await p.evaluate(f => { renderAt(f / 30); return C.toDataURL('image/jpeg', 0.95); }, f);
      const buf = Buffer.from(d.split(',')[1], 'base64'); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 60 == 0) console.log('frame', f, ((Date.now() - t0) / 1000).toFixed(1) + 's');
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  } else {
    fs.mkdirSync(out, { recursive: true });
    for (const t of start.split(',').map(Number)) {
      const f = Math.round(t * 30);
      const d = await p.evaluate(f => { renderAt(f / 30); return C.toDataURL('image/jpeg', 0.9); }, f);
      fs.writeFileSync(`${out}/f_${t.toFixed(2)}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
    }
  }
  await b.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
