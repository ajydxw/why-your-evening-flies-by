import numpy as np, wave, subprocess, re
SR = 48000; rng = np.random.default_rng(11)
def bt(k): return 0.145 + 0.713 * k
DUR = 134.19
def rd(p):
    w = wave.open(p); n = w.getnframes(); ch = w.getnchannels()
    a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float64) / 32768.0; return a.reshape(-1, ch).T.copy()
N = int(DUR * SR)
music = rd('/data/night/bgm.wav')[:, :N]
N = music.shape[1]
sfx = np.zeros((2, N)); verb = np.zeros((2, N))
def T(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))
def lp1(x, fc):
    fc = np.broadcast_to(np.asarray(fc, float), x.shape); a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y
def dec(d, tau, att=.002): t = T(d); return np.minimum(1, t / att) * np.exp(-t / tau)
def sine(f, d, ph=0):
    t = T(d); f = np.broadcast_to(np.asarray(f, float), t.shape); return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)
def env(d, pts):  # pts: [(t,v),...] normalized time 0..1
    t = T(d) / d; return np.interp(t, [p[0] for p in pts], [p[1] for p in pts])
def fit(x, n): n = int(n); return np.pad(x, (0, max(0, n - len(x))))[:n]
def add(sig, t, g, pan=0.0, wet=0.0):
    sig = np.asarray(sig, float); sig = sig / max(1e-9, np.max(np.abs(sig))) * 10 ** (g / 20)
    p = np.clip(pan, -1, 1); L = np.cos((p + 1) * np.pi / 4) * np.sqrt(2); R = np.sin((p + 1) * np.pi / 4) * np.sqrt(2)
    i = int(round(t * SR)); j = max(0, -i); i = max(0, i); n = min(len(sig) - j, N - i)
    if n <= 0: return
    for c, k in ((0, L), (1, R)):
        sfx[c, i:i + n] += sig[j:j + n] * k * (1 - wet * .3); verb[c, i:i + n] += sig[j:j + n] * k * wet
# ---------- synths ----------
def tock(f=1.0):  # heavy clock tock
    d = .5; return (band(noise(d), 700, 3500) * dec(d, .012) * .8 + sine(np.linspace(820, 700, int(d*SR)) * f, d) * dec(d, .03) * .6 + sine(160 * f, d) * dec(d, .09) * .9)
def tick(): d = .04; return band(noise(d), 2500, 8000) * dec(d, .004) + .3 * sine(3200, d) * dec(d, .006)
def whoosh(L=.6, lo=300, hi=4500, peak=.75):
    e = env(L, [(0, 0), (peak, 1), (1, 0)]) ** 1.8; return lp1(band(noise(L), 150, None), lo + (hi - lo) * e) * e
def shing(): d = 1.2; x = sum(sine(f, d) * dec(d, .35 / (1 + k * .4)) for k, f in enumerate([2960, 4410, 5870, 7330])) * .25; return x + band(noise(d), 4000, 11000) * dec(d, .12) * .5
def ping(): d = .9; return sine(2600, d) * dec(d, .25) + .5 * sine(3950, d) * dec(d, .14) + .3 * sine(np.linspace(900, 1300, int(d*SR)), d) * dec(d, .06)
def crack(): d = .5; x = band(noise(d), 1200, 7000) * dec(d, .03); x[int(.03*SR):] += band(noise(d - .03), 2000, 9000) * dec(d - .03, .02) * .7; x[int(.07*SR):] += band(noise(d - .07), 900, 5000) * dec(d - .07, .04) * .5; return x
def boom(f0=70, f1=32, d=1.4, tau=.45): return sine(np.linspace(f0, f1, int(d*SR)), d) * dec(d, tau, .004) + .35 * band(noise(d), 30, 260) * dec(d, .12)
def shatter(d=1.6, n=70, spread=.9):
    x = band(noise(d), 1800, 10000) * dec(d, .09) * 1.2 + band(noise(d), 500, 3000) * dec(d, .05) * .6
    for _ in range(n):
        t0 = (rng.random() ** 2) * spread; f = 2200 + rng.random() * 6000; L = .25; s = sine(f, L) * dec(L, .03 + .05 * rng.random()) * (.25 + .5 * rng.random()) * (1 - t0 / spread * .7)
        i = int(t0 * SR); x[i:i + len(s)] += s[:max(0, len(x) - i)]
    return x
