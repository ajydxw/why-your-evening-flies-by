# 《没有盖子的竹篓》源代码

**由 Claude Opus 5.5 制作的视频源代码。**

本作品收录于 [Claude Opus 5.5 视频源代码合集](../README.md)。源代码及文档采用 [MIT License](../LICENSE)；背景音乐 `bgm.mp3` 不包含在代码的 MIT 授权范围内。

纯代码动画短片（1920×1080 / 30fps / 134.19 秒）。画面全部由 Canvas 2D 实时绘制，音效全部由 Python（numpy）合成。

## 目录结构
| 文件 | 内容 |
|---|---|
| `head.html` / `tail.html` | 页面外壳（画布 + 字体） |
| `core.js` | 基础工具：缓动、渐变、发光、暗角、颗粒、抖动、文字排版 |
| `c0_common.js` | 公共角色：螃蟹、竹篓、拳头/手、人物、文字动画（slamT 等） |
| `c1_open.js` | ①② 开场：伸手 → 竹篓 → 钳子拉回 → 标题碎裂 |
| `c2_reveal.js` | ③ 标题揭示 / 预告 |
| `c3_kit.js` | 场景卡片、手机、打字机、气泡等组件 |
| `c4_s1.js` `c5_s2.js` `c6_s3.js` | ④ 三种拉法：宿舍·室友 / 会议室 / 老友群 |
| `c7_why.js` | ⑤ 为什么偏偏是身边人（比较 / 成本 / 警报） |
| `c8_break.js` | ⑥ 断肢破局 + 三招（先做后说 / 好消息测试 / 换个圈） |
| `c8b_end.js` | ⑦ 伸手：竹篓边的救援、剪影握手、宿舍分享资料、结尾提问 |
| `c9b_dispatch.js` `c9_master.js` | 时间线调度 + 后期（抖动、闪白、色散、辉光、暗角、颗粒） |
| `build.sh` | 按顺序拼接成 `crab.html` 并做语法检查 |
| `render.cjs` | Playwright 逐帧渲染：`node render.cjs 起始帧 结束帧 out.mp4` |
| `stills.sh` | 按节拍抽帧 + 拼接联系表：`./stills.sh 目录 "节拍1,节拍2"` |
| `sfx_lib.py` | 音效合成库（whoosh / boom / slam / crack / ding …） |
| `sfx_opening_cues.py` | 开场段音效时间表 |
| `sfx_full.py` | 全片音乐塑形 + 音效对拍 + 混响 + 响度标准化（−14 LUFS） |
| `sfx_open.py` | 早期开场单独版（参考用） |
| `make_all.sh` | 一键出片 |
| `bgm.mp3` | 背景音乐 |

## 时间轴
全片以音乐节拍为网格：`Q(k) = 0.145 + 0.713·k` 秒（第 k 拍）。所有动画与音效都用 `Q()` 定位，所以画面和声音天然对齐。

## 运行
需要 Node 18+、Playwright + Chromium、ffmpeg、Python3 + numpy。
```bash
./make_all.sh          # 生成 没有盖子的竹篓.mp4
```
单独预览某一时刻：浏览器打开 `crab.html`，控制台执行 `renderAt(秒数)`。

> `render.cjs` 顶部的 playwright 路径和 chromium 路径是按制作环境写的，换机器时改成本机路径即可。
