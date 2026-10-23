# 《没有盖子的竹篓》full film 0–134.19s : music shaping + synced SFX → full_a.wav (−14 LUFS)
DUR = 134.19
exec(open('/data/crab/sfx_lib.py').read())
Q = bt; TE = Q(16.6); LT = [Q(17.5), Q(18), Q(18.5), Q(19)]; CLAMP = [Q(12.4), Q(12.55), Q(12.7)]
# ---- scene constants (mirrors the JS) ----
S1, S1E, S2, S2E, S3, S3E, WHY, PUSH = Q(32), Q(41), Q(44), Q(57.5), Q(60.5), Q(71), Q(73.5), .55
CHK = [S1E + 1.05, S2E + 1.05, S3E + 1.05]
SLAP1 = Q(33.5); S1LT = [Q(35.6), Q(39.4), Q(40.4)]
S2Q, S2UP, S2TB, S2WH, S2SIT, S2LIU, S2CAL, S2PRO = Q(45.3), Q(46.2), Q(47), Q(49), Q(51.5), Q(52), Q(53.5), Q(54.5)
S3SEND, S3READ, S3TYPE, S3STK, S3FLOOD, S3CAP = Q(61), Q(61.75), Q(62.15), Q(62.6), [Q(62.95), Q(63.2), Q(63.45), Q(63.7), Q(63.95)], Q(63.55)
S3MO, S3CNT, S3CMT, S3NO, S3CU = Q(64.5), Q(64.95), Q(65.6), Q(66.4), Q(67.5)
L1, L1R, L1SL, L1CH, L1BAR, L1CAP = Q(76.5), Q(78.2), Q(80.2), Q(81.5), [Q(82), Q(82.75), Q(83.5), Q(84.25), Q(85)], Q(86)
L2, L2B, L2SNAP, L2CUR, L2CLK, L2S, L2M, L2BUB, L2SNAPC, L2CAP = Q(88), [Q(89), Q(89.6)], Q(91.1), Q(91.8), Q(94), [Q(94.7), Q(95.4)], Q(96.3), [Q(96.8), Q(97.25), Q(97.7)], Q(99.3), Q(100.5)
L3, L3RISE, L3CU, L3W, L3S, L3OUT, BRK = Q(103), Q(105.1), [Q(107.5), Q(109.5), Q(111.5)], Q(113.5), [Q(114.5), Q(115.5)], Q(118.6), Q(120)
BK1, BKL, BKN, BKT, BKS, Z1, Z2, Z3, FIN = Q(124), Q(125), Q(125.3), Q(126), Q(126.8), Q(128), Q(140), Q(152), Q(160)
CMP_T0, CMP_N, DEL_T0 = Q(128.75), len('立个 flag：') + len('今年必须考下证！💪') + len('大家监督我！'), Q(131.3)
GHOST = [Q(130.45), Q(131.0)]; chkT = lambda d: Q(132.9) + 2.3 * (d / 22) ** .72
RPT, SCAN, RPOUT, KEEP, KEEPS = [Q(142), Q(143), Q(144), Q(145)], Q(146), Q(147.3), Q(148.2), Q(149)
Z3OUT, Z3NEW, Z3UP, Z3C1, Z3C2 = Q(153.2), Q(154.2), Q(155.2), Q(156), Q(156.9)
E_CAP, E_PUSH, GRIP, E_LAND, E_HAND, E_DORM, E_OUT, E_Q, E_SIGN, E_END = [Q(162), Q(164)], Q(165.4), Q(168), Q(169.4), Q(170), Q(171.5), Q(179), Q(181), Q(184.5), Q(188)
# ---------- music shaping ----------
def lpf(x, fc):
    X = np.fft.rfft(x, axis=1); f = np.fft.rfftfreq(x.shape[1], 1 / SR); return np.fft.irfft(X / (1 + (f / fc) ** 4), x.shape[1], axis=1)