def tinkle(d=1.2, n=26):
    x = np.zeros(int(d * SR))
    for _ in range(n):
        t0 = rng.random() * (d - .2); f = 3000 + rng.random() * 5000; s = sine(f, .2) * dec(.2, .03) * (.3 + .7 * rng.random()); i = int(t0 * SR); x[i:i + len(s)] += s
    return x
def click(): d = .12; return band(noise(d), 1500, 7000) * dec(d, .006) + .7 * sine(1200, d) * dec(d, .012) + .8 * sine(180, d) * dec(d, .03)
def riser(d=1.0): e = env(d, [(0, 0), (.85, 1), (1, .7)]) ** 2; return lp1(noise(d), 300 + 7000 * e) * e * .8 + sine(np.linspace(90, 520, int(d*SR)), d) * e * .4
def suck(d=.5): e = env(d, [(0, 0), (.9, 1), (1, 0)]) ** 3; return lp1(noise(d), 6000 - 5000 * env(d, [(0, 0), (1, 1)])) * e
def pop(): d = .12; return sine(np.linspace(480, 1300, int(d*SR)), d) * env(d, [(0, 0), (.05, 1), (.5, .4), (1, 0)])
def drone(d=1.6): t = T(d); x = sum(np.sin(2 * np.pi * f * t + k) / (k + 1) for k, f in enumerate([55, 110.4, 165.2, 220.6, 331])); return band(x, 30, 900) * dec(d, .6, .01) * (1 + .3 * np.sin(2 * np.pi * 7 * t))
def slam(): d = 1.0; return boom(90, 40, d, .28) + .6 * band(noise(d), 200, 2500) * dec(d, .03)
def rewind(d=.72): t = T(d); f = 1400 + 900 * np.sin(2 * np.pi * 9 * t) + 1800 * t / d; return (sine(f, d) * .35 + band(noise(d), 1500, 6000) * .5 * (.6 + .4 * np.sin(2 * np.pi * 23 * t))) * env(d, [(0, 0), (.08, 1), (.85, 1), (1, 0)])
def tapestop(d=.35): return sine(np.linspace(900, 60, int(d*SR)), d) * env(d, [(0, 1), (1, 0)]) * .6 + band(noise(d), 200, 1500) * dec(d, .08) * .3
def swipe(): return whoosh(.22, 800, 7000, .5)
def tap(): d = .06; return band(noise(d), 1200, 4500) * dec(d, .008) + .4 * sine(900, d) * dec(d, .01)
def thunk(): d = .3; return sine(np.linspace(220, 120, int(d*SR)), d) * dec(d, .05) + .4 * band(noise(d), 300, 2000) * dec(d, .015)
def blip(f=1500): d = .15; return sine(f, d) * dec(d, .05) + .3 * sine(f * 2, d) * dec(d, .02)
# ---------- cues ----------
for k in range(4): add(tock(1.0 - .03 * k), bt(k), -9 + k * .5, -.35, .5)            # sticky office clock
add(thunk(), 1.0, -20, -.5, .2); add(thunk(), 1.62, -16, -.5, .3)                      # line1 lands
add(whoosh(.5, 300, 6000, .8), bt(4) - .38, -12, .4); add(shing(), bt(4), -14, .35, .5)   # amber slash
r = bt(4) + .2
while r < bt(6) - .02:                                                                   # spinning clock / rolling digits
    q = (r - bt(4)) / (bt(6) - bt(4)); add(tick(), r, -22 + 4 * q, .45 + .1 * np.sin(r * 9)); r += .085 - .045 * q
