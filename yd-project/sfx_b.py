# ================= SECTION B · 崩盘现场 Q32–Q64 (exec'd from sfx_yd.py) =================
BEAT = 60 / 84.15; B_0 = Q(32); TRD = .58; B_END = Q(64)
clampf = lambda x, a=0., b=1.: min(b, max(a, x)); invf = lambda a, b, v: clampf((v - a) / (b - a))
ioS = lambda x: x * x * (3 - 2 * x); outC = lambda x: 1 - (1 - x) ** 3; ioC = lambda x: 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2; inC = lambda x: x ** 3
# ---------- extra synths ----------
def tinnitus(d=2.2, f=5400): t = T(d); return (sine(f, d) + .25 * sine(f * 1.47, d)) * env(d, [(0, 0), (.02, 1), (.25, .55), (1, 0)]) ** 1.3
def paperslap(): d = .35; return band(noise(d), 500, 7000) * dec(d, .035) * 1.2 + .7 * sine(np.linspace(160, 70, int(d * SR)), d) * dec(d, .06)
def knock(f=170): d = .18; return sine(np.linspace(f * 1.4, f, int(d * SR)), d) * dec(d, .035) + .5 * band(noise(d), 700, 3500) * dec(d, .012)
def dust(d=1.1):
    t = T(d); x = lp1(noise(d), 300 + 2500 * np.exp(-t / .2)) * env(d, [(0, 0), (.03, 1), (.3, .5), (1, 0)])
    cr = np.zeros(len(t)); 
    for i in rng.integers(0, int(len(t) * .7), 90): cr[i:i + 200] += rng.standard_normal(len(cr[i:i + 200])) * np.exp(-np.arange(len(cr[i:i + 200])) / 30)
    return x * 1.5 + band(cr, 1500, 8000) * .6 * np.exp(-t / .4)
def errding(): d = .55; return (sine(988, d) + .4 * sine(1976, d)) * dec(d, .16) + fit(.8 * (sine(740, d) + .3 * sine(1480, d)) * dec(d, .2), int(d * SR)) * (T(d) > .09)
def scribble(d):
    t = T(d); am = np.abs(np.sin(2 * np.pi * 8.5 * t + 1.3 * np.sin(2 * np.pi * 2.1 * t))) ** .6 * (1 + .4 * rng.standard_normal(len(t)).clip(-1, 1))
    return band(noise(d), 1400, 7000) * am * env(d, [(0, 0), (.04, 1), (.9, 1), (1, 0)])
def stampS(): d = .5; return boom(120, 50, d, .08) + .9 * band(noise(d), 200, 2600) * dec(d, .045) + .4 * band(noise(d), 2000, 8000) * dec(d, .01)
def footstep(): d = .3; return band(noise(d), 50, 500) * dec(d, .05) + .6 * sine(np.linspace(110, 60, int(d * SR)), d) * dec(d, .06) + .3 * band(noise(d), 1500, 5000) * dec(d, .008)
def sizzle(d):
    t = T(d); g = (rng.random(len(t)) > .965).astype(float); cr = band(g * rng.standard_normal(len(t)), 2500, 11000)
    return (cr * 1.4 + .25 * band(noise(d), 4000, 12000)) * env(d, [(0, 0), (.1, 1), (.8, .8), (1, 0)])
def notifding(): d = .6; return (sine(1568, d) * dec(d, .12) + fit(sine(2093, d) * dec(d, .2), int(d * SR)) * (T(d) > .1)) + .2 * sine(3136, d) * dec(d, .05)
def rip(): d = .45; t = T(d); return (band(noise(d), 1500, 9000) * (1 + .8 * np.sin(2 * np.pi * 70 * t)) + .5 * sine(np.linspace(2200, 500, len(t)), d)) * env(d, [(0, 0), (.03, 1), (.4, .7), (1, 0)])
def keyclick(f=1300): d = .09; return band(noise(d), 1800, 8000) * dec(d, .005) + .6 * sine(f, d) * dec(d, .01) + .7 * sine(np.linspace(260, 160, int(d * SR)), d) * dec(d, .02)
def fizzle(fc=8000): d = .32; t = T(d); x = (band(noise(d), 600, 9000) * (rng.random(len(t)) > .5) + .6 * (((t * 140) % 1) * 2 - 1)) * env(d, [(0, 0), (.02, 1), (.3, .6), (1, 0)]) + .5 * sine(np.linspace(900, 200, len(t)), d) * dec(d, .08); return band(x, 80, fc)
def hum(d=.5, f0=118):
    t = T(d); f = f0 * (1 + .025 * np.sin(2 * np.pi * 5.5 * t)) * np.linspace(1.04, .96, len(t)); ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k ** 1.1 for k in range(1, 14)); x = band(x, 90, 1100) + .3 * band(x, 2200, 3200)
    return x * env(d, [(0, 0), (.12, 1), (.7, .8), (1, 0)])