m4, m10 = lpf(music, 380), lpf(music, 1100)
tt = np.arange(N) / SR
def ramp(pts): return np.interp(tt, [p[0] for p in pts], [p[1] for p in pts])
w4 = ramp([(0, 1), (Q(3.35), 1), (Q(4), 0), (Q(123.0), 0), (Q(123.9), .55), (BK1 - .005, .55), (BK1, 0), (999, 0)])
wF = ramp([(0, 0), (Q(7.8), 0), (Q(8.1), .45), (Q(13.9), .45), (Q(14.05), .15), (Q(16), .15), (TE - .01, 0), (TE, 1),
           (S1LT[0], 1), (S1LT[0] + .15, .7), (S1LT[1], .7), (S1LT[1] + .15, .45), (S1LT[2], .45), (S1LT[2] + .15, .3), (S1E, .3), (S1E + .4, 1),
           (S3CMT, 1), (S3NO, .3), (Q(69.55), .3), (Q(69.6), 1), (Q(123.0), 1), (Q(123.9), .45), (BK1 - .005, .45), (BK1, 1), (999, 1)])
w10 = 1 - w4 - wF
gain_dB = ramp([(0, -4), (Q(3), -3), (Q(3.35), 0), (Q(13.9), 0), (Q(14.05), -3), (Q(16), -5), (TE - .05, -24), (TE, 0),
                (S2Q, 0), (S2Q + .25, -11), (S2UP - .05, -11), (S2UP + .35, 0),
                (Q(123.5), 0), (BK1 - .03, -9), (BK1, 0), (Q(181), 0), (999, 0)])
mus = (m4 * w4 + m10 * w10 + music * wF) * 10 ** (gain_dB / 20)
# short ducks under the biggest hits (sidechain feel)
duck = np.zeros(N)
for t0, db, d in [(SLAP1, -4, .4), (Q(69.6), -4, .45), (L2SNAPC, -4, .4), (BK1, -6, .6), (BKT, -5, .6), (GRIP, -3, .5)]:
    i = int(t0 * SR); n = int(d * SR); duck[i:i + n] = np.minimum(duck[i:i + n], db * (1 - np.linspace(0, 1, len(duck[i:i + n]))) ** 1.5)
mus *= 10 ** (duck / 20)
mus *= np.minimum(1, (N - np.arange(N)) / (.3 * SR))
# ---------- opening (shared with sfx_open.py) ----------
exec(open('/data/crab/sfx_opening_cues.py').read())
# ---------- new synths ----------
def key(f=1.0): d = .05; return band(noise(d), 1800 * f, 7500) * dec(d, .006) + .35 * sine(700 * f, d) * dec(d, .01)
def bksp(): d = .05; return band(noise(d), 900, 4000) * dec(d, .008) + .4 * sine(420, d) * dec(d, .012)
def msg(f=1.0): d = .22; return sine(np.linspace(620 * f, 1240 * f, int(d * SR)), d) * env(d, [(0, 0), (.04, 1), (.35, .5), (1, 0)]) + .4 * sine(1860 * f, d) * dec(d, .05)
def sent(): return whoosh(.28, 900, 8000, .8) * .7
def bell(f=1568): d = 1.6; return sum(sine(f * m, d) * dec(d, .5 / (1 + i * .7)) * a for i, (m, a) in enumerate([(1, 1), (2.01, .5), (2.76, .35), (4.07, .2), (5.4, .1)]))
def alarm(f=2093): d = 1.2; x = bell(f)[:int(d * SR)] + .6 * bell(f * 1.5)[:int(d * SR)]; t = T(d); return x * (1 + .3 * np.sin(2 * np.pi * 14 * t))
def swell(d=1.6, root=220): t = T(d); e = env(d, [(0, 0), (.6, 1), (1, 0)]) ** 1.5; return sum(np.sin(2 * np.pi * root * r * t + i) / (1 + i * .5) for i, r in enumerate([1, 1.25, 1.5, 2, 2.5, 3])) * e
def scan(d=.9): t = T(d); return (sine(np.linspace(300, 2600, int(d * SR)), d) * .4 + band(noise(d), 2500, 9000) * .5) * env(d, [(0, 0), (.15, 1), (.8, .8), (1, 0)])
def whisper(d=.6): return band(noise(d), 2200, 7500) * env(d, [(0, 0), (.15, 1), (.7, .7), (1, 0)]) * (1 + .5 * np.sin(2 * np.pi * 6 * T(d)))
def flick(): d = .07; return band(noise(d), 1500, 6000) * dec(d, .015)
def lightoff(): d = .6; c = fit(band(noise(.03), 2000, 8000) * dec(.03, .004), d * SR); return c + .9 * sine(np.linspace(90, 40, int(d * SR)), d) * dec(d, .12)
def scrape(d=.4): return band(noise(d), 500, 3500) * env(d, [(0, 0), (.1, 1), (.6, .7), (1, 0)]) * (1 + .6 * np.sign(np.sin(2 * np.pi * 30 * T(d))))
# ---------- helpers ----------
def RISE(t0, g=-25, p=0): add(whoosh(.35, 700, 6000, .7), t0 - .12, g, p, .3)
def SLAM(t0, g=-11, big=False, p=0):
    add(whoosh(.3, 500, 6500, .85), t0 - .26, g - 8, p); add(slam(), t0, g, p, .35)
    if big: add(boom(70, 30, 1.4, .45), t0, g + 1, 0, .25)