add(whoosh(.25, 900, 7000, .7), bt(4) + .1, -20, .6); add(whoosh(.25, 900, 7000, .7), bt(4) + .28, -19, .6)  # line2 zips
add(ping(), bt(6), -14, .35, .6); add(whoosh(.72, 300, 5000, .95), bt(6) + .02, -13, .2)                     # hand detaches & flies
add(crack(), bt(7), -9, 0, .5); add(boom(75, 34, 1.2, .35), bt(7), -8, 0, .3)                                  # glass cracks
add(tinkle(.6, 10), bt(7) + .1, -24, 0, .6)
add(shatter(), bt(8), -9, 0, .7); add(boom(60, 30, 1.5, .5), bt(8), -9, 0, .2); add(tinkle(1.0, 30), bt(8) + .3, -22, 0, .8)  # shatter
add(whoosh(.55, 300, 6000, .97), bt(9) - .54, -14, -.1); add(click(), bt(9), -11, 0, .5)                       # line A assembles + 咔
add(slam(), bt(10), -7, 0, .4); add(boom(48, 26, 1.8, .7), bt(10), -10, 0, .1)                                  # line B slam
c, n = bt(10) + .175, 0                                                                 # brain stopwatch slows & stops
while c < bt(13) - .5: add(tock(1.35), c, -15 - n * 1.6, 0, .5); c += .178 * (1 + n * .13); n += 1
add(riser(1.1), bt(13) - .45, -10, 0, .4); add(suck(.7), bt(13) + .05, -14, 0, .2)                              # fly-through + vortex
add(whoosh(.5, 400, 8000, .05), bt(14), -12, 0, .5); add(blip(1800), bt(14), -20, 0, .6)                         # reveal
add(swipe(), bt(16) + .08, -14, .3); add(tap(), bt(16) + .1, -18, .3)                                             # swipe
add(whoosh(.32, 500, 7000, .5), bt(16) + .5, -11, -.4)                                                           # whip pan
r = bt(17) + .05; TL0, TL1 = bt(17) + .05, bt(19) + .6
def ioc(x): x = min(1, max(0, x)); return 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
while r < TL1:                                                                            # time-lapse tick cascade follows speed
    u = (r - TL0) / (TL1 - TL0); sp = (ioc(u + .01) - ioc(u - .01)) / .02
    add(tick(), r, -20 + 5 * min(1, sp / 1.5), (rng.random() - .5) * .6); r += max(.028, .18 / (1 + 3 * sp))
