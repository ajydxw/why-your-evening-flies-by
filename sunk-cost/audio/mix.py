"""混音：背景音乐 + 卡点音效 + 跟随心率的心跳。
用法：python3 audio/mix.py full    （全片，输出 audio/out/raw_full.wav，再用 master.sh full 标准化）
      python3 audio/mix.py part1   （只混前 23 秒）"""
import sys, json, pathlib, subprocess, numpy as np, wave
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import sfx_lib as S
root = pathlib.Path(__file__).resolve().parents[1]
tl = json.loads((root / 'src/data/timeline.json').read_text())
hb = json.loads((root / 'src/data/heartbeats.json').read_text())['beats']
SR = S.SR
def b(n): return tl['beatOffset'] + tl['beatSec'] * n
def db(x): return 10 ** (x / 20)

part = sys.argv[1] if len(sys.argv) > 1 else 'part1'
END = tl['part1EndSec'] if part == 'part1' else tl['durationSec']

# ---------- 音效清单（时间点全部落在拍点上） ----------
P = S.coin
cues = []
def cue(t, x, gain_db=-12, pan=0.0):
    cues.append((t, x, gain_db, pan))

# 第1小节：丝滑神仙局
cue(0.0, S.whoosh(.5, 800, 6000, .3), -18, 0)
cue(0.0, S.typing(2.9, 12), -21, .25)
for i, f in enumerate([987.8, 1244.5, 1480.0, 1975.5]):      # B 大调琶音，正好和音乐调性一致
    cue(b(i), S.coin(f), -13 + i, .35)
    cue(b(i), S.sparkle(.6, 10), -22, .5)
cue(b(1.5), S.pop(500, 1300), -16, -.4)                      # 气泡“再赢一把就睡”
# 第2小节：临门一脚翻车
cue(b(4), S.bell(415.3), -11, -.1)                           # 23:00 钟声
cue(b(4), S.glitch_down(), -12, .3)                          # 失败降调
cue(b(4), S.glass(.7, 25), -17, .35)                         # 金星碎裂
cue(b(4), S.thump(110, 40, .3), -10, 0)
cue(b(5), S.notify(), -13, -.45)                             # 睡觉提醒弹窗
cue(b(5) - .05, S.whoosh(.35, 600, 5000, .8), -20, -.4)
cue(b(6), S.servo(), -18, .1)                                # 红色按钮升起
cue(b(6), S.pop(300, 700, .1), -16, .1)
cue(b(7), S.thump(90, 40, .25), -12, 0)
# 第3小节：红温上头死磕
cue(b(8), S.glass(1.0, 55), -9, -.45)                        # 一巴掌拍碎睡觉按钮
cue(b(8) - .08, S.whoosh(.2, 1200, 7000, .9), -16, -.3)
cue(b(8.5), S.sizzle(1.6), -20, 0)                           # 红温冒烟
cue(b(9), S.stamp(), -11, -.2)                               # 吐槽大字砸下
for k in range(6):
    cue(b(9 + k * .5), S.arcade_hit(), -10 if k % 2 == 0 else -13, .1)
cue(b(9), S.typing(2.0, 22), -17, .1)
# 第4小节：雪崩到天亮
cue(b(12), S.clock_rush(2.1), -15, -.3)
cue(b(12), S.siren(2.85), -22, .2)
for k, n in enumerate([12, 13]):
    cue(b(n), S.glitch_down(.4, 660, 120), -13, .3)
