import numpy as np, wave, subprocess, re
SR = 48000; rng = np.random.default_rng(11)
def bt(k): return 0.145 + 0.713 * k
DUR = 23.5
def rd(p):
    w = wave.open(p); n = w.getnframes(); ch = w.getnchannels()
    a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float64) / 32768.0; return a.reshape(-1, ch).T.copy()
N = int(DUR * SR)
music = rd('/data/night/bgm.wav')[:, :N]
fade = np.ones(N); i0 = int(23.0 * SR); fade[i0:] = np.linspace(1, 0, N - i0) ** 2; music *= fade
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
# ---------- reverb (noise IR) ----------
d = 1.6; IR = rng.standard_normal(int(d * SR)) * np.exp(-T(d) / .35); IR = band(IR, 200, 7000); IR /= np.sqrt(np.sum(IR ** 2))
L = N + len(IR); nf = 1 << (L - 1).bit_length()
for c in range(2):
    ir = np.roll(IR, c * 97); w = np.fft.irfft(np.fft.rfft(verb[c], nf) * np.fft.rfft(ir, nf), nf)[:N]; sfx[c] += w * .5
mix = music * 10 ** (-2 / 20) + sfx
def wr(p, a):
    a = np.clip(a, -1, 1); w = wave.open(p, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((a.T * 32767).astype(np.int16).tobytes()); w.close()
wr('/data/night/open_raw.wav', mix / max(1, np.max(np.abs(mix)) * 1.02)); wr('/data/night/open_sfx.wav', sfx / np.max(np.abs(sfx)) * .9)
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/data/night/open_raw.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', m)[-1]); g = -14 - I
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', '/data/night/open_raw.wav', '-af', f'volume={g + 0.1:.2f}dB,alimiter=limit=0.89:level=false', '-ar', '48000', '/data/night/open_a.wav'])
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/data/night/open_a.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('raw I', I, '| final', re.findall(r'I:\s+(-?[\d.]+) LUFS', m)[-1], 'LUFS, peak', re.findall(r'Peak:\s+(-?[\d.]+) dBFS', m)[-1])
mu = music * 10 ** (-2 / 20)
for a, b in [(0, 3), (3, 5.1), (5.1, 7.2), (7.2, 9.4), (9.4, 12), (12, 14.4), (14.4, 16.5), (16.5, 18.7), (18.7, 20.8), (20.8, 23.5)]:
    i, j = int(a * SR), int(b * SR); r = lambda x: 20 * np.log10(np.sqrt(np.mean(x[:, i:j] ** 2)) + 1e-9)
    print(f'{a:5.1f}-{b:5.1f}  music {r(mu):6.1f}  sfx {r(sfx):6.1f}')
