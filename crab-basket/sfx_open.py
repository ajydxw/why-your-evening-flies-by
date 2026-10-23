# 《没有盖子的竹篓》opening 0–23.5s : music shaping + synced SFX → open_a.wav (−14 LUFS)
exec(open('/data/crab/sfx_lib.py').read())
Q = bt; TE = Q(16.6); LT = [Q(17.5), Q(18), Q(18.5), Q(19)]; CLAMP = [Q(12.4), Q(12.55), Q(12.7)]
# ---------- music: muffled → opening → duck → full ----------
def lpf(x, fc):
    X = np.fft.rfft(x, axis=1); f = np.fft.rfftfreq(x.shape[1], 1 / SR); return np.fft.irfft(X / (1 + (f / fc) ** 4), x.shape[1], axis=1)
m4, m10 = lpf(music, 380), lpf(music, 1100)
tt = np.arange(N) / SR
def ramp(pts): return np.interp(tt, [p[0] for p in pts], [p[1] for p in pts])
w4 = ramp([(0, 1), (Q(3.35), 1), (Q(4), 0)])
wF = ramp([(0, 0), (Q(7.8), 0), (Q(8.1), .45), (Q(13.9), .45), (Q(14.05), .15), (Q(16), .15), (TE - .01, 0), (TE, 1), (99, 1)])
w10 = 1 - w4 - wF
gain_dB = ramp([(0, -4), (Q(3), -3), (Q(3.35), 0), (Q(13.9), 0), (Q(14.05), -3), (Q(16), -5), (TE - .05, -24), (TE, 0), (99, 0)])
mus = (m4 * w4 + m10 * w10 + music * wF) * 10 ** (gain_dB / 20)
fade = np.ones(N); i0 = int(23.0 * SR); fade[i0:] = np.linspace(1, 0, N - i0) ** 2; mus *= fade
# ---------- extra synths ----------
def hbeat(): d = .7; x = sine(np.linspace(70, 40, int(d * SR)), d) * dec(d, .08, .004) + .5 * band(noise(d), 20, 160) * dec(d, .04); y = np.zeros_like(x); k = int(.17 * SR); y[k:] = x[:-k] * .6; return x + y
def grab(): d = .25; return band(noise(d), 400, 4000) * dec(d, .012) * 1.2 + sine(np.linspace(180, 90, int(d * SR)), d) * dec(d, .05)
def slap(): d = .3; return band(noise(d), 600, 7000) * dec(d, .01) * 1.5 + .6 * sine(np.linspace(240, 110, int(d * SR)), d) * dec(d, .04)
def ding(): d = 1.0; return sine(1318, d) * dec(d, .35) + .5 * sine(1976, d) * dec(d, .22) + .25 * sine(2637, d) * dec(d, .1)
def snap(): d = .2; return band(noise(d), 1800, 9000) * dec(d, .004) * 1.4 + .8 * sine(np.linspace(1400, 600, int(d * SR)), d) * dec(d, .01) + .6 * sine(140, d) * dec(d, .04)
def creak(d=.35): t = T(d); return band(noise(d) * (1 + np.sign(np.sin(2 * np.pi * (38 + 25 * t / d) * t))), 300, 2400) * env(d, [(0, 0), (.1, 1), (.7, .8), (1, 0)])
def thud(): return boom(95, 45, .5, .09) + .3 * band(noise(.5), 80, 900) * dec(.5, .03)
# ---------- A/B: hand reaching for the light ----------
for k, gn in zip([0, 1, 2, 2.5], [-11, -10, -9, -8]): add(hbeat(), Q(k), gn, 0, .15)
add(riser(Q(3) - Q(1)), Q(1), -17, 0, .3)
for d, p in [(-.03, -.55), (0, .55), (.035, 0)]: add(whoosh(.18, 300, 4000, .8), Q(3) + d - .16, -20, p); add(grab(), Q(3) + d, -9, p, .2)
add(creak(.3), Q(3) + .06, -22, 0, .2)
add(whoosh(.42, 200, 3000, .25), Q(3.35) - .04, -9, 0, .2); add(boom(80, 34, 1.0, .3), Q(3.35), -8, 0, .2)
# ---------- C: basket ----------
add(whoosh(.35, 400, 6000, .85), Q(4) - .3, -15, 0); add(thud(), Q(4), -12, 0, .4); add(shing(), Q(4), -21, .2, .6)
r = Q(4) + .05
while r < Q(7.6): add(tap(), r, -27 + 3 * rng.random(), (rng.random() - .5) * .5, .25); r += .05 + .09 * rng.random()
for k, gn in [(4.5, -18), (5, -13), (5.5, -18), (6, -13), (6.5, -18)]: add(thunk(), Q(k), gn, (rng.random() - .5) * .3, .3); add(creak(.22), Q(k) + .02, gn - 10, 0, .2)
add(whoosh(.8, 200, 2500, .55), Q(7) - .05, -12, 0, .2); add(thud(), Q(7.75), -12, 0, .4)
add(whoosh(.3, 500, 6500, .85), Q(8) - .26, -18, 0); add(slam(), Q(8), -10, 0, .4)
# ---------- D/E: climb, clamp, yank ----------
add(blip(1500), Q(10), -22, .7, .5)
r = Q(10)
while r < Q(12): q = (r - Q(10)) / (Q(12) - Q(10)); add(tap(), r, -24 + 5 * q, -.25 + .5 * rng.random(), .25); r += .11 - .05 * q
add(crack(), Q(12), -16, 0, .4); add(creak(.4), Q(12) + .03, -18, 0, .3)
r, n = Q(12) + .05, 0
while r < Q(13) - .04: q = (r - Q(12)) / (Q(13) - Q(12)); add(tick(), r, -24 + 6 * q, .65, .2); r += .085 - .055 * q
for i, p in enumerate([-.5, .5, 0]): add(snap(), CLAMP[i], -10, p, .3); add(thunk(), CLAMP[i] + .01, -17, p, .2)
add(whoosh(.45, 200, 3500, .3), Q(13) - .08, -10, 0, .2); add(boom(85, 34, 1.2, .35), Q(13), -7, 0, .3); add(slam(), Q(13), -10, 0, .4)
add(blip(330), Q(13), -14, .65, .4); add(blip(247), Q(13) + .09, -16, .65, .4); add(thud(), Q(13) + .3, -14, 0, .3)
# ---------- F: slow-mo "是同伴" ----------
add(tapestop(.45), Q(14) - .12, -15, 0, .3); add(drone(2.6), Q(14), -11, 0, .6)
add(whoosh(.5, 300, 3000, .6), Q(14) - .1, -22, -.4, .3)
for i, p in enumerate([-.4, .4, 0]): add(boom(120, 60, .7, .2), Q(14) + .5 * i, -15, p, .5); add(ping(), Q(14) + .5 * i, -24, p, .7)
add(slam(), Q(15), -7, -.3, .5); add(boom(48, 26, 1.8, .7), Q(15), -10, 0, .2)
# ---------- G: crack → shatter → title ----------
add(riser(TE - Q(16) + .08), Q(16) - .08, -12, 0, .3); add(suck(TE - Q(16)), Q(16), -15, 0, .2)
add(crack(), Q(16) + .03, -15, .3, .5); add(crack(), Q(16) + .22, -17, .5, .5)
add(shatter(), TE, -7, .2, .7); add(boom(60, 28, 2.0, .7), TE, -6, 0, .2); add(crack(), TE, -10, .3, .4); add(tinkle(1.2, 30), TE + .25, -21, 0, .8)
add(whoosh(.7, 400, 7000, .2), TE + .05, -16, 0, .4)
for i, x in enumerate(LT):
    add(whoosh(.3, 600, 7000, .9), x - .27, -21, -.6 + .4 * i); add(boom(72, 34, .9, .25), x, -10 + .7 * i, 0, .3); add(click(), x, -14, -.45 + .3 * i, .4)
    add(shing(), x + .01, -21 if i < 3 else -14, -.45 + .3 * i, .7)