cue(b(14), S.stamp(), -9, 0)                                 # “说好的一把呢？”
cue(b(14), S.glitch_down(.5, 520, 80), -12, .3)
cue(b(15), S.glass(.8, 30), -14, 0)                          # 地板裂开
cue(b(15), S.thump(70, 30, .4), -9, 0)
cue(b(15), S.wind_fall(b(16) - b(15)), -14, 0)
# 第5小节：深渊巨响 → 定格
cue(b(16), S.boom(2.6, 70, 26), -5, 0)
cue(b(16), S.suction(.7), -17, 0)
cue(b(17), S.pop(700, 1400, .1), -18, 0)
cue(b(18), S.pop(700, 1400, .1), -18, 0)
cue(b(19), S.lightning(), -9, -.2)
cue(b(19), S.riser(b(20) - b(19)), -12, 0)
cue(b(19) + .05, S.suction(b(20) - b(19) - .05), -16, 0)
# 第6小节：标题砸屏
cue(b(20), S.metal_slam(), -5, 0)
cue(b(21), S.holo_sweep(.6), -18, .2)
# 第7小节：文字碎成图标 → 排队 → 弯成曲线
cue(b(24), S.glass(.6, 30), -15, 0)
cue(b(24), S.sparkle(.8, 20), -18, 0)
for k in range(6):
    cue(b(25) + k * .06, S.tick(2400 + k * 180), -17, -.5 + k * .2)
cue(b(26), S.gear(), -11, -.1)
cue(b(27), S.gear(), -11, .1)
cue(b(26), S.holo_sweep(.9), -19, 0)
# 第8小节：三枚印章 + “你在这”
for n, pan in [(28, -.4), (29, 0), (30, .4)]:
    cue(b(n), S.stamp(), -8, pan)
cue(b(31) - .25, S.whoosh(.3, 3000, 400, .85), -16, .2)
cue(b(31), S.thump(150, 60, .2), -11, .2)
cue(b(31), S.pop(900, 1500, .1), -16, .2)

# ================= 第 3–7 段（全片版本才会用到；超出 END 的音效会被自动丢弃） =================
FR = 1 / 30
Bmaj = [246.9, 311.1, 370.0, 493.9]                      # B 大调，与配乐同调
def hub_go(prev_out, beat):
    """回到曲线 → 光标滑动 → 口头禅大标签砸下 → 镜头钻进节点 → 圆形展开"""
    cue(b(prev_out), S.suction(.45), -17, 0)
    cue(b(prev_out) + 4 * FR, S.holo_sweep(b(beat) - b(prev_out) - 5 * FR), -19, -.2)
    cue(b(beat) - FR, S.tick(2600), -16, .2)
    cue(b(beat), S.stamp(), -8, 0)
    cue(b(beat), S.thump(130, 50, .22), -12, 0)
    cue(b(beat + .35), S.suction(.5), -16, 0)
    cue(b(beat + 1) - .12, S.whoosh(.35, 600, 6000, .7), -15, 0)

# 痛点 01 · 买都买了（外卖）
cue(b(32.35), S.suction(.55), -16, 0)
cue(b(33) - .12, S.whoosh(.35, 600, 6000, .7), -15, 0)
cue(b(33) + 4 * FR, S.tick(2200), -17, -.5)
cue(b(33.5), S.coin(1480.0), -16, .3)                    # ¥68 订单
cue(b(34), S.click(.02, 1500), -14, .2)                  # 勺子
cue(b(35), S.gulp(), -10, .1)
cue(b(35.5), S.glitch_down(.5, 500, 150), -17, .1)       # 脸发青
cue(b(36), S.growl(.9), -11, -.2)                         # 胃部报警
for k in range(3): cue(b(36) + k * .16, S.beep(880, .08), -20, -.3)
cue(b(36.5), S.holo_sweep(.5), -19, -.6); cue(b(36.5), S.pop(500, 1200), -17, -.6)
cue(b(37), S.whoosh(.22, 800, 4000, .5), -20, 0); cue(b(37.5), S.whoosh(.22, 800, 4000, .5), -21, 0)
cue(b(38), S.stamp(), -12, -.2); cue(b(38), S.pop(500, 1300), -15, -.2)
cue(b(39.5), S.sparkle(.5, 6), -25, .1)
for n in [40, 41, 42, 43]:
    cue(b(n), S.gulp(), -11, .1); cue(b(n), S.thump(120, 50, .15), -14, 0)
    cue(b(n) + 3 * FR, S.retch(.5), -13 if n < 43 else -11, .15)
cue(b(44), S.wail(b(45.5) - b(44)), -14, .3)              # 救护车
cue(b(44), S.buzzer(.35, 130), -14, .4); cue(b(44) + .1, S.glitch_down(.45, 700, 120), -16, .4)   # 急诊账单 -300
cue(b(45), S.stamp(), -7, 0); cue(b(45), S.boom(1.0, 90, 40, .6), -13, 0)
hub_go(47, 48)

