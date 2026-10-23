# 《越想赢，越会输》 opening 0–12.0s : music shaping + synced SFX → open_a.wav (−14 LUFS)
DUR = 134.2
exec(open('/data/yd/sfx_lib.py').read())
Q = bt; T_IGN, B2, B3, SLIP, TQ1, TQ2, TQ3, B5 = Q(0), Q(4), Q(8), Q(12), Q(13), Q(14), Q(15), Q(16)
PREV_END = Q(32)
SLIDE0, SLIDE1 = SLIP + .42, TQ3 + .25
# ---------- extra synths ----------
def hbeat(): d = .7; x = sine(np.linspace(70, 40, int(d * SR)), d) * dec(d, .08, .004) + .5 * band(noise(d), 20, 160) * dec(d, .04); y = np.zeros_like(x); k = int(.17 * SR); y[k:] = x[:-k] * .6; return x + y
def snap(): d = .2; return band(noise(d), 1800, 9000) * dec(d, .004) * 1.4 + .8 * sine(np.linspace(1400, 600, int(d * SR)), d) * dec(d, .01) + .6 * sine(140, d) * dec(d, .04)
def swell(d=1.6, root=220): t = T(d); e = env(d, [(0, 0), (.6, 1), (1, 0)]) ** 1.5; return sum(np.sin(2 * np.pi * root * r * t + i) / (1 + i * .5) for i, r in enumerate([1, 1.25, 1.5, 2, 2.5, 3])) * e
def pluck(f=110, d=1.2, damp=.996):  # Karplus-Strong wire
    n = int(SR / f); buf = rng.standard_normal(n) * .8; out = np.zeros(int(d * SR))
    for i in range(len(out)): out[i] = buf[i % n]; buf[i % n] = damp * .5 * (buf[i % n] + buf[(i + 1) % n])
    return band(out, 60, 6000) * dec(d, .5, .001)
def wiretap(f=130): return pluck(f, 1.0) + .5 * fit(band(noise(.05), 1500, 6000) * dec(.05, .006), SR) + .3 * sine(f * 3.01, 1.0) * dec(1.0, .15)
def zap(d=.9):
    t = T(d); saw = ((t * 92) % 1) * 2 - 1; buzz = band(saw * (1 + .5 * np.sign(np.sin(2 * np.pi * 31 * t))), 100, 5000)
    return (buzz * .5 + band(noise(d), 2000, 10000) * .6 * (rng.random(len(t)) > .6)) * env(d, [(0, 0), (.02, 1), (.4, .5), (1, 0)])
def neon(big=False):
    d = .7 if big else .45; t = T(d); hum = band(((t * 120) % 1) * 2 - 1, 80, 3000) * env(d, [(0, 0), (.05, 1), (.6, .5), (1, 0)]) * (1 + .6 * (rng.random(len(t)) > .93))
    clk = band(noise(.06), 1200, 8000) * dec(.06, .006); x = fit(clk, len(t)) * 1.2 + hum * .5
    if big: x += .8 * fit(boom(80, 40, d, .2), len(t))
    return x
def blink(): d = .16; return band(noise(d), 300, 2200) * env(d, [(0, 0), (.15, 1), (1, 0)]) ** 2 + .5 * sine(np.linspace(300, 180, int(d * SR)), d) * dec(d, .04)
def crowd(d): x = sum(band(noise(d), 300 * (1 + k * .4), 3200) * (1 + .7 * np.sin(2 * np.pi * (3 + k * 1.7) * T(d) + k)) for k in range(4)); return x
def rumble(d): t = T(d); return band(noise(d), 25, 140) * (1 + .5 * np.sin(2 * np.pi * 9 * t)) + .4 * sine(48 + 6 * np.sin(2 * np.pi * 1.3 * t), d)
def screech(d):
    t = T(d); f = np.linspace(3400, 900, len(t)); x = band(noise(d), 800, 9000) * .5 + .45 * sine(f, d) * (1 + .4 * np.sin(2 * np.pi * 37 * t))
    cr = np.zeros(len(t)); idx = rng.integers(0, len(t) - 600, 260); 
    for i in idx: cr[i:i + 400] += rng.standard_normal(400) * np.exp(-np.arange(400) / 60)
    return (x + band(cr, 2000, 11000) * .9) * env(d, [(0, 0), (.06, 1), (.8, .8), (1, 0)])
