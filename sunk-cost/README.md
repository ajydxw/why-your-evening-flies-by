# 《沉没成本谬误》知识科普动画 · 工程说明

**由 Claude Opus 5.5 制作的视频源代码。**

本作品收录于 [Claude Opus 5.5 视频源代码合集](../README.md)。代码与文档采用 [MIT License](../LICENSE)；Noto Sans SC 字体采用 [SIL OFL 1.1](public/fonts/OFL.txt)，背景音乐及预混音轨不包含在代码的 MIT 授权范围内。

134.2 秒横版无旁白动画（1920×1080 · 30fps · 霓虹赛博风），用 Remotion（React）逐帧绘制，音效全部用 Python 程序化合成。
全片剧本 / 分镜见 `docs/剧本_全片修订版.md`。

## 全片结构

| 段落 | 时间 | 拍 | 场景文件 | 内容 |
|---|---|---|---|---|
| 一 吸睛开头 | 0 – 11.57s | 0–16 | `scenes/S1Hook.tsx` | 深夜“再赢一把就睡” → 红温死磕 → 连跪到天亮坠入深渊 |
| 二 亮出知识点 | 11.57 – 22.98s | 16–32 | `scenes/S2Concept.tsx` | 定格 → “沉没成本谬误”砸屏 → 倒 U 收益曲线 + 你在这 |
| 三/四 共鸣举例 | 22.98 – 68.61s | 32–96 | `scenes/S34Examples.tsx` + `scenes/ex/*` | 四个口头禅痛点：买都买了（外卖）/ 来都来了（排队+烂片）/ 学都学了（撞墙）/ 爱都爱了（拉破车），每个都有结算卡；最后“你在这”跌穿谷底 |
| 五 讲原理 | 68.61 – 91.43s | 96–128 | `scenes/S5Brain.tsx` | 杏仁核劫持 + 损失厌恶天平 / 工作记忆 RAM FULL / 简单任务 vs 精细任务 |
| 六 给方法 | 91.43 – 114.25s | 128–160 | `scenes/S6Method.tsx` | 今日清零 / 重写心理账本 / 事前熔断线 |
| 七 留白结尾 | 114.25 – 134.2s | 160– | `scenes/S7Ending.tsx` | 黎明站台，“来都来了”旧列车远去 → 128.8s 转黑 → 131.6s 起黑屏白字金句（静音） |

## 目录结构

```
sunk-cost/
├─ src/
│  ├─ index.ts / Root.tsx      入口；Full = 全片 134.2s，Part1 = 0–23s，CoverH / CoverV = 封面
│  ├─ Main.tsx                 全片时间线（所有场景使用全局帧号）
│  ├─ Cover.tsx                发布封面（横版 16:9、竖版 3:4）
│  ├─ lib.ts                   拍点换算 B(n)/BF(n)、配色、缓动、倒 U 曲线函数
│  ├─ data/timeline.json       分辨率、帧率、拍点、心率关键帧、“你在这”位置、跌穿谷底、小卡淡出时间
│  ├─ data/heartbeats.json     由心率积分得到的每次心跳时间（画面心电图与心跳声共用）
│  ├─ components/              小人 Character、右下角小卡 HUD、倒 U 总控台 Hub、通用 UI（气泡/印章/横幅）、图标、字体
│  └─ scenes/                  各段场景；ex/ 下是四个痛点小剧场和收尾转场 Bridge
├─ public/fonts/               Noto Sans SC Bold / Black（随工程打包）
├─ audio/
│  ├─ bgm.mp3                  背景音乐（首次混音时自动解码成 bgm.wav）
│  ├─ sfx_lib.py               程序化合成的全部音效（无外部素材）
│  ├─ mix.py                   卡点音效清单 + 跟随心率的心跳 + 混音 + 结尾淡出
│  ├─ master.sh                响度标准化：-14 LUFS，真峰值 ≤ -1 dBFS
│  └─ out/mix_full.wav         已混好的全片音轨
├─ tools/
│  ├─ render_chunks.mjs        分段渲染全片（已存在的分段自动跳过，改哪段删哪段重渲）
│  ├─ render.mjs               整段渲染某个 Composition
│  ├─ cover.mjs                导出两张封面
│  ├─ gen_heartbeats.py        改了心率后重新生成心跳时间表
│  ├─ stills.mjs / sheet.sh    渲染关键帧、拼预览总图
│  └─ webpack-override.mjs     兼容 TypeScript 7 的打包补丁
└─ docs/剧本_全片修订版.md
```