add(boom(50, 26, 2.0, .8), LT[3], -11, 0, .2)
add(whoosh(.55, 2000, 9000, .5), Q(19.5), -20, -.5); add(shing(), Q(19.5) + .35, -18, .5, .7)
add(slam(), Q(21), -10, 0, .4); add(whoosh(.5, 300, 2500, .7), Q(21.5) - .3, -24, 0, .5); add(pop(), Q(22), -17, 0, .4)
add(whoosh(.6, 400, 6000, .7), Q(23) - .05, -13, -.5)
# ---------- H/I/J: previews ----------
p0 = Q(24); add(whoosh(.25, 600, 7000, .9), p0 - .2, -15, 0); add(thud(), p0, -11, 0, .3)
add(slap(), p0 + .22, -8, .1, .3); add(ding(), p0 + .3, -17, .5, .5); add(slam(), p0 + .52, -11, .3, .3)
add(whoosh(.35, 200, 2500, .6), p0 + .42, -17, -.6); add(snap(), p0 + .72, -10, -.4, .3)
p1 = Q(25.5); add(whoosh(.4, 300, 5000, .5), p1 - .05, -13, 0); add(grab(), p1 + .3, -10, -.2, .3); add(thunk(), p1 + .45, -12, -.2, .3)
add(slam(), p1 + .5, -11, .3, .3); add(whoosh(.35, 200, 2500, .6), p1 + .42, -17, .6); add(snap(), p1 + .72, -10, .4, .3)
p2 = Q(27); add(whoosh(.25, 600, 7000, .9), p2 - .2, -15, 0); add(pop(), p2 + .05, -12, .2, .3); add(blip(1760), p2 + .2, -15, .3, .4)
add(thud(), p2 + .36, -9, .2, .3); add(slam(), p2 + .36, -13, .2, .3); add(whoosh(.35, 200, 2500, .6), p2 + .3, -17, .6); add(snap(), p2 + .58, -10, .4, .3)
# ---------- cards ----------
for i in range(3): t0 = Q(28) + .02 + i * .09; add(swipe(), t0, -19, -.6 + .6 * i); add(pop(), t0 + .28, -15, -.6 + .6 * i, .3)
add(whoosh(.5, 500, 5000, .7), Q(28) + .05, -22, 0, .4)
add(whoosh(.3, 500, 6500, .85), Q(29.5) - .26, -18, 0); add(slam(), Q(29.5), -10, 0, .4)
for i, f in enumerate([1500, 1700, 1950]): add(blip(f), Q(30 + .5 * i), -14, -.6 + .6 * i, .5); add(tick(), Q(30 + .5 * i), -18, -.6 + .6 * i)
# ---------- reverb + master ----------
d = 1.6; IR = rng.standard_normal(int(d * SR)) * np.exp(-T(d) / .35); IR = band(IR, 200, 7000); IR /= np.sqrt(np.sum(IR ** 2))
L = N + len(IR); nf = 1 << (L - 1).bit_length()
for c in range(2):
    ir = np.roll(IR, c * 97); w = np.fft.irfft(np.fft.rfft(verb[c], nf) * np.fft.rfft(ir, nf), nf)[:N]; sfx[c] += w * .5
