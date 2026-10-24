#!/bin/bash
# 响度标准化：目标 -14 LUFS，真峰值 ≤ -1 dBFS
# 做法：增益 → 4 倍过采样后限幅（抓住采样点之间的峰值）→ 回到 48kHz，再按实测补一次增益
set -e
cd "$(dirname "$0")"
P=${1:-part1}
IN=out/raw_$P.wav; OUT=out/mix_$P.wav
lufs() { ffmpeg -hide_banner -i "$1" -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}'; }
chain() { echo "volume=${1}dB,aresample=192000,alimiter=limit=0.79:attack=0.5:release=80:level=false,aresample=48000"; }
G=$(python3 -c "print(-14.0-($(lufs $IN)))")
ffmpeg -hide_banner -loglevel error -y -i $IN -af "$(chain $G)" -c:a pcm_s16le tmp.wav
G=$(python3 -c "print($G+(-14.0-($(lufs tmp.wav))))")
ffmpeg -hide_banner -loglevel error -y -i $IN -af "$(chain $G)" -c:a pcm_s16le $OUT
rm -f tmp.wav
ffmpeg -hide_banner -i $OUT -af ebur128=peak=true -f null - 2>&1 | grep -E " I:|Peak:|LRA:" | tail -3
