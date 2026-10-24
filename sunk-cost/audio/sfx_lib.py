"""程序化合成音效（无外部素材）。全部返回单声道 float32 数组，采样率 SR。"""
import numpy as np
SR = 48000
rng = np.random.default_rng(7)

def T(d): return np.arange(int(d * SR)) / SR
def expenv(d, tau, attack=0.002):
    t = T(d); e = np.exp(-t / tau)
    a = int(attack * SR)
    if a > 0: e[:a] *= np.linspace(0, 1, a)
    return e
def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float64)

def fft_band(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))

def onepole_sweep(x, f_start, f_end):
    """随时间变化截止频率的一阶低通（用于呼啸/上升音）。"""
    n = len(x); fc = np.geomspace(f_start, f_end, n)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros(n); s = 0.0
    for i in range(n):
        s = (1 - a[i]) * x[i] + a[i] * s; y[i] = s
    return y

def sweep_sine(d, f0, f1, curve='exp'):
    t = T(d)
    f = np.geomspace(f0, f1, len(t)) if curve == 'exp' else np.linspace(f0, f1, len(t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

def norm(x, peak=1.0):
    m = np.max(np.abs(x)) + 1e-9
    return x / m * peak

# ---------- 具体音效 ----------
def chime(f, d=1.4, bright=1.0):
    t = T(d); y = np.zeros_like(t)
    for ratio, amp, tau in [(1, 1, .45), (2.0, .45 * bright, .25), (3.01, .22 * bright, .16), (4.17, .12 * bright, .1), (5.43, .06, .06)]:
        y += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t / tau)
    y *= np.minimum(1, t / .002)
    return norm(y)

def coin(f=1975.5):
    a = chime(f, .5, .8); b = chime(f * 1.335, .6, .8)
    y = np.zeros(int(.65 * SR)); y[:len(a)] += a * .6
    o = int(.06 * SR); y[o:o + len(b)] += b[:len(y) - o]
    return norm(y)

def sparkle(d=.6, n=14):
    y = np.zeros(int(d * SR))
    for _ in range(n):
        f = rng.uniform(3000, 8000); s = int(rng.uniform(0, d * .7) * SR)
        p = np.sin(2 * np.pi * f * T(.08)) * expenv(.08, .02)
        y[s:s + len(p)] += p[:len(y) - s] * rng.uniform(.2, .6)
    return norm(y)

def bell(f=415.3, d=2.6):
    t = T(d); y = np.zeros_like(t)
    for ratio, amp, tau in [(.5, .6, 1.4), (1, 1, 1.0), (1.19, .5, .7), (1.5, .35, .6), (2.0, .4, .5), (2.51, .2, .35), (3.0, .15, .25)]:
        y += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t / tau)
    y *= np.minimum(1, t / .003)
    return norm(y)

def boom(d=1.8, f0=95, f1=32, dirt=1.0):
    t = T(d)
    body = sweep_sine(d, f0, f1) * np.exp(-t / (d * .35))
    hit = fft_band(noise(d), hi=900) * np.exp(-t / .05)
    y = body + .5 * dirt * hit
    y = np.tanh(2.2 * y)
    return norm(y)

def glass(d=.9, density=40):
    y = fft_band(noise(d), lo=2500) * expenv(d, .09)
    for _ in range(density):
        f = rng.uniform(2500, 9500); s = int(rng.exponential(.12) * SR)
        if s >= len(y): continue
        L = int(rng.uniform(.03, .15) * SR)
        p = np.sin(2 * np.pi * f * np.arange(L) / SR) * np.exp(-np.arange(L) / (L * .25))
        y[s:s + L] += p[:len(y) - s] * rng.uniform(.3, .9)
    return norm(y)

def glitch_down(d=.55, f0=880, f1=98):
    t = T(d)
    ph = np.cumsum(np.geomspace(f0, f1, len(t))) / SR
    sq = np.sign(np.sin(2 * np.pi * ph)) * .6 + np.sin(2 * np.pi * ph * 1.5) * .3
    gate = (np.sin(2 * np.pi * 26 * t) > -.3).astype(float)
    y = sq * gate * np.exp(-t / (d * .6))
    y = np.round(y * 6) / 6  # bitcrush
    return norm(fft_band(y, hi=5000))

def notify():
    a = chime(1244.5, .35, .4); b = chime(1661.2, .6, .4)
    y = np.zeros(int(.75 * SR)); y[:len(a)] += a * .8
    o = int(.12 * SR); y[o:o + len(b)] += b[:len(y) - o]
    return norm(y)