def glitch(d=.4):
    out = np.zeros(int(d * SR)); k = 0
    while k < len(out): L = int(SR * rng.uniform(.015, .05)); seg = band(noise(L / SR), rng.uniform(300, 2000), rng.uniform(3000, 9000)) if rng.random() < .6 else sine(rng.uniform(200, 1600), L / SR); seg = fit(seg, L); n2 = len(out[k:k + L]); out[k:k + n2] = seg[:n2] * (rng.random() > .25); k += L
    return out * env(d, [(0, 1), (.8, .7), (1, 0)])
def sparkle(d=1.4, n=40):
    out = np.zeros(int(d * SR))
    for i in range(n):
        t0 = int(rng.uniform(0, d * .8) * SR); f = rng.uniform(2500, 7000); L = int(.25 * SR); s = sine(f, .25) * dec(.25, .05); out[t0:t0 + L] += s[:len(out[t0:t0 + L])] * rng.uniform(.3, 1)
    return out
# ---------- music shaping ----------
def lpf(x, fc):
    X = np.fft.rfft(x, axis=1); f = np.fft.rfftfreq(x.shape[1], 1 / SR); return np.fft.irfft(X / (1 + (f / fc) ** 4), x.shape[1], axis=1)
m4, m10 = lpf(music, 380), lpf(music, 1200)
tt = np.arange(N) / SR
def ramp(pts): return np.interp(tt, [p[0] for p in pts], [p[1] for p in pts])
w4 = ramp([(0, 1), (Q(1.5), 1), (Q(3), 0), (SLIP + .05, 0), (SLIP + .3, 1), (TQ2 - .02, 1), (TQ2, 0), (Q(30), 0), (Q(30) + .08, 1), (Q(30.5) - .03, 1), (Q(30.5), 0), (99, 0)])
wF = ramp([(0, 0), (Q(3), 0), (B2, 1), (SLIP, 1), (SLIP + .2, 0), (TQ2 - .02, 0), (TQ2, 1), (Q(30), 1), (Q(30) + .08, 0), (Q(30.5) - .03, 0), (Q(30.5), 1), (99, 1)])
w10 = np.clip(1 - w4 - wF, 0, 1)
gain_dB = ramp([(0, -40), (T_IGN - .02, -40), (T_IGN, -6), (Q(2) - .02, -3.5), (Q(2) + .05, -17), (Q(2) + .42, -13), (Q(3), -2.4), (B2, -1), (Q(11.5), 0), (SLIP - .02, 0), (SLIP + .22, -32), (SLIP + .5, -24), (TQ1, -13), (TQ2 - .05, -11), (TQ2, 0), (B5, 0), (Q(30) - .02, 0), (Q(30) + .05, -9), (Q(30.5) - .05, -6), (Q(30.5), 0), (99, 0)])
mus = (m4 * w4 + m10 * w10 + music * wF) * 10 ** (gain_dB / 20)
duck = np.zeros(N)
for t0, db, d in [(T_IGN, -4, .5), (Q(11), -3, .4), (TQ2, -4, .45), (B5, -4, .4), (Q(18), -6, .5), (Q(25), -3, .3), (Q(28), -4, .5)]:
    i = int(t0 * SR); n = int(d * SR); duck[i:i + n] = np.minimum(duck[i:i + n], db * (1 - np.linspace(0, 1, len(duck[i:i + n]))) ** 1.5)
mus *= 10 ** (duck / 20)
i0, n0 = int(Q(26) * SR), int(.3 * SR); seg = mus[:, i0 - 2 * n0:i0][:, ::-1][:, ::2][:, :n0].copy(); fw = np.ones(n0); k8 = int(.012 * SR); fw[:k8] = np.linspace(0, 1, k8); fw[-k8:] = np.linspace(1, 0, k8)
seg *= fw * np.linspace(1, .5, n0); mus[:, i0:i0 + n0] = mus[:, i0:i0 + n0] * (1 - fw) + seg
k2 = int(.05 * SR); mus[:, i0 + n0:i0 + n0 + k2] *= np.linspace(0, 1, k2)
# ---------- cues ----------
# ignition
add(zap(1.0), T_IGN, -13, -.3, .4); add(boom(70, 34, 1.8, .6), T_IGN, -11, 0, .4); add(shing(), T_IGN + .02, -17, .2, .7)
for i, p in enumerate(np.linspace(-.8, .8, 6)): add(whoosh(.35, 600, 8000, .5), T_IGN + .05 + i * .16, -22, p, .3)
add(sparkle(1.6, 50), T_IGN + .2, -24, 0, .8); add(swell(2.4, 196), T_IGN, -21, 0, .8)
# city ambience bed
add(band(noise(SLIP - T_IGN), 80, 900) * env(SLIP - T_IGN, [(0, 0), (.1, 1), (1, 1)]), T_IGN, -36, 0, .2)
# footsteps on the wire: land on beats 1..11, pitch rises with height
for k in range(1, 12):
    if k != 2: add(wiretap(110 * 2 ** (k / 18)), Q(k), -17 + k * .25, -.2 + k * .03, .25)