for x in [12.55, 12.9, 13.2, 13.45, 13.7]: add(click(), x, -26, .5 + (rng.random() - .5) * .4, .5)                # lights switching off
add(tapestop(.4), bt(20) - .05, -15, 0); add(drone(1.9), bt(20), -11, 0, .6); add(boom(55, 30, 1.0, .3), bt(20) + .2, -14, 0, .3)  # freeze 嗡
add(slam(), bt(20) + .2, -12, -.4, .4); add(slam(), bt(21), -10, .4, .4); add(slam(), bt(22), -12, 0, .4); add(crack(), bt(22), -20, 0, .3)
add(rewind(.72), bt(23), -13, 0, .2)                                                                              # VHS rewind
hb = .713 / 2
for j in range(4): add(pop(), bt(24) + j * hb + .05, -12, (-.4 + .25 * j)); add(swipe(), bt(24) + j * hb, -22, .3)
for j in range(16): add(pop(), bt(24) + 4 * hb - .3 + rng.random() * .33, -22 + rng.random() * 4, (rng.random() - .5) * 1.4)  # flood
add(whoosh(.7, 300, 7000, .12), bt(26), -9, 0, .4); add(boom(80, 40, .9, .25), bt(26), -13, 0, .3)                # rocket zoom-out
add(whoosh(.3, 1200, 6000, .4), bt(27), -19, .2)                                                                  # ruler slides up
for i in range(11): add(tick(), bt(27) + i * .04, -21 - i * .2, .25)
add(blip(1320), bt(27) + .3, -18, .3, .6)
add(riser(.9), bt(29) - .9, -13, 0, .3)                                                                            # title burst
add(boom(62, 28, 2.2, .8), bt(29), -7, 0, .2); add(shatter(1.2, 30, .5), bt(29), -18, 0, .7); add(whoosh(.42, 400, 7000, .95), bt(29) - .02, -16, 0)
add(click(), bt(29) + .38, -14, 0, .6); add(shing(), bt(29) + .5, -17, 0, .7)
add(riser(.6), bt(32) - .6, -17, 0, .3); add(shatter(1.8, 90, 1.0), bt(32), -7, 0, .9); add(boom(55, 26, 2.0, .7), bt(32), -8, 0, .3)  # title explodes
# ================= ACTS 2–6 cues =================
Q = bt; BEAT = .713
def metro(): d = .15; return band(noise(d), 1500, 6000) * dec(d, .004) * .7 + sine(1900, d) * dec(d, .012) + .6 * sine(950, d) * dec(d, .02)
def plink(f=2093): d = .5; return sine(f, d) * dec(d, .12) + .35 * sine(f * 2.01, d) * dec(d, .06) + .2 * band(noise(d), 3000, 9000) * dec(d, .004)
def beadsnd(f=1318): d = .7; return sine(f, d) * dec(d, .22) + .45 * sine(f * 2.76, d) * dec(d, .07) + .3 * sine(f / 2, d) * dec(d, .12) + .5 * band(noise(d), 2500, 9000) * dec(d, .003)
def stamphit(): d = .8; return boom(110, 45, d, .12) * 1.2 + .8 * band(noise(d), 150, 1800) * dec(d, .025) + .3 * band(noise(d), 2000, 6000) * dec(d, .01)
def paperslap(): d = .5; return band(noise(d), 400, 5000) * dec(d, .05) + .6 * boom(140, 60, d, .06)
def pen(d=.55): t = T(d); return band(noise(d), 2500, 7000) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 7 * t))) * env(d, [(0, 0), (.1, 1), (.85, 1), (1, 0)])
def foldsnd(): d = .45; x = whoosh(.32, 500, 4000, .8); x = fit(x, d * SR); x[int(.3 * SR):] += (band(noise(d - .3), 1200, 6000) * dec(d - .3, .012) * 1.5)[:len(x) - int(.3 * SR)]; return x
def step(): d = .18; return band(noise(d), 150, 1600) * dec(d, .025) + .4 * sine(90, d) * dec(d, .03)
def crtoff(): d = .9; return sine(np.geomspace(2400, 60, int(d * SR)), d) * env(d, [(0, 1), (.4, .6), (1, 0)]) * .5 + band(noise(d), 1000, 8000) * dec(d, .05) * .6 + boom(90, 40, d, .15) * .7
def lockclick(): d = .2; x = band(noise(d), 1800, 8000) * dec(d, .004) + .6 * sine(2400, d) * dec(d, .006); y = fit(np.zeros(1), d * SR); i = int(.045 * SR); y[i:] = x[:len(y) - i] * .7; return x + y + .6 * sine(300, d) * dec(d, .02)
def needle(): d = .32; return sine(np.geomspace(1400, 160, int(d * SR)), d) * env(d, [(0, 0), (.1, 1), (1, .2)]) * .6
def bell(d=1.45): t = T(d); return (np.sin(2 * np.pi * 2350 * t) + .6 * np.sin(2 * np.pi * 2620 * t) + .3 * np.sin(2 * np.pi * 4700 * t)) * (.55 + .45 * np.sign(np.sin(2 * np.pi * 18 * t))) * env(d, [(0, 0), (.02, 1), (.92, 1), (1, 0)])
def chime(fs=(523.25, 659.25, 783.99, 1046.5), d=2.2): return sum(sine(f, d) * dec(d, .7 / (1 + k * .3)) * (1 / (1 + k * .3)) + .2 * sine(f * 3.01, d) * dec(d, .15) for k, f in enumerate(fs))
def static(d=.3): t = T(d); return band(noise(d), 800, 9000) * (np.sin(2 * np.pi * 37 * t) > 0) * env(d, [(0, 0), (.1, 1), (.9, 1), (1, 0)])
def hum(d, f=118): t = T(d); return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2 * t) + .2 * band(noise(d), 100, 600)) * env(d, [(0, 0), (.05, 1), (.95, 1), (1, 0)])
def stretch(d=1.2): t = T(d); return sine(196 + 6 * np.sin(2 * np.pi * 1.5 * t), d) * env(d, [(0, 0), (.15, 1), (.8, .8), (1, 0)]) * .8 + .3 * sine(98, d) * env(d, [(0, 0), (.2, 1), (1, 0)])
def grey(d): t = T(d); x = sum(np.sin(2 * np.pi * f * t) for f in [233, 247, 262, 277]) * .25 + .4 * band(noise(d), 300, 2000); return x * env(d, [(0, 0), (.85, 1), (1, .3)]) ** 1.5
def pulse(d, f=82): t = T(d); return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2 * t)) * (.5 + .5 * np.sin(2 * np.pi * 8.4 * t - np.pi / 2)) * env(d, [(0, 0), (.2, 1), (1, 1)])
def rollsnd(d): return lp1(noise(d), 500) * env(d, [(0, 0), (.1, 1), (.9, 1), (1, 0)]) * (1 + .5 * np.sin(2 * np.pi * 13 * T(d)))
def hb(k): return Q(k)
def wh_end(t_end, L=.4, g=-15, pan=0, lo=400, hi=6000):  # whoosh peaking at t_end
    add(whoosh(L, lo, hi, .85), t_end - L * .85, g, pan)
