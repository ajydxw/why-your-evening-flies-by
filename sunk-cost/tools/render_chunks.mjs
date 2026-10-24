// 分段渲染全片（无声）：node tools/render_chunks.mjs [起始帧 结束帧]...
// 不带参数时按默认分段渲染；已存在的分段会跳过（删掉对应文件即可重渲）。
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import { webpackOverride } from './webpack-override.mjs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2).map(Number);
const ranges = args.length ? args.reduce((a, v, i) => (i % 2 ? (a[a.length - 1].push(v), a) : [...a, [v]]), [])
  : [[0, 689], [690, 1379], [1380, 2059], [2060, 2739], [2740, 3419], [3420, 4025]];
fs.mkdirSync(path.join(root, 'out/chunks'), { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public'), webpackOverride });
const composition = await selectComposition({ serveUrl, id: 'Full' });
for (const [a, b] of ranges) {
  const out = path.join(root, `out/chunks/c_${String(a).padStart(4, '0')}_${String(b).padStart(4, '0')}.mp4`);
  if (fs.existsSync(out)) { console.log('跳过', out); continue; }
  const t0 = Date.now(); let last = -1;
  await renderMedia({
    composition, serveUrl, frameRange: [a, b], timeoutInMilliseconds: 180000, codec: 'h264', muted: true, crf: 16, pixelFormat: 'yuv420p',
    concurrency: 2, imageFormat: 'jpeg', jpegQuality: 92, outputLocation: out + '.part.mp4',
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`${a}-${b} 进度 ${p * 10}%`); } },
  });
  fs.renameSync(out + '.part.mp4', out);
  console.log('完成', out, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
process.exit(0);