def feedback(d): t = T(d); return (sine(2860 + 25 * np.sin(2 * np.pi * 3 * t), d) + .3 * sine(5720, d)) * env(d, [(0, 0), (.7, .35), (1, 1)]) ** 2
def cough(): d = .5; x = band(noise(d), 250, 2600) * env(d, [(0, 0), (.02, 1), (.18, .2), (.26, 0), (1, 0)]); x += .6 * fit(band(noise(.2), 300, 2200) * dec(.2, .04), int(d * SR)) * (T(d) > .3); return x
def buzzloop(d): t = T(d); return band(((t * 50) % 1) * 2 - 1, 60, 900) * (1 + .3 * np.sin(2 * np.pi * 2.78 * t))
# ---------- music shaping (replace from B_0 on) ----------
mM = lpf(music, 2600)
CS = [(Q(32), Q(35)), (Q(40), Q(42)), (Q(48), Q(50)), (Q(56), Q(58))]
p4, pM, pG = [(0, 0)], [(0, 0)], [(0, 0)]
for ci, (S, Hh) in enumerate(CS):
    E8 = S + 8 * BEAT
    p4 += [(S, 0), (Hh - .01, 0), (Hh, 1), (Hh + BEAT * .9, 1), (Hh + BEAT * 1.6, 0)]
    pM += [(S, 0), (Hh + BEAT * .9, 0), (Hh + BEAT * 1.6, 1)] + ([(E8 - .25, 1), (E8 - .02, 0)] if ci < 3 else [])
    pG += [(S + (.3 if ci == 0 else .05), -3.5), (Hh - .03, -3), (Hh, -12), (Hh + BEAT * 1.6, -5)] + ([(E8 - .3, -5), (E8 - .02, -1.5)] if ci < 3 else [])
FRZ = Q(63)
p4 += [(Q(62) - .01, 0), (Q(62) + .05, 1), (99, 1)]; pM += [(Q(62) - .01, 1), (Q(62) + .05, 0), (99, 0)]
pG += [(Q(61.85), -5), (Q(62), -10), (Q(62.6), -18), (FRZ - .04, -26), (FRZ, -70), (99, -70)]
pG[0] = (0, 0); p4[0] = (0, 0); pM[0] = (0, 0)
W4b, WMb, Gb = ramp(p4), ramp(pM), ramp(pG); WFb = np.clip(1 - W4b - WMb, 0, 1)
musB = (m4 * W4b + mM * WMb + music * WFb) * 10 ** (Gb / 20)
iB = int(B_0 * SR); xf = int(.03 * SR); w = np.linspace(0, 1, xf)
mus[:, iB:iB + xf] = mus[:, iB:iB + xf] * (1 - w) + musB[:, iB:iB + xf] * w; mus[:, iB + xf:] = musB[:, iB + xf:]
# freeze stutter: replay a 0.1 s music chunk at the start of every 0.36 s cycle
ck = music[:, int((FRZ - .12) * SR):int((FRZ - .02) * SR)] * 10 ** (-12 / 20); fw = np.ones(ck.shape[1]); k8 = int(.006 * SR); fw[:k8] = np.linspace(0, 1, k8); fw[-k8:] = np.linspace(1, 0, k8); ck = ck * fw
c0 = FRZ
while c0 < Q(64) - .05:
    i = int(c0 * SR); n = min(ck.shape[1], N - i)
    if n > 0: mus[:, i:i + n] += ck[:, :n]
    c0 += .36
# hit ducks
for t0 in [Q(35), Q(42), Q(50), Q(58), Q(52), Q(61.85)]:
    i = int(t0 * SR); n = int(.5 * SR); mus[:, i:i + n] *= 10 ** ((-4 * (1 - np.linspace(0, 1, len(mus[0, i:i + n]))) ** 1.5) / 20)
# ---------- heartbeat stream (port of bpmB / PHASE) ----------
CASESP = [(Q(32), Q(35), 78, 152), (Q(40), Q(42), 84, 158), (Q(48), Q(50), 82, 164), (Q(56), Q(58), 88, 172)]
def cidx(t): return 3 if t >= Q(56) else 2 if t >= Q(48) else 1 if t >= Q(40) else 0
def bpmP(t):
    i = cidx(t); t0, hit, b0, b1 = CASESP[i]; prev = 166 if i == 0 else CASESP[i - 1][3]; ts = B_0 + TRD if i == 0 else t0 + .06
    b = b0 + (b1 - b0) * outC(clampf((t - hit) / .5)) if t >= hit else prev + (b0 - prev) * ioC(invf(ts, ts + .5, t))
    if i == 3: b += 22 * inC(invf(Q(59), Q(63), t))
    return b
