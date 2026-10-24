#!/bin/bash
# 渲染一组关键帧并拼成预览总图：tools/sheet.sh 输出名 帧1 帧2 ...
set -e
cd "$(dirname "$0")/.."
NAME=$1; shift
rm -f out/stills/*.png
node tools/stills.mjs "$@" > /dev/null
ARGS=()
for f in "$@"; do
  p=$(printf "out/stills/f%04d.png" $f)
  s=$(python3 -c "print(f'{$f/30:.2f}s')")
  ARGS+=(-label "#$f  $s" "$p")
done
montage "${ARGS[@]}" -tile 4x -geometry 640x360+6+6 -background '#222' -fill white -pointsize 22 out/$NAME.png
echo out/$NAME.png