def TYPE(t0, n, cps=14, g=-27, p=0, f=1.0):
    for i in range(n): add(key(f * (.9 + .2 * rng.random())), t0 + i / cps + .008 * rng.random(), g + 3 * rng.random(), p + .1 * (rng.random() - .5), .1)
def WHO(t0, p=0): add(pop(), t0, -22, p, .2)
def TAG(t0): add(blip(1200), t0, -26, -.6, .4)
def ROW(i, nx):  # scene i → row card → push into next scene
    a = [S1E, S2E, S3E][i]; add(whoosh(.6, 300, 4000, .6), a - .05, -17, 0, .3); add(thunk(), a + .55, -20, 0, .2)
    add(thud(), CHK[i], -15, 0, .3); add(ding(), CHK[i] + .02, -19, .3, .5); SLAM(CHK[i] + .2, -12)
    if nx: add(riser(PUSH + .1), nx - PUSH - .1, -19, 0, .2); add(whoosh(.5, 400, 7000, .6), nx - PUSH, -15, 0, .3); add(thud(), nx, -14, 0, .3)
# ---------- ④-1 宿舍 ----------
r = S1 + .1
while r < SLAP1 - .4: add(key(.8), r, -31 + 3 * rng.random(), -.2, .1); r += .09 + .12 * rng.random()
add(whoosh(.35, 200, 3000, .5), SLAP1 - .32, -15, .5); add(slap(), SLAP1, -8, .5, .3); add(thud(), SLAP1, -11, .5, .3); add(crack(), SLAP1 + .01, -22, .5, .3)
TAG(S1 + .25); WHO(Q(34), .5); SLAM(Q(34.25), -12, p=-.3); RISE(Q(34.85), -24, -.3)
for x in S1LT: add(lightoff(), x, -13, -.4, .3)
WHO(Q(35.95), -.4); TYPE(Q(36.05), len('今晚得做完……'), 7, -26, -.3)
WHO(Q(37.6), .5); RISE(Q(37.8), -24, -.3); SLAM(Q(38.5), -10, True, -.3)
for j, x in enumerate([39.5, 39.6, 39.8, 39.95, 40.15, 40.3, 40.45, 40.6]): add(whoosh(.2, 1500, 8000, .6), Q(x) - .1, -23 + rng.random() * 3, .8 - .2 * (j % 4), .2); add(blip(900 + 140 * (j % 5)), Q(x), -28, .6, .3)
ROW(0, S2)
# ---------- ④-2 会议室 ----------
TAG(S2 + .25); WHO(S2 + .3, -.2); RISE(S2 + .4, -25)
SLAM(S2Q, -12); add(tock(.6), S2Q + .45, -22, 0, .4); add(tock(.6), S2Q + .45 + .45, -24, 0, .4)
add(whoosh(.35, 300, 3500, .4), S2UP - .05, -17, -.3, .2); add(blip(880), S2UP + .3, -25, -.3, .3)
add(whoosh(.4, 200, 2500, .6), S2TB - .1, -15, 0, .3); add(thud(), S2TB, -18, 0, .3); add(grab(), S2TB + .55, -11, .2, .2); add(creak(.3), S2TB + .6, -21, .2, .2); add(grab(), S2TB + 1.15, -13, .2, .2)
WHO(S2WH + .1, .4)
for t0, s in [(Q(49.25), '坐下。'), (Q(49.95), '枪打出头鸟，'), (Q(50.75), '做砸了，你背锅。')]: add(whisper(.12 + len(s) / 14), t0, -23, .5, .4); TYPE(t0, len(s), 14, -30, .3)
add(whoosh(.6, 150, 1800, .3), S2SIT - .05, -16, -.3, .3); add(creak(.4), S2SIT + .35, -19, -.3, .3); add(thunk(), S2SIT + .5, -20, -.3, .2)
add(whoosh(.3, 400, 5000, .8), S2LIU - .2, -18, 0); WHO(Q(52.35), .3); add(whoosh(.35, 300, 4000, .5), Q(52.2), -17, .4, .2); SLAM(Q(52.55), -10, p=.3)
r, i = S2CAL + .05, 0
while r < S2CAL + .9: add(flick(), r, -20 + 2 * rng.random(), (rng.random() - .5) * .4, .2); r += .11 - .07 * min(1, (r - S2CAL) / .8); i += 1
SLAM(Q(54), -11)
add(shing(), S2PRO, -17, .3, .6); add(ding(), S2PRO + .05, -18, .3, .5); add(whoosh(.5, 400, 6000, .6), S2PRO - .15, -18, 0, .3); TAG(S2PRO + .1)
RISE(Q(55.0), -24); SLAM(Q(56.2), -10, True)
ROW(1, S3)
# ---------- ④-3 老友群 ----------
TAG(S3 + .25)
TYPE(S3 + .35, 10, 16, -29, .1, 1.3); add(sent(), S3SEND, -16, .3, .2); add(msg(1.0), S3SEND + .05, -17, .3, .3)
SLAM(S3READ, -13); add(blip(660), S3READ + .02, -22, 0, .3)
for k in range(3): add(blip(1000), S3TYPE + .14 * k, -30, -.3, .2)
add(pop(), S3STK, -18, -.3, .3)
for k, x in enumerate(S3FLOOD): add(msg(1.0 + .08 * k), x, -16 + k * .4, -.5 + .25 * k, .3)
SLAM(S3CAP, -13)
add(whoosh(.4, 400, 6000, .7), S3MO - .1, -17, 0, .3); TAG(S3MO + .1); add(blip(1320), S3CNT, -21, 0, .3); add(msg(.9), S3CMT, -16, .2, .3)
RISE(Q(65.95), -24); SLAM(S3NO, -10, True)
add(whoosh(.6, 150, 1800, .4), S3CU - .1, -18, 0, .4); add(hbeat(), S3CU + .3, -15, 0, .2); add(hbeat(), S3CU + 1.15, -16, 0, .2)
RISE(S3CU + .4, -25); RISE(Q(69), -24); add(suck(.35), Q(69.6) - .35, -18, 0, .2); SLAM(Q(69.6), -8, True)
ROW(2, None)
# ---------- ⑤ 为什么是身边人 ----------
add(whoosh(.7, 300, 5000, .5), WHY - .1, -15, 0, .4); add(drone(2.2), WHY, -21, 0, .5)
RISE(Q(73.95), -23); SLAM(Q(74.6), -12); SLAM(Q(75.25), -8, True)
def CHAP(t0): add(whoosh(.45, 400, 7000, .8), t0 - .32, -15, 0, .2); add(thud(), t0, -12, 0, .3); add(shing(), t0 + .02, -19, .2, .6)
CHAP(L1); add(thunk(), Q(77.55), -15, .2, .3); add(blip(420), Q(77.55), -20, .2, .3)
add(riser(.4), L1R - .4, -22, 0, .2); add(pop(), L1R, -17, 0, .3); add(whoosh(.8, 300, 4000, .4), L1R + .15, -22, 0, .3)
SLAM(L1SL, -11); add(whoosh(.4, 500, 6000, .7), L1CH - .05, -18, 0, .3); add(pop(), L1CH + .38, -18, 0, .3)
for k, x in enumerate(L1BAR): add(blip(660 * 2 ** (k * 3 / 12)), x, -19 + k, (k - 2) * .25, .3); add(riser(.15), x - .15, -26, (k - 2) * .25)
add(crack(), L1BAR[4] + .02, -14, .5, .4); add(alarm(2349), L1BAR[4] + .05, -20, .5, .5)
RISE(L1CAP, -24); SLAM(Q(86.9), -10, True)
CHAP(L2); RISE(L2 + .4, -25)
for x in L2B: add(pop(), x, -17, 0, .3)
add(snap(), L2SNAP, -16, -.4, .3); add(whoosh(.25, 900, 7000, .5), L2CUR, -26, 0, .2); add(click(), L2CLK, -9, -.3, .3); add(thunk(), L2CLK + .02, -16, -.3, .2)
SLAM(L2S[0], -12, p=-.3); SLAM(L2S[1], -11, p=.3)
add(whoosh(.4, 400, 6000, .7), L2M - .1, -18, 0, .3)
for k, x in enumerate(L2BUB): add(msg(.85 + .1 * k), x, -16, -.4 + .4 * k, .3)
add(whoosh(.18, 400, 5000, .9), L2SNAPC - .16, -14, 0); add(snap(), L2SNAPC, -6, 0, .3); add(crack(), L2SNAPC, -13, 0, .3); add(boom(80, 34, 1.0, .3), L2SNAPC, -9, 0, .3)
SLAM(L2CAP, -9, True)
CHAP(L3); add(swell(1.4, 196), L3 + .3, -24, 0, .5); RISE(L3 + 1.2, -25); RISE(Q(104.4), -25)
add(riser(L3CU[0] - L3RISE - .1), L3RISE, -21, 0, .3)
for i, x in enumerate(L3CU):
    p = [-.6, 0, .6][i]; add(alarm([2093, 2349, 2637][i]), x, -12, p, .5); add(crack(), x, -22, p, .3); WHO(x + .25, p)
    add(pop(), x + .12, -19, p, .3); TYPE(x + .35, 10, 22, -29, p)
