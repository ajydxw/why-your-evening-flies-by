# Claude Opus 5.5 视频源代码合集

**由 Claude Opus 5.5 制作的视频源代码。**

这里收录用户提供的 Canvas 2D、Remotion / React 视频工程，包括画面绘制、时间线调度、音效合成和渲染脚本。每部作品独立保存在自己的文件夹，便于阅读、学习和继续创作。

## 作品目录

| 作品 | 源代码 | 制作模型 | 原项目参数 |
| --- | --- | --- | --- |
| 《你的夜晚，为什么过得这么快？》 | [`night/`](night/) | Claude Opus 5.5 | 134.19 秒 · 1920 × 1080 · 30 FPS |
| 《没有盖子的竹篓》 | [`crab-basket/`](crab-basket/) | Claude Opus 5.5 | 134.19 秒 · 1920 × 1080 · 30 FPS |
| 《越想赢，越会输》 | [`yd-project/`](yd-project/) | Claude Opus 5.5 | 134.2 秒 · 1920 × 1080 · 30 FPS |
| 《沉没成本谬误》 | [`sunk-cost/`](sunk-cost/) | Claude Opus 5.5 | 134.2 秒 · 1920 × 1080 · 30 FPS |

以上参数来自各工程原始说明。发布时检查源文件完整性和代码语法，未重新渲染整片或复核与原成片的一致性。

## 运行说明

主要环境为 Node.js、Playwright、Chromium、FFmpeg、Python 3、NumPy，以及 Noto Sans SC 字体；Remotion 工程还需安装 Remotion / React，具体依赖见对应工程说明。

原始脚本保留了制作环境的绝对路径，例如 `/data/night/`、`/data/crab/`、`/vercel/sandbox/node_modules/playwright` 和 `/usr/local/bin/chromium`。运行前请按自己的环境调整。

每部作品的文件说明、时间轴和生成步骤，见对应文件夹里的 `README.md`。

## 创作来源与许可

- 视频创作及源代码生成：**Claude Opus 5.5**。
- 工程提供与开源发布：[ajydxw](https://github.com/ajydxw)。
- 源代码及文档采用 [MIT License](LICENSE)。
- 各工程内的背景音乐 `bgm.mp3`、`bgm.wav` 及预混音轨 `mix_full.wav` 来自用户提供的原始压缩包，不包含在代码的 MIT 授权范围内。
- 《越想赢，越会输》附带的 Noto Sans SC 字体采用 SIL Open Font License 1.1，见 [`yd-project/OFL.txt`](yd-project/OFL.txt)。
- 《沉没成本谬误》附带的 Noto Sans SC 字体采用 SIL Open Font License 1.1，见 [`sunk-cost/public/fonts/OFL.txt`](sunk-cost/public/fonts/OFL.txt)。