def pop(f0=420, f1=1100, d=.12):
    t = T(d); y = sweep_sine(d, f0, f1) * np.exp(-t / .03)
    return norm(y)

def click(d=.012, lo=2000):
    return norm(fft_band(noise(d), lo=lo) * expenv(d, .003))

def typing(d=2.8, rate=11):
    y = np.zeros(int(d * SR)); t = 0
    while t < d - .02:
        c = click(.012, rng.uniform(1500, 3500)) * rng.uniform(.35, .8)
        s = int(t * SR); y[s:s + len(c)] += c[:len(y) - s]
        t += rng.uniform(.6, 1.4) / rate
    return y

def thump(f0=140, f1=55, d=.18):
    t = T(d); return norm(sweep_sine(d, f0, f1) * np.exp(-t / .045))

def arcade_hit():
    a = thump(160, 60, .16); c = fft_band(noise(.03), lo=1800, hi=5000) * expenv(.03, .008)
    y = np.zeros(len(a)); y += a; y[:len(c)] += c * .7
    return norm(y)

def servo(d=.45):
    t = T(d); f = np.linspace(180, 420, len(t))
    y = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .4 * (1 - t / d)
    return norm(fft_band(y, hi=2500))

def sizzle(d=1.2):
    t = T(d); n = fft_band(noise(d), lo=3500)
    crackle = (rng.random(len(t)) > .995) * rng.uniform(.5, 1, len(t))
    y = n * .4 + fft_band(crackle, lo=1500) * 3
    env = np.minimum(1, t / .05) * np.exp(-t / (d * .6))
    return norm(y * env)

def siren(d=2.4):
    t = T(d); f = np.where((t * 5) % 1 < .5, 740, 988)
    y = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .5
    y = fft_band(y, hi=2200) * np.minimum(1, t / .05) * np.minimum(1, (d - t) / .1)
    return norm(y)

def tick(f=3200):
    return norm(np.sin(2 * np.pi * f * T(.02)) * expenv(.02, .004) + .3 * click(.02))

def clock_rush(d=2.1):
    y = np.zeros(int(d * SR)); t, gap = 0, .2
    while t < d - .03:
        c = tick(rng.uniform(2600, 3600)); s = int(t * SR)
        y[s:s + len(c)] += c[:len(y) - s] * .7
        t += gap; gap = max(.025, gap * .86)
    return y

def whoosh(d=.6, f0=300, f1=4000, peak_at=.6):
    t = T(d); x = noise(d)
    y = onepole_sweep(x, f0, f1)
    env = np.where(t < d * peak_at, (t / (d * peak_at)) ** 2, np.exp(-(t - d * peak_at) / (d * .18)))
    return norm(fft_band(y * env, lo=120))

def riser(d=2.8):
    t = T(d); x = noise(d)
    n = onepole_sweep(x, 200, 9000)
    s = sweep_sine(d, 140, 1600) * .35 + sweep_sine(d, 70, 800) * .25
    env = (t / d) ** 2.2
    return norm((n * .8 + s) * env)

def suction(d=.9):
    t = T(d); x = noise(d)
    y = onepole_sweep(x, 6000, 150) * np.exp(-t / (d * .5))
    return norm(fft_band(y, lo=60))

def metal_slam():
    d = 2.4; t = T(d)
    y = boom(d, 110, 30) * 1.0
    for f, a, tau in [(178, .5, .9), (437, .45, .7), (811, .35, .5), (1290, .25, .35), (2010, .2, .25), (3100, .12, .15)]:
        y += a * np.sin(2 * np.pi * f * t) * np.exp(-t / tau)
    y += fft_band(noise(d), lo=800) * np.exp(-t / .04) * .8
    return norm(np.tanh(1.6 * y))

def stamp():
    a = thump(120, 50, .2); p = fft_band(noise(.08), lo=300, hi=2500) * expenv(.08, .02)
    y = np.zeros(len(a)); y += a; y[:len(p)] += p * .8
    return norm(np.tanh(1.5 * y))

def gear():
    y = np.zeros(int(.5 * SR))
    for i in range(7):
        c = tick(rng.uniform(1800, 2600)); s = int(i * .035 * SR); y[s:s + len(c)] += c * .6
    k = thump(220, 90, .25); s = int(.24 * SR); y[s:s + len(k)] += k[:len(y) - s]
    m = fft_band(noise(.25), lo=600, hi=3000) * expenv(.25, .05); y[s:s + len(m)] += m[:len(y) - s] * .5
    return norm(y)

