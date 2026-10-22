# 你的夜晚，为什么过得这么快？

**由 Claude Opus 5.5 制作的视频源代码。**

本仓库公开《你的夜晚，为什么过得这么快？》的画面、音效合成与渲染代码，基于用户提供的 Claude Opus 5.5 重建源代码压缩包整理。原始工程保存在 [`night/`](night/)，方便阅读、学习和继续创作。

## 原项目参数

- 时长：134.19 秒。
- 画面：1920 × 1080，30 FPS，共 4026 帧。
- 画面实现：Canvas 2D 逐帧绘制。
- 音效实现：Python / NumPy 合成，结合背景音乐混音；原工程目标响度为 −14 LUFS。

以上为原工程说明中的参数。仓库发布时进行了文件完整性和代码语法检查，未重新渲染整片或复核与原成片的一致性。

## 源代码

| 文件 | 内容 |
| --- | --- |
| [`night/core.js`](night/core.js)、[`night/scenes.js`](night/scenes.js)、[`night/shots.js`](night/shots.js) | 基础绘图工具、场景和开场分镜 |
| `night/a0_common.js`、`night/a2.js` 至 `night/a6.js`、`night/a9_master.js` | 各幕画面、共用组件和全片调度 |
| [`night/night.html`](night/night.html) | 已拼接的画面页面 |
| [`night/build.sh`](night/build.sh) | 拼接画面源码并检查语法 |
| [`night/render.cjs`](night/render.cjs)、[`night/still.cjs`](night/still.cjs) | 逐帧视频渲染与静帧输出 |
| [`night/sfx_full.py`](night/sfx_full.py) | 全片音效合成、混音与响度处理 |

## 运行说明

需要 Node.js、Playwright、Chromium、FFmpeg、Python 3、NumPy，以及 Noto Sans SC 字体。

原始脚本保留了制作环境的绝对路径，例如 `/data/night/`、`/vercel/sandbox/node_modules/playwright` 和 `/usr/local/bin/chromium`。运行前请将它们调整为自己的路径；本仓库保留原件，未将其改写为跨平台安装包。

完整文件说明和生成步骤见 [`night/README.md`](night/README.md)。

## 创作来源与许可

- 视频创作及源代码生成：**Claude Opus 5.5**。
- 工程提供与开源发布：[ajydxw](https://github.com/ajydxw)。
- 源代码及文档采用 [MIT License](LICENSE)。
- `night/bgm.mp3` 是原始压缩包中的用户提供音乐，不包含在代码的 MIT 授权范围内。