# 痛点 02 · 来都来了（排队 → 电影院）
cue(b(49), S.cold_wind(b(56) - b(49) + .3), -21, -.2)
cue(b(49) + 4 * FR, S.tick(2200), -17, -.5)
cue(b(49.5), S.typing(.35, 28), -18, -.2); cue(b(49.5) + .35, S.beep(2000, .07), -20, -.2)   # 小票 188 号
cue(b(50), S.chain(3), -9, 0); cue(b(50), S.thump(140, 60, .15), -14, 0)
cue(b(51), S.notify(), -16, -.6)                          # 免排队·马上吃 霓虹亮起
cue(b(52), S.whoosh(.25, 600, 4000, .5), -18, -.3); cue(b(53) - .1, S.whoosh(.25, 600, 4000, .5), -18, .3)
cue(b(53), S.stamp(), -12, 0); cue(b(53), S.pop(500, 1300), -15, 0)
cue(b(54), S.cold_wind(2.0), -18, .3)
cue(b(54.5), S.chime(1318.5, .6, .5), -15, .4); cue(b(54.5) + .28, S.chime(1046.5, .9, .5), -15, .4)  # 叫号“叮咚”
cue(b(56), S.whoosh(.4, 400, 7000, .7), -12, 0); cue(b(56), S.glitch_down(.4, 900, 200), -17, 0)
cue(b(56), S.projector(b(62) - b(56)), -23, .2)
cue(b(56) + .3, S.typing(1.6, 16), -21, .4)               # 弹幕
cue(b(57), S.stamp(), -12, -.3); cue(b(57), S.pop(500, 1300), -15, -.3)
cue(b(57), S.footsteps(2.2, .42), -22, .5)                # 有人离场
for k in range(5): cue(b(59 + k * .5), S.tick(3000 - k * 150), -16, .1)
cue(b(61), S.stamp(), -8, 0); cue(b(61), S.glitch_down(.6, 520, 80), -12, 0)   # 剧终：更烂了
cue(b(62), S.stamp(), -7, 0); cue(b(62), S.thump(110, 45, .25), -10, 0)
hub_go(63, 64)

# 痛点 03 · 学都学了（撞墙死胡同）
cue(b(65), S.footsteps(.75, .26), -17, .1)
cue(b(65) + 4 * FR, S.tick(2200), -17, -.5)
for j, n in enumerate([66, 67, 68, 69, 71, 73, 75, 77]):
    cue(b(n), S.knock(1.0), -7 - (j % 2) * 2, .25); cue(b(n) + .02, S.paper(.6), -18, .3)
cue(b(67) + .05, S.pop(500, 1300), -16, -.2)
cue(b(70.6), S.stamp(), -13, -.2); cue(b(70.6), S.pop(450, 1200), -16, -.2)
cue(b(73), S.whoosh(.6, 300, 3000, .5), -18, -.4)
cue(b(73.5), S.pad(Bmaj[1:] + [622.3], 1.6, .2), -22, -.6); cue(b(73.5), S.holo_sweep(.5), -19, -.6)   # 阳光出口
cue(b(74), S.thump(80, 40, .3), -12, -.4); cue(b(74), S.paper(.5), -17, -.4); cue(b(74), S.buzzer(.3, 120), -18, -.4)
cue(b(75.2), S.stamp(), -11, 0); cue(b(75.2), S.holo_sweep(.6), -18, 0)
cue(b(76.5), S.whoosh(.5, 300, 3000, .5), -19, .3)
hub_go(79, 80)

# 痛点 04 · 爱都爱了（拉破车往悬崖倒溜）
for n in range(81, 94):
    cue(b(n) + .05, S.creak(.6), -19 + min(6, (n - 81) * .6), .2)