# ---------- S2 ----------
add(whoosh(.5, 300, 5000, .7), Q(32) + .25, -18, .3)
add(slam(), Q(34), -8, .3, .4); add(crack(), Q(34) + .02, -16, .35, .4); add(boom(70, 32, 1.2, .35), Q(34), -12, 0, .2)
add(whoosh(.4, 400, 5000, .7), Q(36), -18, 0)
for i, (pn) in enumerate([-.6, .6, 0]): ta = Q(36.5 + i * .5); wh_end(ta, .38, -14, pn); add(thunk(), ta, -14, pn * .6, .3)
add(riser(.85), Q(40) - .85, -14, 0, .3); add(slam(), Q(40), -9, 0, .4); add(shing(), Q(40) + .1, -17, .2, .6)
add(whoosh(.45, 300, 6000, .6), Q(42) - .1, -15, -.6); add(whoosh(.45, 300, 6000, .6), Q(42) - .05, -15, .6)
add(hum(Q(45.6) - Q(42.3)), Q(42.3), -27, -.6); add(plink(1568), Q(45.6), -16, -.6, .5); add(plink(1568), Q(45.6) + .25, -18, -.6, .5)
r = Q(42) + .1
while r < Q(48) - .1: add(swipe(), r, -23, .6); add(tap(), r + .02, -27, .6); r += .42
add(stretch(1.25), Q(44) - .05, -14, -.5, .4)
add(whoosh(.3, 800, 9000, .3), Q(45) - .1, -12, .7)
add(whoosh(.5, 300, 6000, .8), Q(48) - .4, -15, 0)
for k in range(48, 56): add(metro(), Q(k), -15 + (1 if k % 2 == 0 else 0), -.55, .3)
for k in range(48, 52): add(plink(1760 + 120 * (k - 48)), Q(k) + 1.15, -20, .45, .5)
for k in range(52, 56): add(thunk(), Q(k) + .62, -19, 0, .3); add(blip(900), Q(k) + .62, -24, 0, .3)
add(whoosh(.35, 300, 3000, .7), Q(50) - .3, -17, 0); add(thunk(), Q(50), -14, 0, .4)
add(thunk(), Q(52), -10, 0, .4); add(boom(90, 50, .6, .12), Q(52), -14, 0, .3); add(click(), Q(52), -14, 0, .3)
add(slam(), Q(53), -10, 0, .4); add(slam(), Q(54), -8, 0, .4); add(boom(55, 28, 1.6, .5), Q(54), -12, 0, .2)
add(whoosh(.45, 300, 6000, .7), Q(56) - .2, -16, 0)
for j in range(34): add(plink(2200 + rng.random() * 1400), Q(56) + rng.random() * (Q(58.6) - Q(56)), -30 + rng.random() * 4, -.5 - .2 * rng.random(), .3)
for x in [Q(56.6), Q(57.6), Q(58.6)]: add(plink(1318), x + .25, -16, .5, .5)
add(thunk(), Q(58), -14, -.4, .3); add(thunk(), Q(59), -14, .4, .3)
add(stamphit(), Q(60), -8, 0, .4); add(crack(), Q(60) + .02, -18, 0, .4)
add(thunk(), Q(62) + .35, -14, -.3, .4); add(rollsnd(Q(63.9) - Q(62.25)), Q(62.25), -24, 0)
for x, pn in zip([Q(62.9), Q(63.3), Q(63.9)], [-.4, -.2, .6]): add(blip(1320), x, -20, pn, .4)
# ---------- S3 ----------
add(slam(), Q(64), -9, 0, .4); add(shing(), Q(64) + .1, -17, -.2, .6)
add(whoosh(.4, 400, 5000, .7), Q(66) - .1, -19, 0)
for x, pn in zip([48.75, 49.75, 50.75], [-.42, -.17, .62]): add(blip(1320), x, -11, pn, .5)
add(whoosh(.4, 400, 5000, .7), Q(72) - .1, -19, 0); add(pop(), Q(72.5), -18, -.2); add(pop(), Q(72.5) + .06, -18, .2); add(click(), Q(73), -16, .2, .3)
add(slam(), Q(74), -8, 0, .4); add(whoosh(.3, 800, 6000, .6), Q(74) + .15, -20, -.3); add(whoosh(.3, 800, 6000, .6), Q(74) + .35, -20, .3)
add(whoosh(.4, 400, 5000, .7), Q(76) - .15, -17, 0)
st = Q(76) + .1
while st < Q(82) - .2: pn = -.8 + 1.6 * min(1, (st - Q(76)) / (Q(82) - Q(76))); add(step(), st, -24, pn, .2); st += np.pi / 11
add(thunk(), Q(77), -15, 0, .3); add(slam(), Q(78), -9, 0, .4)
add(whoosh(.45, 300, 6000, .7), Q(82) - .2, -15, 0)
r = Q(82) + .05
while r < Q(84) - .45: add(tick(), r, -27, (rng.random() - .5) * .5); r += .06
for i in range(5): add(pop(), Q(82) + (i * .2) * (Q(84) - .4 - Q(82)), -18, -.5 + i * .25)
add(suck(.5), Q(84) - .5, -12, 0, .2); add(boom(80, 36, 1.0, .3), Q(84), -10, 0, .3); add(whoosh(.3, 500, 7000, .2), Q(84), -16, 0)
add(slam(), Q(85), -9, 0, .4)
add(slam(), Q(88), -10, 0, .4); add(whoosh(.2, 600, 5000, .6), Q(88.5), -22, 0); add(slam(), Q(89), -9, 0, .4)
add(whoosh(.3, 400, 4000, .8), Q(89.6) - .2, -18, 0); add(crack(), Q(90), -10, 0, .4); add(stamphit(), Q(90), -9, .2, .4)
add(drone(1.5), Q(92), -16, 0, .5); add(riser(Q(94) - Q(92.7)), Q(92.7), -13, 0, .3)
add(boom(70, 34, 1.2, .35), Q(94), -10, 0, .3); add(bell(Q(96) - Q(94) - .02), Q(94), -17, .1, .4)
# ---------- S4 ----------
add(slam(), Q(96), -9, 0, .4); add(shing(), Q(96) + .1, -17, -.2, .6)
for j in range(26): add(tap(), Q(96.6) + rng.random() * (Q(101) - Q(96.6)), -31 + rng.random() * 4, -.3 + rng.random() * .2, .2)
add(whoosh(.4, 300, 4000, .8), Q(98) - .4, -19, .6)
add(pop(), Q(98), -14, .5, .3); add(pop(), Q(99), -14, -.4, .3); add(pop(), Q(100), -14, .5, .3)
add(whoosh(.35, 300, 2500, .5), Q(101) - .1, -19, -.4, .4); add(pop(), Q(101), -17, -.4, .3)
for j in range(5): add(static(.12), Q(101) + .1 + j * .17, -28, -.4)
add(whoosh(.4, 300, 6000, .7), Q(102) - .15, -16, 0); add(thunk(), Q(102) + .14, -13, 0, .4)
for j, pn in enumerate([-.4, 0, .4]): add(thunk(), Q(102.5 + j * .5), -15, pn, .3); add(static(.3), Q(102.5 + j * .5) + .05, -30, pn)
add(whoosh(.4, 400, 5000, .7), Q(104) - .1, -19, 0); add(slam(), Q(105), -9, 0, .4)
PENTA = [1046.5, 1174.7, 1318.5, 1568.0, 1760.0, 2093.0, 2349.3, 2637.0]
for i in range(5): add(beadsnd(PENTA[i]), Q(105.5 + i * .5), -13, -.6 + i * .26, .5)
add(whoosh(.35, 600, 5000, .6), Q(107.5), -22, 0)
add(slam(), Q(108) + .12, -10, 0, .4)
for i in range(6): add(beadsnd(PENTA[i + 2] * 1.0), Q(108.5) + i * BEAT * .25, -14, (i - 2.5) * .1, .5); add(tinkle(.4, 6), Q(108.5) + i * BEAT * .25, -28, (i - 2.5) * .15, .6)
add(whoosh(1.0, 200, 5000, .5), Q(110) - .1, -14, 0, .3); add(shing(), Q(110) + .3, -22, 0, .6)
for j in range(70): add(tick(), Q(112) + (j / 70) ** 1.1 * (Q(114) - Q(112)), -27 + rng.random() * 3, (rng.random() - .5) * 1.4)
add(grey(Q(116) - Q(114.3)), Q(114.3), -19, 0, .3)
add(slam(), Q(116), -8, 0, .4); add(boom(60, 30, 1.4, .45), Q(116), -11, 0, .2)
for j in range(60): x = rng.random(); add(pop(), Q(116) - .1 + x * .3, -25 + rng.random() * 4, -.8 + 1.6 * x, .3)
add(whoosh(.9, 300, 2500, .3), Q(116.4), -21, 0)
for j, pn in enumerate([-.6, -.6, -.6]): add(whoosh(.35, 400, 5000, .7), Q(118 + j * .5) - .22, -19, pn)
add(whoosh(.3, 400, 4000, .8), Q(119.5) - .2, -18, 0); add(crack(), Q(120), -10, 0, .4); add(stamphit(), Q(120), -9, .2, .4)
for i, pn in enumerate([-.7, .7, 0]): wh_end(Q(124 + i), .4, -13, pn); add(thunk(), Q(124 + i), -12, pn * .5, .3); add(crack(), Q(124 + i) + .02, -20, pn * .5, .3)
add(pulse(Q(128) - Q(127)), Q(127), -16, 0, .2); add(riser(.62), Q(128) - .62, -11, 0, .3); add(suck(.35), Q(128) - .35, -15, 0)
# ---------- S5 ----------
add(shatter(1.8, 100, 1.0), Q(128), -6, 0, .8); add(boom(55, 24, 2.2, .7), Q(128), -6, 0, .3); add(slam(), Q(128) + .1, -9, 0, .4)
add(slam(), Q(129), -7, 0, .4); add(boom(48, 24, 1.8, .6), Q(129), -10, 0, .2)
add(whoosh(.4, 300, 5000, .7), Q(130) - .15, -18, 0)
for i, pn in enumerate([-.6, 0, .6]): add(pop(), Q(130) + i * .12 + .15, -18, pn)
for i, pn in enumerate([-.6, 0, .6]): td = Q(131 + i * .5); add(needle(), td - .25, -14, pn, .3); add(thunk(), td, -12, pn, .3); add(tick(), td + .03, -18, pn)
add(whoosh(.4, 300, 5000, .7), Q(134) - .15, -18, 0); add(whoosh(.6, 600, 6000, .5), Q(134), -21, 0)
for k, pn, f in [(135, -.45, 1568), (137, .4, 1174.7), (139, -.45, 880)]: add(beadsnd(f), Q(k), -12, pn, .5); add(whoosh(.25, 600, 5000, .7), Q(k) - .2, -22, pn)
add(stamphit(), Q(140), -8, -.2, .4); add(boom(60, 30, 1.2, .4), Q(140), -12, 0, .2)
add(whoosh(.55, 300, 5000, .5), Q(144), -16, 0)
for i in range(5): add(tick(), Q(144) + .2 + i * .08, -22, -.6 + .3 * i)
for j, k in enumerate([146, 148, 150, 152, 153, 154, 155, 156, 157]):
    add(foldsnd(), Q(k) - .32, -13 - (j > 2) * 2, (-1) ** j * .2, .3); add(boom(100 + 12 * j, 50, .5, .1), Q(k), -14, 0, .2); add(blip(700 + 90 * j), Q(k) + .02, -22, 0, .4)
