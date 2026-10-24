"""根据 timeline.json 中的心率关键帧，积分得到每一次心跳的时间点。
输出 src/data/heartbeats.json，画面里的心电图和音频里的心跳声共用这份数据。"""
import json, numpy as np, pathlib
root = pathlib.Path(__file__).resolve().parents[1]
tl = json.loads((root / 'src/data/timeline.json').read_text())
keys = np.array(tl['hr'], dtype=float)
def hr(t):
    return float(np.interp(t, keys[:, 0], keys[:, 1]))
dt = 1 / 1000
t, phase, beats = 0.0, 0.62, []   # 初相位让第一次心跳落在约 0.3s
end = tl['durationSec']
while t < end:
    phase += hr(t) / 60 * dt
    if phase >= 1:
        phase -= 1
        beats.append(round(t, 3))
    t += dt
(root / 'src/data/heartbeats.json').write_text(json.dumps({'beats': beats}))
print(len(beats), beats[:6], [b for b in beats if 11 < b < 12.5])