def heartbeat(strength=1.0):
    d = .45; y = np.zeros(int(d * SR))
    l = thump(75, 42, .16) ; dd = thump(85, 50, .13) * .65
    y[:len(l)] += l; s = int(.14 * SR); y[s:s + len(dd)] += dd
    return norm(fft_band(y, hi=180)) * strength

def lightning():
    d = 1.6; t = T(d)
    crack = fft_band(noise(d), lo=1200) * np.exp(-t / .03)
    crackle = fft_band((rng.random(len(t)) > .99) * 1.0, lo=800) * np.exp(-t / .25) * 4
    rumble = fft_band(noise(d), hi=200) * np.exp(-t / .6) * 1.5
    return norm(crack + crackle + rumble)

def wind_fall(d=1.2):
    t = T(d); x = noise(d)
    y = fft_band(onepole_sweep(x, 400, 3000), lo=200) * (1 + .4 * np.sin(2 * np.pi * 3 * t))
    env = np.minimum(1, t / (d * .3))
    return norm(y * env)

def holo_sweep(d=.7):
    t = T(d); y = sweep_sine(d, 600, 2400) * .5 + sweep_sine(d, 900, 3600) * .3
    y *= np.sin(np.pi * t / d) ** 2
    return norm(y)

# ---------- 第 3–7 段新增音效 ----------
def bpf(x, lo, hi): return fft_band(x, lo=lo, hi=hi)

def chain(n=3):
    """锁链哗啦：几次不规则的金属碰撞。"""
    y = np.zeros(int(.7 * SR))
    for i in range(n):
        d = .35; t = T(d); h = np.zeros_like(t)
        for f in rng.uniform(1800, 6200, 5): h += np.sin(2 * np.pi * f * t) * np.exp(-t / rng.uniform(.03, .09))
        h += bpf(noise(d), 2000, 9000) * np.exp(-t / .01) * 2
        s = int((i * .09 + rng.uniform(0, .03)) * SR); y[s:s + len(h)] += h[:len(y) - s] * (1 - i * .2)
    return norm(y)

def buzzer(d=.38, f=110):
    """错误提示：低沉方波嗡。"""
    t = T(d); y = np.sign(np.sin(2 * np.pi * f * t)) * .5 + np.sign(np.sin(2 * np.pi * f * 1.5 * t)) * .3
    return norm(bpf(y, 80, 2400) * np.minimum(1, t / .005) * np.minimum(1, (d - t) / .03))

def beep(f=1760, d=.09):
    t = T(d); return norm(np.sign(np.sin(2 * np.pi * f * t)) * np.minimum(1, (d - t) / .01) * np.minimum(1, t / .002))

def zap(d=.5):
    """电击：噼啪 + 50Hz 电流嗡。"""
    t = T(d); crack = (rng.random(len(t)) > .985) * rng.standard_normal(len(t)) * 3
    hum = np.sign(np.sin(2 * np.pi * 100 * t)) * .4 + np.sin(2 * np.pi * 50 * t) * .4
    y = bpf(crack, 1500, 9000) * np.exp(-t / (d * .6)) + bpf(hum, 60, 3000) * np.exp(-t / (d * .4))
    y += bpf(noise(d), 3000, 12000) * np.exp(-t / .02) * 1.5
    return norm(y)

def fan(d=3.0, rise=True):
    """电脑风扇狂转：带通噪声 + 叶片调制，转速越来越快。"""
    t = T(d); r = np.linspace(18, 60, len(t)) if rise else np.full(len(t), 40)
    mod = .6 + .4 * np.sin(2 * np.pi * np.cumsum(r) / SR)
    y = bpf(noise(d), 300, 2600) * mod + sweep_sine(d, 120, 260 if rise else 120) * .15
    return norm(y * np.minimum(1, t / .4) * np.minimum(1, (d - t) / .3))

def scribble(d=1.0):
    """笔尖划写：沙沙的短促笔画。"""
    y = np.zeros(int(d * SR)); t = 0
    while t < d - .05:
        L = rng.uniform(.05, .14); s = bpf(noise(L), 2500, 8000) * np.sin(np.pi * T(L) / L) ** .7
        i = int(t * SR); y[i:i + len(s)] += s[:len(y) - i] * rng.uniform(.5, 1)
        t += L + rng.uniform(.01, .05)
    return norm(y)