sfx *= np.minimum(1, (N - np.arange(N)) / (.15 * SR))
mix = mus * 10 ** (-2 / 20) + sfx
def wr(p, a):
    a = np.clip(a, -1, 1); w = wave.open(p, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((a.T * 32767).astype(np.int16).tobytes()); w.close()
wr('/data/crab/open_raw.wav', mix / max(1, np.max(np.abs(mix)) * 1.02))
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/data/crab/open_raw.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', m)[-1]); g = -14 - I
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', '/data/crab/open_raw.wav', '-af', f'volume={g + 0.1:.2f}dB,alimiter=limit=0.89:level=false', '-ar', '48000', '/data/crab/open_a.wav'])
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/data/crab/open_a.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('raw I', I, '| final', re.findall(r'I:\s+(-?[\d.]+) LUFS', m)[-1], 'LUFS, peak', re.findall(r'Peak:\s+(-?[\d.]+) dBFS', m)[-1])
mu = mus * 10 ** (-2 / 20)
for a, b in [(0, Q(3)), (Q(3), Q(4)), (Q(4), Q(8)), (Q(8), Q(12)), (Q(12), Q(14)), (Q(14), Q(16)), (Q(16), TE), (TE, Q(20)), (Q(20), Q(24)), (Q(24), Q(28)), (Q(28), 23.5)]:
    i, j = int(a * SR), int(b * SR); r = lambda x: 20 * np.log10(np.sqrt(np.mean(x[:, i:j] ** 2)) + 1e-9)
    print(f'{a:5.2f}-{b:5.2f}  music {r(mu):6.1f}  sfx {r(sfx):6.1f}')