# ---- bar 1 hook: macro ignition / vertigo / near-slip / pull-back ----
HA2, HA3, HA4 = Q(1), Q(2), Q(3)
def wind(d): t = T(d); return (band(noise(d), 180, 1800) * (1 + .6 * np.sin(2 * np.pi * 1.7 * t)) + .5 * band(noise(d), 2500, 7000) * (1 + np.sin(2 * np.pi * 3.3 * t + 1))) * env(d, [(0, 0), (.25, 1), (.75, .8), (1, 0)])
def subdrop(d): return sine(np.linspace(95, 26, int(d * SR)), d) * env(d, [(0, 0), (.04, 1), (.6, .7), (1, 0)])
def scrape():
    d = .3; cr = np.zeros(int(d * SR)); idx = rng.integers(0, len(cr) - 300, 120)
    for i in idx: cr[i:i + 300] += rng.standard_normal(300) * np.exp(-np.arange(300) / 40)
    return (band(cr, 1500, 10000) + .7 * band(noise(d), 2000, 8000) + .5 * sine(np.linspace(1100, 380, int(d * SR)), d)) * env(d, [(0, 0), (.03, 1), (.5, .5), (1, 0)])
add(whoosh(.16, 400, 5000, .95), T_IGN - .145, -21, 0, .2)                     # boot coming down
add(thunk(), T_IGN, -11, 0, .3); add(pluck(55, 1.5, .997), T_IGN, -12, 0, .35)  # boot lands on the cable
add(whoosh(.32, 2500, 12000, .12), T_IGN + .02, -16, .7, .35); add(whoosh(.3, 2000, 9000, .12), T_IGN + .02, -21, -.6, .3)  # light races both ways
add(glitch(.35), T_IGN + .02, -23, -.2, .4)                                    # electric crackle
for t0, gdb in [(Q(0), -15), (Q(1), -13), (Q(2), -10), (Q(2.5), -12), (Q(3), -11), (Q(3.5), -12)]: add(hbeat(), t0, gdb, 0, .15)
for t0 in (Q(0), Q(1), Q(2), Q(3)): add(blip(1760), t0 + .01, -30, .6, .3)    # ECG monitor beep
add(whoosh(.3, 300, 6000, .85), HA2 - .26, -18, 0, .3); add(wind(HA3 - HA2 + .35), HA2, -15, 0, .3); add(subdrop(.95), HA2, -11, 0, .25)
add(swell(.8, 82), HA2, -21, 0, .6)
add(scrape(), HA3, -11, .1, .3); add(pluck(62, 1.8, .998), HA3 + .01, -10, 0, .35); add(boom(85, 30, 1.4, .5), HA3, -12, 0, .4)
add(whoosh(.45, 300, 4000, .3), HA3 + .03, -17, -.2, .3); add(glitch(.18), HA3, -21, 0, .3)
add(whoosh(.75, 150, 3200, .35), HA4, -16, 0, .35)
# eyes open on beats 4..11 (waves) + crowd murmur crescendo
for k in range(6, 12):
    for j in range(3 + (k - 4)): add(blink(), Q(k) + .02 + j * .045, -27 + (k - 4) * .5, rng.uniform(-.8, .8), .4)
# ---- shot B: facade close-up, the city opens its eyes ----
def bigblink():
    d = .45; x = band(noise(d), 140, 1400) * env(d, [(0, 0), (.08, 1), (.35, .4), (1, 0)]) ** 1.6
    x += .9 * sine(np.linspace(190, 60, int(d * SR)), d) * dec(d, .09) + .5 * fit(band(noise(.03), 900, 5000) * dec(.03, .004), int(d * SR))
    return x