def pad(freqs, d=2.4, attack=.5):
    """温暖和弦铺底（微失谐的正弦叠加）。"""
    t = T(d); y = np.zeros_like(t)
    for f in freqs:
        for det in (-1.5, 0, 1.5): y += np.sin(2 * np.pi * (f + det) * t) + .25 * np.sin(2 * np.pi * 2 * (f + det) * t)
    env = np.minimum(1, t / attack) * np.minimum(1, (d - t) / (d * .45))
    return norm(y * env)

def step():
    a = thump(110, 60, .09); c = bpf(noise(.03), 800, 4000) * expenv(.03, .008)
    y = np.zeros(len(a)); y += a * .7; y[:len(c)] += c * .5
    return norm(y)

def footsteps(d, gap=.36):
    y = np.zeros(int(d * SR)); t = 0; k = 0
    while t < d - .1:
        s = step() * (.8 if k % 2 else 1); i = int(t * SR); y[i:i + len(s)] += s[:len(y) - i]
        t += gap; k += 1
    return y

def breeze(d=6.0):
    t = T(d); y = bpf(noise(d), 200, 1800) * (.6 + .4 * np.sin(2 * np.pi * .23 * t) * np.sin(2 * np.pi * .41 * t + 1))
    return norm(y * np.minimum(1, t / 1.5) * np.minimum(1, (d - t) / 1.5))

def cold_wind(d=4.0):
    """寒风呼啸：共振峰缓慢游移的噪声。"""
    t = T(d); x = noise(d); y = np.zeros_like(x)
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR)
    for fc in (520, 780, 1150):
        y += np.fft.irfft(X * np.exp(-((fr - fc) / (fc * .12)) ** 2), len(x))
    y *= .6 + .4 * np.sin(2 * np.pi * .35 * t) ** 2
    return norm(y * np.minimum(1, t / .8) * np.minimum(1, (d - t) / .8))

def train_horn(d=1.6):
    t = T(d); y = np.zeros_like(t)
    for f in (311.1, 370.0, 466.2):
        ph = 2 * np.pi * f * t; y += sum(np.sin(k * ph) / k for k in range(1, 7))
    y = bpf(y, 150, 3000) * np.minimum(1, t / .08) * np.minimum(1, (d - t) / .35)
    return norm(y)

def chug(d=6.0, r0=4.5, r1=1.5):
    """火车哐哧：节奏越来越慢、越来越远。"""
    y = np.zeros(int(d * SR)); t = 0
    while t < d - .2:
        k = t / d; L = .16; s = bpf(noise(L), 150, 2500) * expenv(L, .035)
        th = thump(90, 50, .12); s[:len(th)] += th * .6
        i = int(t * SR); y[i:i + len(s)] += s[:len(y) - i] * (1 - .85 * k)
        t += 1 / (r0 + (r1 - r0) * k)
    return norm(y)

def gulp():
    t = T(.16); y = sweep_sine(.16, 420, 140) * np.exp(-t / .04)
    return norm(bpf(y, 80, 3000))

