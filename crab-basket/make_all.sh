#!/bin/bash
# 一键出片：构建 → 并行渲染画面 → 拼接 → 生成音频 → 封装
set -e; cd "$(dirname "$0")"
[ -f bgm.wav ] || ffmpeg -y -v error -i bgm.mp3 -ar 48000 -ac 2 bgm.wav
./build.sh
mkdir -p parts
node render.cjs 0 2013 parts/p1.mp4 > parts/p1.log 2>&1 &
node render.cjs 2013 4026 parts/p2.mp4 > parts/p2.log 2>&1 &
python3 sfx_full.py
wait
printf "file 'p1.mp4'\nfile 'p2.mp4'\n" > parts/list.txt
ffmpeg -y -v error -f concat -safe 0 -i parts/list.txt -c copy parts/video.mp4
ffmpeg -y -v error -i parts/video.mp4 -i full_a.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart -shortest 没有盖子的竹篓.mp4
echo done