add(riser(1.0), L3W, -19, 0, .3); [add(alarm(f), L3W + .2 + .15 * k, -24, (k - 1) * .5, .6) for k, f in enumerate([1760, 2093, 2637])]
SLAM(L3S[0], -12); SLAM(L3S[1], -9, True)
add(suck(BRK - L3OUT), L3OUT, -17, 0, .3); add(whoosh(.6, 200, 3000, .4), BRK - .2, -16, 0, .4)
# ---------- ⑥ 破局 ----------
for k, x in enumerate([BRK + .4, Q(121.2), Q(122), Q(122.7), Q(123.2), Q(123.6)]): add(hbeat(), x, -17 + 1.5 * k, 0, .2)
for k, x in enumerate([Q(121), Q(122), Q(123)]): add(grab(), x, -12 + 1.5 * k, -.2, .2); add(creak(.35), x + .03, -20 + k, -.2, .3); add(thunk(), x + .05, -18 + k, -.2, .2)
RISE(Q(120.8), -24); RISE(Q(122.2), -24); add(riser(.5), BK1 - .5, -16, 0, .2); add(suck(.45), BK1 - .45, -17, 0, .2)
add(crack(), BK1, -5, 0, .5); add(snap(), BK1, -7, 0, .4); add(boom(75, 30, 1.6, .5), BK1, -6, 0, .3); add(shatter(.8, 18, .5), BK1 + .02, -15, 0, .5); add(slam(), BK1, -11, 0, .3)
add(whoosh(.8, 300, 5000, .5), BK1 + .1, -14, -.3, .3); add(thud(), BKL, -11, -.3, .3); add(band(noise(.4), 200, 2000) * dec(.4, .1), BKL + .02, -22, -.3, .3)
add(tinkle(1.0, 14), BKN, -26, -.3, .8); add(blip(1760), BKN, -27, .5, .5)
add(whoosh(.4, 400, 7000, .85), BKT - .3, -14, 0); add(slam(), BKT, -7, 0, .4); add(boom(60, 28, 2.0, .7), BKT, -8, 0, .25); add(shing(), BKT + .02, -16, .3, .7)
RISE(BKS, -23)
add(whoosh(.5, 300, 6000, .6), Z1 - .15, -15, 0, .3); add(thud(), Z1, -15, 0, .3); add(pop(), Z1 + .1, -20, .3, .3)
TYPE(CMP_T0, CMP_N, 15, -22, -.4, 1.4)
for x in GHOST: add(whoosh(.35, 600, 4000, .5) * .6, x - .1, -24, .4, .5); add(msg(.7), x, -24, .4, .5)
r = DEL_T0
for i in range(CMP_N): add(bksp(), DEL_T0 + i / 30, -23 + 2 * rng.random(), -.4, .1)
add(swipe(), Q(132.3) - .05, -15, 0, .2)
scale = [0, 2, 4, 7, 9]
for d in range(23): add(blip(784 * 2 ** ((scale[d % 5] + 12 * (d // 5)) / 12 * .5)), chkT(d), -21 + d * .2, -.5 + d / 22, .3); add(tick(), chkT(d), -28, -.5 + d / 22)
add(shing(), chkT(22) + .15, -15, 0, .6); add(ding(), chkT(22) + .15, -17, 0, .5); add(whoosh(.6, 300, 3000, .4), chkT(22) + .1, -22, 0, .3)
RISE(Q(136.4), -23); SLAM(Q(137.3), -11)
add(swipe(), Z2 + .05, -15, 0, .2); add(thud(), Z2 + .1, -17, 0, .3); add(msg(1.1), Z2 + .5, -17, -.4, .3); add(tinkle(.8, 10), Z2 + .55, -25, -.4, .6)
for k, x in enumerate(RPT): add(msg([.8, .75, .7, 1.15][k]), x, -16, .2, .3); add(pop(), x + .02, -22, .2, .3)
add(scan(1.0), SCAN, -17, 0, .3)
for k in range(4): add(thunk() if k < 3 else ding(), SCAN + .3 + .18 * k, -19 if k < 3 else -17, .3, .3)
add(whoosh(.8, 150, 2000, .4), RPOUT, -16, .5, .4)
add(whoosh(.4, 500, 6000, .6), KEEP - .1, -18, 0, .3); add(shing(), KEEP + .1, -17, 0, .6); add(pop(), KEEP + .3, -16, 0, .3)
SLAM(KEEPS, -10, True)
add(whoosh(.5, 300, 6000, .6), Z3 - .15, -15, 0, .3); add(thud(), Z3, -15, 0, .3)
for k in range(3): add(whoosh(.45, 200, 2500, .5), Z3OUT + .12 * k, -19, .6 - .3 * k, .3)
for k in range(3): add(bell([1568, 1760, 2093][k]), Z3NEW + .15 * k, -20, -.5 + .5 * k, .6)
add(riser(.9), Z3UP - .9, -18, 0, .3); add(swell(1.6, 262), Z3UP - .2, -19, 0, .6); add(tinkle(1.4, 24), Z3UP + .05, -21, 0, .8); add(boom(90, 50, 1.0, .3), Z3UP, -17, 0, .3)
RISE(Z3C1, -23, -.4); SLAM(Z3C2, -11, p=.4)
add(riser(1.0), FIN - 1.0, -15, 0, .4); add(swell(1.8, 220), FIN - .7, -17, 0, .7)
# ---------- ⑦ 伸手 ----------
add(tinkle(1.6, 30), FIN, -20, 0, .8); add(boom(70, 40, 2.0, .7), FIN, -15, 0, .4)
add(scrape(.45), Q(163), -17, .1, .3); add(thunk(), Q(163) + .3, -19, .1, .2)
RISE(E_CAP[0], -23, .4); SLAM(E_CAP[1], -11, p=.4)
r = Q(164)
while r < E_PUSH: add(tick(), r, -30 + 2 * rng.random(), -.1, .15); r += .13
add(whoosh(1.2, 150, 2500, .5), E_PUSH, -19, 0, .4); add(hbeat(), Q(166.2), -17, 0, .2); add(hbeat(), Q(167.1), -16, 0, .2); add(riser(GRIP - Q(166.2)), Q(166.2), -21, 0, .3)
add(snap(), GRIP, -10, 0, .3); add(shing(), GRIP + .01, -14, 0, .7); add(swell(2.0, 220), GRIP - .1, -15, 0, .7); add(boom(80, 45, 1.2, .4), GRIP, -14, 0, .3)
add(whoosh(.9, 250, 4000, .5), GRIP + .15, -15, .2, .3); add(thud(), E_LAND, -12, .2, .3); add(pop(), E_LAND + .25, -16, 0, .4); add(tinkle(.9, 12), E_LAND + .3, -22, 0, .7)
add(whoosh(.5, 400, 7000, .6), E_HAND - .2, -15, 0, .3); add(boom(65, 35, 1.8, .6), E_HAND, -12, 0, .4); add(swell(2.2, 196), E_HAND - .1, -14, 0, .8); add(shing(), E_HAND + .03, -17, 0, .8)
add(whoosh(.5, 300, 5000, .5), E_DORM - .1, -18, 0, .4)
WHO(Q(172), .4); TYPE(Q(172.3), len('那个证……'), 7, -26, .4); TYPE(Q(173.1), len('你怎么复习的？'), 9, -26, .4)
WHO(Q(175.5) - .1, -.4); TYPE(Q(175.5), len('来，资料发你。'), 9, -26, -.4)
add(whoosh(.7, 500, 7000, .5), Q(176.5), -15, -.3, .3); add(pop(), Q(176.5) + .7, -15, .3, .3); add(sent(), Q(176.5) + .75, -19, .3, .3); add(blip(1568), Q(176.5) + .85, -19, .3, .4)
add(swell(2.0, 262), Q(177.3) - .1, -17, 0, .7); add(tinkle(1.4, 22), Q(177.3), -21, 0, .8)
# question card in near-silence: room tone + typewriter + low pulse under "钳子"
add(band(noise(E_END - E_Q + 1), 60, 700) * env(E_END - E_Q + 1, [(0, 0), (.1, 1), (.85, 1), (1, 0)]), E_Q - .5, -42, 0, .1)
TYPE(E_Q, len('你有没有，当过别人的那只钳子？'), 8, -19, 0, .8)
add(boom(60, 35, 1.6, .5), E_Q + 12 / 8, -16, 0, .5); add(hbeat(), E_Q + 12 / 8 + .9, -19, 0, .3)
add(bell(1046), E_SIGN, -22, 0, .8); add(bell(1568), E_SIGN + .25, -27, .3, .8)
# ---------- reverb + master ----------
d = 1.6; IR = rng.standard_normal(int(d * SR)) * np.exp(-T(d) / .35); IR = band(IR, 200, 7000); IR /= np.sqrt(np.sum(IR ** 2))
L = N + len(IR); nf = 1 << (L - 1).bit_length()
for c in range(2):
    ir = np.roll(IR, c * 97); w = np.fft.irfft(np.fft.rfft(verb[c], nf) * np.fft.rfft(ir, nf), nf)[:N]; sfx[c] += w * .5
sfx *= np.minimum(1, (N - np.arange(N)) / (.15 * SR))
mix = mus * 10 ** (-2 / 20) + sfx
def wr(p, a):
    a = np.clip(a, -1, 1); w = wave.open(p, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((a.T * 32767).astype(np.int16).tobytes()); w.close()
wr('/data/crab/full_raw.wav', mix / max(1, np.max(np.abs(mix)) * 1.02))
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/data/crab/full_raw.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', m)[-1]); g = -14 - I
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', '/data/crab/full_raw.wav', '-af', f'volume={g + 0.1:.2f}dB,alimiter=limit=0.89:level=false', '-ar', '48000', '/data/crab/full_a.wav'])
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/data/crab/full_a.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('raw I', I, '| final', re.findall(r'I:\s+(-?[\d.]+) LUFS', m)[-1], 'LUFS, peak', re.findall(r'Peak:\s+(-?[\d.]+) dBFS', m)[-1])
mu = mus * 10 ** (-2 / 20)
for a, b in [(0, Q(16)), (Q(16), Q(32)), (S1, S1E), (S2, S2E), (S3, S3E), (WHY, L2), (L2, L3), (L3, BRK), (BRK, Z1), (Z1, Z2), (Z2, Z3), (Z3, FIN), (FIN, E_HAND), (E_HAND, E_OUT), (E_Q, DUR - .1)]:
    i, j = int(a * SR), int(b * SR); r = lambda x: 20 * np.log10(np.sqrt(np.mean(x[:, i:j] ** 2)) + 1e-9)
    print(f'{a:6.2f}-{b:6.2f}  music {r(mu):6.1f}  sfx {r(sfx):6.1f}')