ph, tq, last = 0.0, B_0, 0
while tq < FRZ:
    ph += bpmP(tq) / 60 / 240; tq += 1 / 240
    if int(ph) > last:
        last = int(ph); i = cidx(tq); hit = CASESP[i][1]; post = tq >= hit
        gdb = (-15 if post else -26) + (3 if i == 3 and tq > Q(59) else 0)
        add(hbeat(), tq, gdb, 0, .12)
# ---------- transition + case tags ----------
add(whoosh(.55, 250, 6000, .45), B_0 + .02, -15, .3, .3); add(glitch(.22), B_0, -20, 0, .3)
add(thunk(), B_0 + TRD, -18, .6, .3); add(click(), B_0 + TRD, -22, .6, .2)
for i, (st, nm) in enumerate([(B_0 + TRD * .7, 4), (Q(40) + .04, 6), (Q(48) + .04, 6), (Q(56) + .04, 6)]):
    add(pop(), st, -20, -.6, .3); add(thunk(), st + .02, -22, -.6, .2)
    for c in range(1, nm + 1): add(tick(), st + .1 + .34 * c / nm, -27, -.6, .2)
    add(whoosh(.25, 2000, 9000, .3), st + .3, -29, -.6, .3)
for c in (Q(40), Q(48), Q(56)): add(glitch(.24), c - .2, -19, 0, .3); add(whoosh(.3, 300, 7000, .85), c - .27, -17, 0, .3); add(boom(80, 40, .6, .2), c, -17, 0, .3)
# ---------- CASE 01 · 考场失忆 ----------
add(band(noise(Q(35.5) - B_0), 100, 800) * env(Q(35.5) - B_0, [(0, 0), (.1, 1), (1, 1)]), B_0, -36, 0, .5)  # hall air
for k in range(5): add(tick(), Q(32.4) + k * BEAT * .5, -31, .5, .3)                                      # wall clock
add(neon(), Q(32.15), -20, .3, .4); add(sparkle(.6, 14), Q(32.2), -28, .3, .6)
add(stampS(), Q(33.3), -12, .35, .4); add(shing(), Q(33.32), -24, .35, .7)
add(whoosh(.2, 500, 7000, .85), Q(34) - .19, -19, 0, .2); add(paperslap(), Q(34), -11, 0, .35); add(boom(80, 40, .6, .2), Q(34), -18, 0, .3)
add(whoosh(.32, 200, 4000, .9), Q(35) - .3, -17, 0, .3); add(boom(70, 30, 1.8, .6), Q(35), -9, 0, .5); add(hbeat(), Q(35), -10, 0, .2)
add(tinnitus(2.6), Q(35) + .02, -21, 0, .3); add(glitch(.25), Q(35), -19, 0, .3); add(swell(1.2, 98), Q(35), -22, 0, .6)
add(whoosh(.35, 300, 6000, .8), Q(35.5) - .25, -19, 0, .3)
add(boom(60, 30, 1.0, .4), Q(36), -14, 0, .4); add(crack(), Q(36), -19, 0, .4)
for j, t0 in enumerate([Q(36.5), Q(37), Q(37.5)]):
    for k in range(8): add(knock(150 + 25 * rng.random()), t0 + k * .045 + rng.uniform(0, .01), -17 + k * .3, -.8 + j * .25 + k * .06, .3)
    add(thunk(), t0 + .38, -18, -.5 + j * .3, .3)