add(riser(Q(158.5) - Q(156)), Q(156), -12, 0, .3); add(suck(Q(159.6) - Q(158.5) + .2), Q(158.5), -13, 0, .2)
# ---------- S6 ----------
add(slam(), Q(160) + .1, -7, 0, .4); add(paperslap(), Q(160) + .1, -10, 0, .3); add(boom(60, 28, 1.6, .5), Q(160) + .1, -10, 0, .2)
add(pen(Q(160.85) - Q(160.3) + .1), Q(160) + .3, -20, -.2, .2)
add(whoosh(.5, 300, 3000, .8), Q(162.3), -17, 0)
add(whoosh(.4, 400, 5000, .7), Q(162.55) - .1, -20, 0)
add(slam(), Q(163), -9, 0, .4); add(shing(), Q(163), -14, 0, .6); add(chime(), Q(163), -16, 0, .6)
for k, pn in [(164, 0), (168, 0), (172, 0)]: add(thunk(), Q(k) + .12, -13, pn, .4); add(whoosh(.35, 400, 5000, .7), Q(k) - .1, -18, pn)
for i in range(9): add(plink(PENTA[i % 8]), Q(164.5 + i * .4) + .55, -18, .4, .5)
for i in range(4): add(tick(), Q(164) + .3 + i * BEAT, -24, -.4)
import math
P6 = [(730, 560), (930, 470), (1130, 420), (1260, 450), (1330, 600), (1400, 720), (1200, 790), (960, 760), (760, 640)]
L6 = sum(math.hypot(P6[i][0] - P6[i - 1][0], P6[i][1] - P6[i - 1][1]) for i in range(1, len(P6)))
def ios(x): x = min(1, max(0, x)); return x * x * (3 - 2 * x)
prev = 0; tt = Q(168.5)
while tt < Q(171.6):
    ns = int(L6 * ios((tt - Q(168.5)) / (Q(171.6) - Q(168.5))) / 46)
    if ns > prev: add(step(), tt, -21, (-1) ** ns * .25, .2); prev = ns
    tt += 1 / 120