EPULL = Q(5.5); EB1 = Q(6)
add(boom(62, 30, 1.2, .5), B2, -12, 0, .4); add(whoosh(.25, 300, 5000, .9), B2 - .22, -19, 0, .3)  # hard cut whoomp
add(bigblink(), B2 + .05, -11, 0, .55)                                                        # hero eye opens
add(whoosh(.14, 1500, 9000, .6), B2 + .45, -20, .4, .3); add(blip(1320), B2 + .5, -27, .4, .4)  # eye snaps to walker
for k in range(8):                                                                            # ring eyes, quarter-beats
    t0 = Q(4.5) + k * (60 / 84.15) / 4 * .9
    if t0 < EB1 - .03: add(blink(), t0, -19 + k * .3, [.5, -.5, 0, 0, .6, -.6, .6, -.6][k], .45)
for j in range(14): add(blink(), EPULL + j * .022 + rng.uniform(0, .05), -25, rng.uniform(-.9, .9), .4)  # mass wave
add(swell(EB1 - EPULL + .4, 147), EPULL - .1, -19, 0, .6); add(whoosh(.5, 150, 4000, .92), EB1 - .48, -15, 0, .3)
add(crowd(.9) * env(.9, [(0, 0), (.4, 1), (1, 0)]), EPULL, -22, 0, .5)
add(thunk(), EB1, -14, 0, .4); add(boom(75, 36, 1.0, .4), EB1, -16, 0, .4)                    # cut back to the wire
cw = crowd(SLIP - B2); add(cw * env(SLIP - B2, [(0, 0), (.3, .35), (.7, .7), (1, 1)]) ** 1.3, B2, -21, 0, .6)
# heartbeat under bar 3
for k in range(8, 12): add(hbeat(), Q(k), -14 + (k - 8), 0, .2)
# moon → eye, billboards → eyes
add(boom(55, 30, 2.2, .8), Q(9), -14, .5, .5); add(swell(2.0, 110), Q(9) - .1, -18, .5, .7)
for k in (9, 10, 11): add(glitch(.18), Q(k) + .1, -24, rng.uniform(-.7, .7), .3)
# neon words
for k in (8, 9, 10): add(neon(), Q(k), -15, -.5 + (k - 8) * .1, .35)
add(neon(True), Q(11), -11, -.2, .4); add(shing(), Q(11) + .01, -18, -.2, .7)
# wire tremble + riser
add(rumble(SLIP - B3) * env(SLIP - B3, [(0, 0), (1, 1)]) ** 1.5, B3, -16, 0, .2)
add(riser(SLIP - Q(10)), Q(10), -17, 0, .35)
# ---- SLIP ----
add(snap(), SLIP, -9, 0, .3); add(boom(90, 30, 2.0, .7), SLIP, -9, 0, .5); add(tapestop(.45), SLIP, -13, 0, .3)
add(zap(.6), SLIP + .02, -14, -.5, .5); add(crack(), SLIP + .05, -14, -.5, .4); add(shatter(1.2, 40, .6), SLIP + .14, -19, -.5, .6)
add(pluck(70, 1.6, .998), SLIP, -12, 0, .3)  # wire twang
add(whoosh(.9, 200, 3000, .4), SLIP + .15, -18, -.3, .3)  # pole falling
add(thunk(), SLIP + 1.15, -30, -.4, .8)
add(screech(SLIDE1 - SLIDE0 + .2), SLIDE0 - .1, -15, .3, .35)
add(whoosh(1.4, 120, 2500, .55), SLIP + .25, -15, 0, .4)  # pull-back
# question
add(whoosh(.3, 500, 6000, .85), TQ1 - .25, -22, -.4); add(thunk(), TQ1, -15, -.4, .4); add(blip(880), TQ1 + .07, -26, -.4, .5)
add(slam(), TQ2, -10, -.3, .4); add(whoosh(.3, 500, 6500, .85), TQ2 - .26, -18, -.3)
add(glitch(.35), TQ3, -15, -.3, .4); add(boom(60, 32, 1.6, .5), TQ3, -15, 0, .5)
add(riser(B5 - TQ3 + .1), TQ3 + .05, -20, 0, .4)

