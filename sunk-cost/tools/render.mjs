// 渲染视频（无声），再用 ffmpeg 合入混好的音频。用法：node tools/render.mjs Part1 out/part1_video.mp4
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import { webpackOverride } from './webpack-override.mjs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [id = 'Part1', out = 'out/part1_video.mp4'] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public'), webpackOverride });
const composition = await selectComposition({ serveUrl, id });
let last = -1;
await renderMedia({
  composition, serveUrl, timeoutInMilliseconds: 180000, codec: 'h264', muted: true, crf: 16, pixelFormat: 'yuv420p', concurrency: 2,
  imageFormat: 'jpeg', jpegQuality: 92, outputLocation: path.join(root, out),
  onProgress: ({ progress }) => { const p = Math.floor(progress * 20); if (p !== last) { last = p; console.log(`进度 ${p * 5}%`); } },
});
console.log('完成', out);
process.exit(0);