add(whoosh(.35, 400, 4000, .8), Q(173) - .25, -18, 0); add(chime((392.0, 523.25, 659.25, 783.99, 1046.5), 2.6), Q(173), -12, 0, .7); add(boom(70, 40, 1.0, .3), Q(173), -16, 0, .3)
for k, pn in [(173.5, -.4), (174, 0), (174.5, .4)]: add(pop(), Q(k), -16, pn, .3)
add(whoosh(.8, 200, 5000, .4), Q(176), -15, 0, .3); add(thunk(), Q(176) + .12, -13, 0, .4)
for i in range(40):
    if i % 2 == 0: add(blip(880 * 2 ** (i / 2 / 12 * 1.0)), Q(177) + i * (Q(179.5) - Q(177)) / 40, -27, -.7 + 1.4 * i / 40, .5)
add(slam(), Q(178), -9, 0, .4)
add(lockclick(), Q(180) - .01, -9, 0, .3); add(crtoff(), Q(180), -13, 0, .3)
add(tick(), 131.7, -22, 0, .3)
for x, f in [(132.4, 1.0), (133.11, .97), (133.82, .94)]: add(tock(f), x, -12 + (x - 132.4) * -2, -.1, .5)
# ---------- reverb (noise IR) ----------
d = 1.6; IR = rng.standard_normal(int(d * SR)) * np.exp(-T(d) / .35); IR = band(IR, 200, 7000); IR /= np.sqrt(np.sum(IR ** 2))
L = N + len(IR); nf = 1 << (L - 1).bit_length()
for c in range(2):
    ir = np.roll(IR, c * 97); w = np.fft.irfft(np.fft.rfft(verb[c], nf) * np.fft.rfft(ir, nf), nf)[:N]; sfx[c] += w * .5