for j, n in enumerate([81.6, 82.2, 82.8]): cue(b(n), S.pop(400 + j * 120, 1000 + j * 200), -15, -.2 + j * .2)
for n, big in [(83, 0), (85, 0), (87, 1), (89, 0), (91, 1), (92.5, 0)]:
    cue(b(n), S.thump(90, 40, .3), -8 if big else -10, .1); cue(b(n), S.chain(1), -18, .2)
    if big: cue(b(n), S.boom(1.2, 80, 30, .8), -11, 0)
cue(b(84), S.stamp(), -12, -.2); cue(b(84), S.pop(450, 1100), -15, -.2)
cue(b(87), S.siren(b(90) - b(87)), -21, .3)              # 红色警报
cue(b(87), S.creak(b(89) - b(87)), -12, 0)                # 纤绳快要绷断
cue(b(89), S.clatter(5), -10, .3); cue(b(89) + .25, S.wind_fall(.6), -18, .3)   # 轮子掉下悬崖
cue(b(90), S.metal_slam(), -7, 0)                         # 全屏总结
cue(b(91.5), S.ember(b(93) - b(91.5) + .3), -12, 0); cue(b(91.5), S.sizzle(1.2), -19, 0)
# 收尾：跌穿谷底 → 灵魂拷问 → 钻进眉心
cue(b(94), S.suction(.45), -16, 0)
cue(b(94.3), S.stamp(), -10, 0); cue(b(94.3), S.glitch_down(.5, 600, 120), -14, 0)
cue(b(94.55), S.wind_fall(b(95.1) - b(94.55)), -15, .2)
cue(b(95.1), S.glass(.8, 40), -10, .2); cue(b(95.1), S.boom(1.2, 80, 30), -11, 0)
cue(b(95.3), S.riser(b(96) - b(95.3)), -12, 0); cue(b(95.3), S.suction(b(96) - b(95.3)), -16, 0)

# 机制 01 · 杏仁核劫持 + 损失厌恶
cue(b(96), S.zap(.5), -12, 0); cue(b(96), S.holo_sweep(1.0), -15, 0)
cue(b(96) + .1, S.typing(1.2, 20), -21, -.2)               # 大脑线框绘制
cue(b(96.5), S.stamp(), -12, -.4)
for k in range(5): cue(b(98) + k * .6, S.beep(1200, .1), -19, .3)   # 杏仁核报警
for n in [99, 99.5, 100]: cue(b(n), S.zap(.45), -11 if n < 100 else -9, .1)
cue(b(100), S.glitch_down(.6, 600, 90), -10, 0); cue(b(100), S.thump(110, 40, .25), -10, 0); cue(b(100), S.buzzer(.4, 110), -15, 0)
cue(b(101.5), S.whoosh(.35, 500, 4000, .6), -17, .3)
cue(b(101.5), S.creak(.6), -16, .3); cue(b(102.2), S.thump(100, 45, .25), -11, .2)   # 天平压向“失去”
cue(b(103), S.pop(600, 1400), -15, .3); cue(b(103.4), S.stamp(), -13, .3)
cue(b(105), S.servo(.4), -16, -.2); cue(b(105.3), S.stamp(), -10, 0)
# 机制 02 · 工作记忆被旧账占满
cue(b(108) - .1, S.whoosh(.35, 600, 6000, .7), -15, 0)
cue(b(108), S.buzzer(.45, 100), -12, 0)
for k in range(3): cue(b(108) + .5 + k * .12, S.beep(1760, .07), -19, 0)
for d in [108.5, 109, 109.5, 110]:
    cue(b(d), S.thump(110, 40, .25), -8, 0); cue(b(d), S.clatter(2), -16, .2)
cue(b(108.5), S.fan(b(115) - b(108.5)), -17, -.2)          # 风扇狂转
for n in [111, 112, 113]:
    cue(b(n) - 10 * FR, S.whoosh(.33, 800, 5000, .9), -18, -.4)
    cue(b(n), S.buzzer(.3, 150), -11, .2); cue(b(n), S.zap(.3), -18, .2)   # 拒绝访问
