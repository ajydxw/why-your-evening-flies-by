import numpy as np, wave, subprocess, re
SR = 48000; rng = np.random.default_rng(11)
def bt(k): return 0.145 + 0.713 * k
DUR = globals().get("DUR", 23.5)
def rd(p):
    w = wave.open(p); n = w.getnframes(); ch = w.getnchannels()
    a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float64) / 32768.0; return a.reshape(-1, ch).T.copy()
N = int(DUR * SR)
music = rd('/data/yd/bgm.wav')[:, :N]
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