mix = music * 10 ** (-2 / 20) + sfx
def wr(p, a):
    a = np.clip(a, -1, 1); w = wave.open(p, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((a.T * 32767).astype(np.int16).tobytes()); w.close()
wr('/data/night/full_raw.wav', mix / max(1, np.max(np.abs(mix)) * 1.02)); wr('/data/night/full_sfx.wav', sfx / np.max(np.abs(sfx)) * .9)
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/data/night/full_raw.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', m)[-1]); g = -14 - I
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', '/data/night/full_raw.wav', '-af', f'volume={g + 0.1:.2f}dB,alimiter=limit=0.89:level=false', '-ar', '48000', '/data/night/full_a.wav'])
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/data/night/full_a.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('raw I', I, '| final', re.findall(r'I:\s+(-?[\d.]+) LUFS', m)[-1], 'LUFS, peak', re.findall(r'Peak:\s+(-?[\d.]+) dBFS', m)[-1])
mu = music * 10 ** (-2 / 20)
for a in range(0, 134, 6):
    i, j = int(a * SR), int(min(134.19, a + 6) * SR); r = lambda x: 20 * np.log10(np.sqrt(np.mean(x[:, i:j] ** 2)) + 1e-9)
    print(f'{a:5.1f}  music {r(mu):6.1f}  sfx {r(sfx):6.1f}')