# ================= TITLE SECTION Q16–Q32 =================
T16, T17, T18, T19, T20, T21, T22, T23, T24, T25, T26, T27, T28, T29, T30, T31 = [Q(k) for k in range(16, 32)]
CHG0, CHG1, REW1, ZIP0, CRASH2, SE2, CAPT, GLINT = T16 + .22, T17 + .12, T26 + .28, T28 - .26, Q(30.5), Q(31.7), Q(24.5), Q(19.5)
def glide(fn, d): t = T(d); f = fn(t / d); ph = 2 * np.pi * np.cumsum(f) / SR; return (np.sin(ph) + .3 * np.sin(2 * ph)) * env(d, [(0, 0), (.06, 1), (.8, .8), (1, 0)])
def snore(d): t = T(d); return band(noise(d), 90, 700) * (np.maximum(0, np.sin(2 * np.pi * .9 * t)) ** 2) + .3 * sine(70, d) * (np.maximum(0, np.sin(2 * np.pi * .9 * t)) ** 3)
# bar 5 · question shatters → sucked into the curve → charge → title rises & slams
add(boom(70, 32, 1.6, .5), T16, -11, -.3, .4); add(crack(), T16, -15, -.4, .4); add(glitch(.3), T16, -19, -.4, .3)
add(suck(.6), T16 + .08, -13, -.6, .3); add(whoosh(.45, 400, 7000, .8), T16 + .2, -18, -.8, .3)
add(zap(CHG1 - CHG0 + .1) * .7, CHG0, -21, 0, .3)
for i, p in enumerate(np.linspace(-.9, .9, 6)): add(whoosh(.28, 900, 9000, .5), CHG0 + i * (CHG1 - CHG0) / 6, -21, p, .3)
add(rumble(T18 - T17) * env(T18 - T17, [(0, 0), (1, 1)]) ** 1.6, T17, -13, 0, .2); add(riser(T18 - T17 + .04), T17, -15, 0, .35)
add(shing(), T17 + .01, -21, 0, .7); add(swell(1.3, 220), T17, -21, 0, .6)
add(slam(), T18, -7, 0, .4); add(boom(58, 26, 2.2, .7), T18, -9, 0, .5); add(shing(), T18 + .01, -14, 0, .8); add(whoosh(.55, 200, 5000, .2), T18 + .02, -17, 0, .4)
for i in range(24):
    if i not in (6, 13, 17, 19): add(tick(), T19 + i * .022, -25 + rng.uniform(-2, 2), -.4 + i * .033, .2)
add(ping(), GLINT + .1, -22, .2, .7); add(whoosh(.4, 3000, 12000, .5), GLINT, -24, 0, .5)
# bar 6 · dock + chart build
add(whoosh(.65, 200, 5000, .55), T20, -15, -.3, .3); add(thunk(), T20 + .6, -19, -.6, .3); add(swell(1.5, 147), T20, -22, 0, .6)
add(whoosh(.4, 700, 9000, .35), T21, -18, -.8, .3); add(glide(lambda u: 400 + 900 * u ** .7, .38) * .5, T21, -24, -.8, .3); add(blip(1320), T21 + .36, -24, -.8, .4); add(pop(), T21 + .2, -21, -.8, .3)
add(whoosh(.4, 700, 9000, .35), T22, -18, 0, .3)
for i in range(11): add(click(), T22 + .03 + i * .03, -27, -.8 + i * .16, .2)
add(pop(), T22 + .25, -21, .7, .3)
xs = lambda u: -1000 + 2040 * (3 * u * u - 2 * u ** 3)
add(glide(lambda u: 300 + 600 * np.exp(-(xs(u) / 400) ** 2), .66), T23, -19, 0, .5); add(sparkle(.7, 18), T23, -27, 0, .6)
# bar 7 · the city's eyes fly onto the axis
add(thunk(), T24, -18, 0, .4); add(whoosh(.7, 300, 6000, .45), T24, -15, 0, .4); add(crowd(.7) * env(.7, [(0, 0), (.3, 1), (1, 0)]), T24, -23, 0, .5)
for j in range(16): add(blink(), T24 + rng.uniform(0, .15), -27, rng.uniform(-.9, .9), .4)
for i in range(1, 11): add(blip(500 * 2 ** (i / 7)), T24 + .24 + i * .034 + .07, -25 + i * .5, -.8 + i * .16, .4)
add(boom(80, 40, .8, .3), T25, -14, 0, .3); add(thunk(), T25, -15, 0, .3); add(blip(1320), T25 + .02, -22, 0, .4); add(blip(1760), T25 + .12, -22, 0, .4)
add(pop(), CAPT, -22, 0, .3)
# bar 8 · rewind → lazy → peak → panic → crash
add(rewind(.45), T26, -11, 0, .3); add(glitch(.25), T26, -19, 0, .3); add(thunk(), REW1, -16, -.5, .3)
add(snore(ZIP0 - REW1 - .1), REW1 + .1, -25, -.5, .3)
for t0, gdb in [(Q(26.6), -19), (Q(27.6), -18), (T28, -15), (Q(28.75), -14), (Q(29.35), -13), (Q(29.8), -12), (Q(30.1), -11), (Q(30.4), -11), (Q(30.7), -10), (T31, -10), (Q(31.3), -10), (Q(31.6), -10), (Q(31.9), -10)]:
    add(hbeat(), t0, gdb, 0, .15); add(blip(1760), t0 + .01, -31, .6, .3)
