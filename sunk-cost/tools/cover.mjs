// 导出发布封面：node tools/cover.mjs → out/封面_横版16x9.png、out/封面_竖版3x4.png
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import { webpackOverride } from './webpack-override.mjs';
const FRAME = 256; // 与 src/Cover.tsx 的 COVER_FRAME 一致（约 8.5s 激光眼）
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public'), webpackOverride });
for (const [id, name] of [['CoverH', '封面_横版16x9.png'], ['CoverV', '封面_竖版3x4.png']]) {
  const composition = await selectComposition({ serveUrl, id });
  await renderStill({ composition, serveUrl, frame: FRAME, output: path.join(root, 'out', name), imageFormat: 'png', timeoutInMilliseconds: 180000 });
  console.log('封面', name);
}
process.exit(0);
