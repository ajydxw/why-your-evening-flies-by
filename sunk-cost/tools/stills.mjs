// 批量渲染指定帧的截图，用于逐段检查（node tools/stills.mjs 0 45 90 ...）
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import { webpackOverride } from './webpack-override.mjs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public'), webpackOverride });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || 'Full' });
for (const frame of frames) {
  await renderStill({ composition, serveUrl, frame, timeoutInMilliseconds: 180000, output: path.join(root, `out/stills/f${String(frame).padStart(4, '0')}.png`), imageFormat: 'png' });
  console.log('still', frame);
}
process.exit(0);