add(rumble(Q(38) - Q(37.55)) * env(Q(38) - Q(37.55), [(0, 0), (1, 1)]) ** 1.5, Q(37.55), -20, 0, .2); add(riser(Q(38) - Q(37.55)), Q(37.55), -22, 0, .3)
add(dust(1.2), Q(38), -12, 0, .4); add(boom(65, 30, 1.2, .45), Q(38), -13, 0, .5)
for k in range(3): add(errding(), Q(38 + k / 3) + .01, -15 + k, -.15 + k * .15, .3)
add(scribble(Q(39.5) - Q(39) + .05), Q(39), -16, -.1, .2)
for k in range(4): add(tick(), Q(39) + k * BEAT / 4, -24, .5, .2)
add(thunk(), Q(39.5), -12, 0, .4); add(boom(55, 28, 1.2, .5), Q(39.5), -14, 0, .5); add(glitch(.2), Q(39.5), -21, 0, .3)
# ---------- CASE 02 · 领导站你身后 ----------
add(band(noise(Q(48) - Q(40)), 100, 700) * env(Q(48) - Q(40), [(0, 0), (.05, 1), (1, 1)]), Q(40), -35, 0, .4)  # office room tone
TL2 = Q(40) + .1; TL3 = TL2 + 19 / 26
TAPS = [TL2 + i / 26 for i in range(19)] + [TL3 + i / 26 for i in range(7)] + [Q(42) + .04 + (i + .5) / 14 * .62 + rng.uniform(-.015, .015) for i in range(14)]
for t0 in TAPS: add(tap(), t0, -25 + rng.uniform(-2, 1), .05 + rng.uniform(-.15, .15), .15)
add(footstep(), Q(41) - .02, -16, .55, .3); add(footstep(), Q(41) + .33, -17, .45, .3); add(whoosh(.5, 120, 1500, .6), Q(41) - .1, -20, .5, .3)
add(bigblink(), Q(41.15), -16, .4, .5); add(thunk(), Q(41.2), -22, 0, .2)
add(pop(), Q(41.5), -17, .4, .3)
add(whoosh(.3, 200, 4000, .9), Q(42) - .27, -17, 0, .3); add(boom(70, 30, 1.8, .6), Q(42), -9, 0, .5); add(hbeat(), Q(42), -10, 0, .2)
add(tinnitus(2.4, 5800), Q(42) + .02, -21, 0, .3); add(glitch(.25), Q(42), -19, 0, .3)
BS = [Q(43) + i * BEAT / 4 for i in range(6)]
for i, t0 in enumerate(BS): add(keyclick(900), t0, -10 + i * .3, -.1, .2); add(boom(95, 40, .45, .12), t0, -12 + i * .4, 0, .3); add(stampS(), t0, -18, 0, .2)
add(sizzle(Q(44.5) - Q(43.35)), Q(43.35), -21, .1, .3)
for k in range(46): add(tick(), BS[0] + (Q(44.3) - BS[0]) * (1 - (1 - (k + 1) / 46) ** .33), -32, .6, .1)
for i in range(17): add(tap(), Q(44.5) + .05 + .5 * (i + .5) / 17, -21, .1, .15)
add(stampS(), Q(45), -10, .1, .4); add(boom(70, 34, 1.2, .4), Q(45), -14, 0, .5); add(glitch(.2), Q(45), -20, 0, .3)
add(whoosh(.35, 200, 5000, .85), Q(46) - .3, -18, 0, .3); add(boom(60, 30, 1.0, .4), Q(46), -17, .3, .4)
add(bigblink(), Q(46.5), -13, .3, .5); add(pop(), Q(47), -16, .1, .3)
add(glide(lambda u: 900 - 650 * u, .32) * .6, Q(47.25), -21, -.4, .3); add(blip(1900), Q(47.4) + .15, -25, -.4, .4)
add(glitch(.2), Q(47.75), -20, 0, .3)
# ---------- CASE 03 · 做图毁于微操 ----------
an_prev = None
for s_ in np.arange(Q(48), Q(49), 1 / 240):
    fr = .62 + .38 * ioS(invf(Q(48), Q(49), s_)); an = int(fr * 30) + 1
    if an_prev is not None and an > an_prev: add(tick(), s_, -24, -.2, .2); add(blip(2400), s_, -33, -.2, .2)
    an_prev = an
