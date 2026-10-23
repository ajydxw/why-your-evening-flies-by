#!/bin/bash
# usage: sheetq.sh dir out.jpg cols  (labels each still with its beat number)
d=$1; o=$2; c=${3:-4}; mkdir -p $d/lab; rm -f $d/lab/*.jpg
for f in $(ls $d/f_*.jpg | sort -t_ -k2 -n); do b=$(basename $f .jpg); s=${b#f_}; q=$(python3 -c "print(f'Q{($s-0.145)/0.713:.2f}  {$s}s')");
magick $f -resize 640x360 -fill '#000a' -draw 'rectangle 0,0 250,30' -fill white -pointsize 20 -annotate +6+22 "$q" $d/lab/$b.jpg; done
magick montage $(ls $d/lab/*.jpg | sort -t_ -k2 -n) -tile ${c}x -geometry +3+3 -background '#222' $o