cue(b(115), S.stamp(), -10, 0); cue(b(115), S.holo_sweep(.6), -18, 0)
# 机制 03 · 简单任务 vs 精细任务
cue(b(118) - .1, S.whoosh(.4, 500, 6000, .7), -14, 0)
cue(b(118), S.stamp(), -9, 0); cue(b(118), S.thump(130, 50, .22), -12, 0)
for n in [119, 120, 121]: cue(b(n), S.pop(600, 1300), -15, .4); cue(b(n), S.tick(2600), -18, .4)
cue(b(119), S.riser(b(123) - b(119)), -19, .4)
cue(b(123), S.beep(1975.5, .12), -17, .4)
cue(b(124), S.metal_slam(), -8, 0)                         # 核心洞见：不敢承认“我当初选错了”

# 方法 01 · 今日清零（画面转为通透青蓝）
cue(b(128), S.pad(Bmaj, 3.2, .4), -15, 0); cue(b(128), S.sparkle(1.0, 24), -19, 0); cue(b(128), S.holo_sweep(.8), -18, 0)
for k, t0 in enumerate([128, 136, 144, 152]): cue(b(t0), S.breeze(6.0), -25, -.3 + k * .2)
cue(b(128.6), S.stamp(), -12, -.3); cue(b(128.6), S.chime(987.8, 1.2, .6), -17, -.3)
cue(b(130), S.servo(.4), -17, .1); cue(b(130), S.pop(400, 900), -16, .1)
cue(b(131), S.thump(160, 60, .15), -11, .1); cue(b(131), S.reset_sweep(1.2), -11, 0); cue(b(131), S.sparkle(1.5, 30), -18, 0)
cue(b(132), S.pad(Bmaj[1:], 2.0, .5), -21, 0)
cue(b(133), S.holo_sweep(.6), -16, .3); cue(b(133) + .15, S.typing(1.4, 18), -21, .3)
cue(b(135), S.chime(1244.5, .9, .6), -15, .3); cue(b(135.5), S.thump(120, 50, .2), -13, .3)
cue(b(136), S.stamp(), -8, .3)
# 方法 02 · 重写心理账本
cue(b(140) - .1, S.whoosh(.4, 500, 5000, .7), -15, 0)
cue(b(140) + 2 * FR, S.stamp(), -12, -.3); cue(b(140) + 2 * FR, S.chime(987.8, 1.2, .6), -17, -.3)
cue(b(141.3), S.holo_sweep(.4), -19, 0)
cue(b(141.5), S.scribble(b(142.2) - b(141.5)), -11, 0)     # 划掉
cue(b(142.4), S.scribble(b(143.6) - b(142.4)), -11, .1)    # 改写成“排雷情报费”
cue(b(144), S.chime(1480.0, 1.0, .7), -14, 0); cue(b(144), S.holo_sweep(.5), -18, 0)
cue(b(144.3), S.footsteps(b(145.3) - b(144.3), .3), -18, 0)
cue(b(145.3), S.arp([493.9, 622.3, 740.0, 987.8, 1244.5], .2, 1.2), -14, 0)   # 踏板升空
cue(b(146), S.stamp(), -12, -.3)
# 方法 03 · 熔断线
cue(b(150) - .1, S.whoosh(.4, 500, 5000, .7), -15, 0)
cue(b(150) + 2 * FR, S.stamp(), -12, .3)
cue(b(150.5), S.holo_sweep(1.0), -15, 0)                   # 画出金色熔断线
cue(b(151.5), S.pop(500, 1100), -15, -.3)
for k in range(1, 9): cue(b(151.5 + .5 * k), S.tick(3200), -19, -.3)   # 表盘走针（每半拍一下）
for n in [152, 153, 154]: cue(b(n), S.pop(500, 1200), -15, .3); cue(b(n), S.chime(1318.5 if n < 154 else 987.8, .6, .4), -19, .3)
cue(b(156), S.alarm_bell(1.2), -11, -.3); cue(b(156), S.shield(1.3), -10, 0); cue(b(156), S.thump(140, 55, .2), -11, 0)
cue(b(156.6), S.whoosh(.25, 600, 4000, .5), -18, 0)
cue(b(157), S.whoosh(.5, 400, 5000, .6), -14, .2); cue(b(157.7), S.thump(130, 60, .15), -13, .2)
cue(b(157.7), S.whoosh(b(159.3) - b(157.7), 300, 3000, .5), -18, 0)
cue(b(158.3), S.arp([1244.5, 987.8, 740.0], .14, 1.0), -15, .4)   # 心率回落↘