def retch(d=.55):
    """呕：粗糙下行的喉音。"""
    t = T(d); f = np.geomspace(260, 110, len(t)) * (1 + .06 * np.sin(2 * np.pi * 28 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR; y = sum(np.sin(k * ph) / k for k in range(1, 9))
    y = bpf(y + bpf(noise(d), 300, 2000) * .5, 120, 2600) * np.sin(np.pi * t / d) ** .5
    return norm(np.tanh(2 * y))

def wail(d=1.4):
    """救护车警笛（上滑下滑）。"""
    t = T(d); f = 650 + 350 * np.sin(2 * np.pi * t / .7 - np.pi / 2) ** 2
    y = bpf(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .5, 300, 3000)
    return norm(y * np.minimum(1, t / .05) * np.minimum(1, (d - t) / .15))

def growl(d=.9):
    """胃部咕噜报警。"""
    t = T(d); y = bpf(noise(d), 60, 400) * (.5 + .5 * np.sin(2 * np.pi * 9 * t)) + sweep_sine(d, 90, 60) * .4
    return norm(y * np.sin(np.pi * t / d))

def knock(big=1.0):
    """撞玻璃墙：闷响 + 玻璃共鸣。"""
    d = .5; t = T(d); y = thump(95, 45, .3)[:len(t)] if True else 0
    y = np.pad(y, (0, len(t) - len(y)))
    for f, a, tau in [(1180, .25, .2), (2350, .18, .14), (3720, .1, .08)]: y += a * big * np.sin(2 * np.pi * f * t) * np.exp(-t / tau)
    y += bpf(noise(d), 400, 3000) * np.exp(-t / .015) * .6
    return norm(np.tanh(1.4 * y))

def paper(d=.6):
    t = T(d); y = bpf(noise(d), 1200, 7000) * (.4 + .6 * (rng.random(len(t)) > .7)) * np.exp(-t / (d * .4))
    return norm(fft_band(y, hi=9000))

def creak(d=.8):
    """绳子/木头吱嘎：抖动的锯齿波。"""
    t = T(d); f = 70 + 25 * np.sin(2 * np.pi * 1.3 * t) + rng.standard_normal(len(t)).cumsum() * .02
    ph = 2 * np.pi * np.cumsum(f) / SR; y = (ph / (2 * np.pi)) % 1 - .5
    y = bpf(y * (.5 + .5 * (np.sin(2 * np.pi * 13 * t) > 0)), 200, 3500)
    return norm(y * np.sin(np.pi * t / d))

def clatter(n=5):
    y = np.zeros(int(1.0 * SR))
    for i in range(n):
        h = chain(1) * (1 - i / n); s = int((i * .13 + rng.uniform(0, .04)) * SR); y[s:s + len(h)] += h[:len(y) - s]
        k = thump(140, 60, .12) * .7 * (1 - i / n); y[s:s + len(k)] += k[:len(y) - s]
    return norm(y)

def alarm_bell(d=1.2):
    """闹钟铃：高速敲击两个铃。"""
    y = np.zeros(int(d * SR)); t = 0; k = 0
    while t < d - .05:
        c = chime(2637 if k % 2 else 2793, .12, .6) * .6; i = int(t * SR); y[i:i + len(c)] += c[:len(y) - i]
        t += 1 / 22; k += 1
    return norm(y * np.minimum(1, (d - T(d)) / .1))

def shield(d=1.3):
    t = T(d); y = np.zeros_like(t)
    for f in (493.9, 740.0, 987.8, 1244.5):
        fr = f * (1 + .12 * (1 - np.exp(-t / .08))); y += np.sin(2 * np.pi * np.cumsum(fr) / SR) * (1 + .3 * np.sin(2 * np.pi * 7 * t))
    y = y * np.minimum(1, t / .02) * np.exp(-t / (d * .45)) + bpf(noise(d), 2000, 9000) * np.exp(-t / .05) * .6
    return norm(y)

def arp(freqs, gap=.09, d=1.2, bright=.8):
    y = np.zeros(int((d + gap * len(freqs)) * SR))
    for i, f in enumerate(freqs):
        c = chime(f, d, bright); s = int(i * gap * SR); y[s:s + len(c)] += c * (.7 + .3 * i / len(freqs))
    return norm(y)

def chirp(n=3):
    """鸟叫：几声快速的上下滑音。"""
    y = np.zeros(int(.6 * SR))
    for i in range(n):
        d = rng.uniform(.05, .09); t = T(d); f0 = rng.uniform(3200, 4200)
        s = np.sin(2 * np.pi * np.cumsum(f0 * (1 + .35 * np.sin(np.pi * t / d))) / SR) * np.sin(np.pi * t / d)
        i0 = int(i * .11 * SR); y[i0:i0 + len(s)] += s
    return norm(y)

def projector(d=4.0):
    """放映机咔哒咔哒（24 格/秒）。"""
    y = np.zeros(int(d * SR)); t = 0
    while t < d - .02:
        c = click(.01, 1200) * rng.uniform(.4, .7); i = int(t * SR); y[i:i + len(c)] += c[:len(y) - i]
        t += 1 / 24
    return norm(y * np.minimum(1, T(d) / .3) * np.minimum(1, (d - T(d)) / .3))

def reset_sweep(d=.9):
    """一键清零：下行扫频 + 光点碎散。"""
    t = T(d); y = sweep_sine(d, 2400, 180) * np.exp(-t / (d * .5)) * .6 + sparkle(d, 18) * .5
    return norm(y)

def ember(d=1.6):
    """进度条燃烧：火焰噼啪。"""
    t = T(d); y = bpf(noise(d), 200, 2500) * .5 + bpf((rng.random(len(t)) > .995) * rng.standard_normal(len(t)) * 4, 1000, 8000)
    return norm(y * np.minimum(1, t / .2) * np.minimum(1, (d - t) / .3))
