# 《越想赢，越会输》· 代码动画工程

**由 Claude Opus 5.5 制作的视频源代码。**

本作品收录于 [Claude Opus 5.5 视频源代码合集](../README.md)。源代码及文档采用 [MIT License](../LICENSE)；附带的 Noto Sans SC 字体采用 [SIL OFL 1.1](OFL.txt)，背景音乐 `bgm.wav` 不包含在代码的 MIT 授权范围内。

全片 134.2 s，1920×1080，30 fps。画面用 Canvas 2D 代码逐帧绘制（Chromium + Playwright 渲染），音效用 Python/numpy 合成，配乐为 `bgm.wav`。

## 目录
| 文件 | 作用 |
|---|---|
| `head.html` / `tail.html` | 页面外壳 |
| `core.js` | 画布、缓动 `E`、通用绘图工具 |
| `yd_open.js` | 主渲染循环 `renderAt(t)`、开场（A 段 0–23 s）、全局后期（抖动/闪白/色散/泛光） |
| `title_part.js` | 片名段 |
| `case_a.js` | B 段「崩盘现场」4 个案例框架 + 心率曲线卡（`bpmB` / `PHASE`） |
| `case1.js`–`case4.js` | B 段 4 个案例 |
| `sec_c.js` | C 段（Q64–96）：连崩蒙太奇、压力-表现曲线、沙发摸鱼、截止前一晚；共享的曲线卡 `chartBox` / `cardState` / `AK` 心率锚点 |
| `sec_d.js` | D 段（Q96–128）：大脑（前额叶掉线/杏仁核警报）、工作记忆被占满、简单 vs 精细任务 |
| `sec_e.js` | E 段（Q128–160）：遮住记分牌、只盯下一步、延长呼气、换个说法 |
| `sec_f.js` | F 段（Q160–结尾）：考场刚刚好、曲线化作山脊、日出、黑场 |
| `sec_z.js` | C–F 调度、转场后期、片尾字卡 |
| `case_z.js` | 导出 |
| `build.sh` | 拼接以上文件 → `yd.html` 并做语法检查 |
| `render.cjs` | 渲染：静帧或 mp4 |
| `qs.py` / `sheetq.sh` / `sheet.sh` | 节拍→秒换算、拼接联系表 |
| `sfx_lib.py` | 音频基础合成器（噪声/滤波/包络/混音 `add`） |
| `sfx_yd.py` | 音频主脚本：开场段音乐塑形 + 音效，依次 exec `sfx_b.py`、`sfx_cf.py`，最后混响、母带到 −14 LUFS |
| `sfx_b.py` / `sfx_cf.py` | B 段 / C–F 段的音乐塑形（滤波、闪避）、心跳流、逐镜头音效 |

时间单位：节拍 `Q(k) = 0.145 + 0.713·k` 秒（BPM 84.15）。

## 运行环境
Node 18+（需要 `playwright`）、Chromium、Python 3（numpy）、ffmpeg。
`render.cjs` 第 1 行与第 5 行写死了本机的 playwright / chromium 路径，换机器时改成自己的。
画面字体为系统字体「Noto Sans SC」（Bold/Black），包里附了 `NotoSansSC-Bold.otf` / `NotoSansSC-Black.otf`（OFL 开源），装到系统字体即可；配乐 `bgm.wav` 已放在包里，保持同目录。

## 步骤
```bash
bash build.sh                                   # 生成 yd.html
# 静帧检查（逗号分隔秒数）
node render.cjs $(python3 qs.py 96 104 112) x /tmp/stills
# 渲染视频（帧号区间，可并行分段）
node render.cjs 0 2013 p1.mp4 & node render.cjs 2013 4026 p2.mp4 & wait
printf "file 'p1.mp4'\nfile 'p2.mp4'\n" > list.txt
# 音频（输出 yd_a.wav，已是 −14 LUFS）
python3 sfx_yd.py
# 合成
ffmpeg -f concat -safe 0 -i list.txt -i yd_a.wav -map 0:v -map 1:a -c:v libx264 -crf 19 -preset medium -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -movflags +faststart yd_final.mp4
```