# 结尾 · 黎明站台，旧列车远去
cue(b(160), S.pad(Bmaj + [740.0], 5.0, 1.0), -14, 0)
cue(b(160) + .3, S.train_horn(1.6), -15, -.4); cue(b(160), S.chug(b(170) - b(160), 4.5, 1.2), -15, -.4)
for t0, pan in [(161, .5), (165.5, -.4), (171, .6), (176, -.5), (180, .4)]: cue(b(t0), S.chirp(3), -21, pan)
cue(b(162), S.sparkle(.8, 10), -23, 0)
cue(b(164), S.holo_sweep(.6), -17, 0); cue(b(164), S.chime(987.8, 1.8, .6), -15, 0)
cue(b(166), S.arp([987.8, 1244.5, 1480.0, 1975.5], .1, 1.2, .6), -18, .2); cue(b(166), S.sparkle(1.5, 26), -19, .2)
cue(b(168), S.holo_sweep(.6), -17, 0); cue(b(168), S.chime(1244.5, 1.8, .6), -15, 0)
cue(b(169), S.footsteps(b(181) - b(169), .5), -25, .1)
cue(b(172), S.pad(Bmaj, 6.0, 1.5), -19, 0)
cue(b(178), S.chime(1480.0, 2.0, .5), -18, 0)

# ---------- 心跳：时间点与画面心电图同一份数据 ----------
hrk = np.array(tl['hr'])
for t in hb:
    if t >= END: break
    hr = float(np.interp(t, hrk[:, 0], hrk[:, 1]))
    g = -19 + (hr - 75) / (170 - 75) * 8                      # 心率越高越响：-19 → -11 dB
    if 11.573 <= t < b(19): g += 4                           # 定格时只剩心跳，更突出
    cue(t, S.heartbeat(), g, 0)

# ---------- 合成 ----------
N = int(END * SR)
fx = np.zeros((N, 2))
for t, x, g, pan in cues:
    s = int(round(t * SR))
    if s >= N: continue
    x = x[:N - s] * db(g)
    L = np.cos((pan + 1) * np.pi / 4); R = np.sin((pan + 1) * np.pi / 4)
    fx[s:s + len(x), 0] += x * L * 1.414
    fx[s:s + len(x), 1] += x * R * 1.414

bgm_wav = root / 'audio/bgm.wav'
if not bgm_wav.exists():  # 工程包里只放了 mp3，首次运行时自动解码成 48kHz wav
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(root / 'audio/bgm.mp3'), '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', str(bgm_wav)], check=True)
with wave.open(str(bgm_wav)) as w:
    bg = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, 2) / 32768.0
bg = bg[:N]
if len(bg) < N: bg = np.vstack([bg, np.zeros((N - len(bg), 2))])
# 音效出现时给音乐让一点位置（轻度闪避）
env = np.abs(fx).max(1)
k = int(.08 * SR); env = np.convolve(env, np.ones(k) / k, 'same')
duck = 1 - np.clip(env * 1.2, 0, .3)
mix = bg * duck[:, None] * db(-1.5) + fx
if part == 'part1':  # 片段尾部 40ms 防爆音
    f = int(.04 * SR); mix[-f:] *= np.linspace(1, 0, f)[:, None]
else:  # 全片：128.8s 开始淡出，131.6s 起彻底静音（黑屏金句段）
    t = np.arange(N) / SR
    fade = np.clip((131.6 - t) / (131.6 - 128.8), 0, 1)
    mix *= (0.5 - 0.5 * np.cos(np.pi * fade))[:, None]
out = root / f'audio/out/raw_{part}.wav'
# 存成 32 位浮点，避免在标准化之前就削波
import subprocess
mix.astype('<f4').tofile(str(out) + '.f32')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2',
                '-i', str(out) + '.f32', '-c:a', 'pcm_f32le', str(out)], check=True)
pathlib.Path(str(out) + '.f32').unlink()
print('cues', len(cues), 'raw peak', np.abs(mix).max())