## 拍点

音乐开头有 0.165s 空白，第 n 拍 = 0.165 + 0.713 × n 秒，一小节 = 2.852s。
代码里统一用 `BF(n)` 取第 n 拍的帧号，音效清单用 `b(n)` 取秒数，两边始终对齐。
段落切换点：11.57 / 22.98 / 45.80 / 68.61 / 91.43 / 114.25s；128.8s 开始淡出，131.6s 起静音。

## 常用命令（需要 Node 18+、Python 3 + numpy、ffmpeg）

```bash
npm i remotion @remotion/cli @remotion/bundler @remotion/renderer @remotion/fonts react react-dom   # 首次
npx remotion studio src/index.ts                     # 实时预览

# 1. 音频
python3 tools/gen_heartbeats.py                      # 改过 timeline.json 的心率后执行
python3 audio/mix.py full && bash audio/master.sh full   # → audio/out/mix_full.wav

# 2. 画面（分段渲染到 out/chunks/，约 2–3 分钟一段）
node tools/render_chunks.mjs

# 3. 拼接 + 合入音轨
cd out && for f in chunks/*.mp4; do echo "file '$PWD/$f'"; done > concat.txt
ffmpeg -f concat -safe 0 -i concat.txt -i ../audio/out/mix_full.wav -map 0:v -map 1:a \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart -t 134.2 沉没成本谬误_完整版_134s.mp4

# 封面 / 关键帧预览
node tools/cover.mjs                                 # → out/封面_横版16x9.png、out/封面_竖版3x4.png
tools/sheet.sh 预览图名 700 1400 2100 2800           # 关键帧预览总图
```

## 修改指南

- 改文字：直接在 `src/scenes/` 里搜索对应中文。
- 改时间：所有动作都写成 `BF(拍号)`，把拍号改掉即可；对应音效在 `audio/mix.py` 里用同样的拍号。
- 改心率：编辑 `src/data/timeline.json` 的 `hr`，然后运行 `gen_heartbeats.py` 并重新混音。
- 音效偏大/偏小：调整 `audio/mix.py` 里每个 `cue(...)` 的第三个参数（dB），改完重新跑 mix + master。
- 只改了某一段画面：删掉 `out/chunks/` 里对应帧范围的分段，再跑 `render_chunks.mjs`。
- 封面背景帧：`src/Cover.tsx` 的 `COVER_FRAME` 和 `tools/cover.mjs` 的 `FRAME`（默认第 256 帧 ≈ 8.5s 激光眼）。

## 发布物料

- 封面：横版 16:9、竖版 3:4，背景取第 8.5s 红温小人“激光眼”盯着段位星星的画面。
  大字标题「为什么你总被“来都来了”毁掉？」，黄色副标题「134秒戒掉中国式内耗：沉没成本谬误」。
- 抖音文案：

  > 外卖难吃硬塞、烂片熬到最后、关系拖到透支……你不是舍不得，只是不敢承认“当初选错了”。
  > 134 秒看懂沉没成本谬误，附 3 个马上能用的止损开关，从此不再被“来都来了”绑架！
  > #沉没成本谬误 #心理学科普 #认知觉醒 #戒掉内耗 #人间清醒

## 说明

- AI 听不到声音，混音只按测量数据校准（响度、峰值），音量平衡请以人耳试听为准。
