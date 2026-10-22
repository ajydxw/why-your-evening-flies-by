# 《你的夜晚，为什么过得这么快？》— 源代码

全片 134.19 秒，1920×1080，30fps（共 4026 帧）。画面全部用 Canvas 2D 代码逐帧绘制，音效全部用 Python/numpy 合成，再和背景音乐混音到 −14 LUFS。

## 文件结构
| 文件 | 作用 |
|---|---|
| head.html / tail.html | 页面头尾（画布、字体加载、初始化） |
| core.js | 基础工具：缓动函数、文字、光效、颗粒、镜头抖动、节拍换算 `bt(k)` |
| scenes.js | 开场用到的场景：卧室、办公室、时钟、手机等 |
| shots.js | 开场 0–23 秒的分镜（`renderOpen`） |
| a0_common.js | 第 2–6 幕共用的组件：尺子、珠子、罐子、字幕、图层淡入淡出等 |
| a2.js – a6.js | 第 2–6 幕：①注意力 ②距离 ③回忆 → 三重失灵 / 象限图 → 三个方法 / 晚安 |
| a9_master.js | 总调度：按时间分配各幕、镜头抖动表、后期（泛光/色差/闪白） |
| build.sh | 把以上文件拼接成 night.html 并检查语法 |
| render.cjs | 用 Playwright + Chromium 逐帧渲染，通过管道交给 ffmpeg 编码 |
| still.cjs | 渲染指定时间点的静帧（自检用） |
| sfx.py | 开场版音效脚本（旧版，仅供参考） |
| sfx_head.py + sfx_acts.py + sfx_tail.py → sfx_full.py | 全片音效合成 + 混音 + 响度标准化 |
| bgm.mp3 | 背景音乐（你提供的音乐） |

## 环境
Node 18+、playwright、Chromium、ffmpeg、Python 3 + numpy、系统字体 Noto Sans SC（Black/Bold）。
注意：脚本里写的是绝对路径 `/data/night/...`，以及 playwright `/vercel/sandbox/node_modules/playwright`、Chromium `/usr/local/bin/chromium`，换电脑时请改成你自己的路径。

## 生成步骤
```bash
# 0) 准备音乐（48kHz 立体声 WAV）
ffmpeg -i bgm.mp3 -ar 48000 -ac 2 bgm.wav

# 1) 拼接页面
./build.sh

# 2) 渲染画面（可拆成几段并行，再用 concat 合并）
node render.cjs 0 4026 video.mp4
#   预览静帧：node render.cjs 5,43.5,120 0 stills/

# 3) 合成音频 → full_a.wav（约 −14 LUFS）
python3 sfx_full.py

# 4) 合并音画
ffmpeg -i video.mp4 -i full_a.wav -map 0:v -map 1:a -c:v libx264 -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 256k -movflags +faststart -shortest final.mp4
```