add(whoosh(.3, 500, 8000, .7), ZIP0, -16, -.4, .3)
add(ping(), T28, -13, 0, .6); add(shing(), T28 + .01, -14, 0, .8); add(sparkle(1.3, 44), T28 + .05, -19, 0, .7); add(boom(55, 30, 1.5, .6), T28, -16, 0, .5)
add(riser(T30 - T29) * .8, T29, -18, 0, .3); add(rumble(T30 - T29) * env(T30 - T29, [(0, 0), (1, 1)]) ** 1.5, T29, -18, .1, .2)
add(snap(), T30, -9, .1, .3); add(boom(90, 30, 2.0, .7), T30, -10, 0, .5); add(glitch(.4), T30, -16, .2, .4); add(pluck(70, 1.6, .998), T30, -13, 0, .3)
add(screech(SE2 - T30), T30 + .2, -16, .4, .35); add(whoosh(.9, 200, 3000, .4), T30 + .15, -20, .1, .3)
add(slam(), CRASH2, -11, .5, .4); add(shatter(1.0, 30, .5), CRASH2 + .02, -19, .6, .5)
for k in range(5): add(blip(880 if k % 2 == 0 else 660), CRASH2 + .05 + k * .12, -22, .7, .3)
add(pop(), T31, -22, 0, .3); add(glide(lambda u: 2400 + 1300 * np.sin(u * np.pi), .1) * .4, T31 + .12, -29, -.4, .3); add(glide(lambda u: 2600 + 1200 * np.sin(u * np.pi), .08) * .4, T31 + .26, -30, -.4, .3)
exec(open('/data/yd/sfx_b.py').read())
exec(open('/data/yd/sfx_cf.py').read())
# ---------- reverb + master ----------
d = 1.8; IR = rng.standard_normal(int(d * SR)) * np.exp(-T(d) / .45); IR = band(IR, 200, 7000); IR /= np.sqrt(np.sum(IR ** 2))
L = N + len(IR); nf = 1 << (L - 1).bit_length()
for c in range(2):
    ir = np.roll(IR, c * 97); w = np.fft.irfft(np.fft.rfft(verb[c], nf) * np.fft.rfft(ir, nf), nf)[:N]; sfx[c] += w * .5
fade = np.clip((DUR - tt) / .3, 0, 1); sfx *= fade
mus *= np.clip((DUR - tt) / .3, 0, 1); mix = mus * 10 ** (-2 / 20) + sfx
def wr(p, a):
    a = np.clip(a, -1, 1); w = wave.open(p, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((a.T * 32767).astype(np.int16).tobytes()); w.close()
wr('/data/yd/yd_raw.wav', mix / max(1, np.max(np.abs(mix)) * 1.02))
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/data/yd/yd_raw.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', m)[-1]); g = -14 - I
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', '/data/yd/yd_raw.wav', '-af', f'volume={g + 0.1:.2f}dB,alimiter=limit=0.89:level=false', '-ar', '48000', '/data/yd/yd_a.wav'])
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/data/yd/yd_a.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('raw I', I, '| final', re.findall(r'I:\s+(-?[\d.]+) LUFS', m)[-1], 'LUFS, peak', re.findall(r'Peak:\s+(-?[\d.]+) dBFS', m)[-1])
mu = mus * 10 ** (-2 / 20)
for a, b in [(0, B2), (B2, B3), (B3, SLIP), (SLIP, TQ2), (TQ2, B5), (B5, Q(20)), (Q(20), Q(24)), (Q(24), Q(26)), (Q(26), Q(28)), (Q(28), Q(30)), (Q(30), PREV_END), (Q(32), Q(35)), (Q(35), Q(40)), (Q(40), Q(42)), (Q(42), Q(48)), (Q(48), Q(50)), (Q(50), Q(56)), (Q(56), Q(58)), (Q(58), Q(62)), (Q(62), Q(63)), (Q(63), Q(64))] + SEG_CF:
    i, j = int(a * SR), int(b * SR); r = lambda x: 20 * np.log10(np.sqrt(np.mean(x[:, i:j] ** 2)) + 1e-9)
    print(f'{a:6.2f}-{b:6.2f}  music {r(mu):6.1f}  sfx {r(sfx):6.1f}')