add(whoosh(.45, 200, 5000, .7), Q(49) - .08, -15, 0, .3); add(swell(1.0, 165), Q(49), -24, 0, .6)
add(pop(), Q(49.35), -19, 0, .3)
add(riser(Q(52) - Q(50)), Q(50), -18, 0, .3); add(rumble(Q(52) - Q(50)) * env(Q(52) - Q(50), [(0, 0), (1, 1)]) ** 2, Q(50), -19, 0, .2)
add(notifding(), Q(50), -12, .6, .4); add(boom(70, 30, 1.6, .5), Q(50), -11, 0, .5); add(hbeat(), Q(50), -11, 0, .2); add(tinnitus(2.0, 5100), Q(50) + .02, -23, 0, .3)
add(notifding(), Q(51), -13, .6, .4); add(notifding(), Q(51.5), -12, .6, .4); add(notifding(), Q(51.5) + .14, -15, .6, .4)
add(rip(), SLIP3 if 'SLIP3' in globals() else Q(52), -9, 0, .3); add(slam(), Q(52) + .02, -10, 0, .4); add(snap(), Q(52), -13, 0, .3); add(glitch(.3), Q(52), -16, 0, .3)
add(whoosh(.4, 300, 6000, .4), Q(52) + .1, -19, 0, .3)
add(whoosh(.3, 200, 4000, .85), Q(53) - .1, -19, 0, .3); add(thunk(), Q(53) + .2, -18, 0, .3)
UNDO = [Q(53) + .08 + (Q(55.3) - Q(53) - .08) * np.sqrt(i / 36) for i in range(37)]
for i, t0 in enumerate(UNDO): add(keyclick(1100 + i * 18), t0, -16 + i * .08, (-.15 if i % 2 else .15), .15)
add(thunk(), Q(55.3), -13, 0, .4); add(boom(60, 30, 1.0, .4), Q(55.3), -15, 0, .4)
for k, f in enumerate([880, 660, 440]): add(blip(f), Q(55.3) + .05 + k * .1, -20, 0, .4)
add(glitch(.2), Q(55.75), -19, 0, .3)
SLIP3 = Q(52)
# ---------- CASE 04 · 重要汇报哑火 ----------
add(crowd(Q(58) - Q(56)) * env(Q(58) - Q(56), [(0, 0), (.1, 1), (.95, 1), (1, 0)]), Q(56), -29, 0, .6)
add(band(noise(Q(64) - Q(56)), 80, 600) * env(Q(64) - Q(56), [(0, 1), (.97, 1), (1, 0)]), Q(56), -37, 0, .6)
for t0 in (Q(56.5), Q(57), Q(57.5)): add(tick(), t0 - .02, -21, -.4, .2); add(swipe(), t0, -20, .3, .3)
add(glide(lambda u: 400 + 900 * u, .3) * .5, Q(57), -27, .3, .3); add(pop(), Q(57) + .32, -25, .5, .3)
add(pop(), Q(57.5) + .05, -22, 0, .3)
add(whoosh(.3, 200, 4000, .9), Q(58) - .27, -17, 0, .3); add(boom(70, 30, 1.8, .6), Q(58), -9, 0, .5); add(hbeat(), Q(58), -10, 0, .2)
add(tinnitus(2.6, 5600), Q(58) + .02, -21, 0, .3); add(bigblink(), Q(58) + .02, -14, 0, .5)
for j in range(36): add(blink(), Q(58) + .02 + rng.uniform(0, .26), -26, rng.uniform(-.9, .9), .4)
add(pop(), Q(58.35), -22, 0, .3)
add(whoosh(.35, 300, 6000, .85), Q(59) - .28, -18, 0, .3); add(swell(3.0, 110), Q(59), -23, 0, .6); add(drone(3.0), Q(59), -25, 0, .4)
DT = [Q(59.1) + (Q(61.5) - Q(59.1)) * (i / 22) ** .62 for i in range(23)]
for i, t0 in enumerate(DT):
    add(fizzle(9000 * (1 - i / 22) + 900), t0, -16 - i * .1, rng.uniform(-.7, .7), .3); add(blip(2200 - i * 50), t0 + .02, -31, 0, .2)
add(riser(.36), Q(61.5), -17, 0, .3); add(rumble(.4) * env(.4, [(0, 0), (1, 1)]) ** 2, Q(61.5), -18, 0, .2)
add(shatter(1.2, 40, .6), Q(61.85), -11, 0, .5); add(boom(80, 30, 1.6, .5), Q(61.85), -9, 0, .5); add(glitch(.25), Q(61.85), -17, 0, .3); add(shing(), Q(61.86), -21, 0, .7)
add(boom(50, 28, 1.4, .5), Q(62), -17, 0, .5)
add(hum(.55, 120), Q(62.05), -19, 0, .25); add(hum(.4, 112), Q(62.6), -22, 0, .25)
for c in range(1, 4): add(tick(), Q(62.05) + .22 * c / 3, -28, 0, .1)
for c in range(1, 5): add(tick(), Q(62.6) + .22 * c / 4, -28, 0, .1)
add(feedback(FRZ - Q(62.3)), Q(62.3), -22, .2, .3); add(cough(), Q(62.85), -25, .75, .6)
add(tapestop(.3), FRZ, -14, 0, .3); add(glitch(.18), FRZ, -16, 0, .3)
c0 = FRZ
while c0 < Q(64) - .05: add(glitch(.1), c0, -20, 0, .2); add(hum(.1, 120), c0, -27, 0, .1); c0 += .36
add(buzzloop(Q(64) - FRZ) * env(Q(64) - FRZ, [(0, 0), (.1, 1), (.97, 1), (1, 0)]), FRZ, -31, 0, .1)
