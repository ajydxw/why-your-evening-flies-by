#!/bin/bash
# usage: sheet.sh dir out.jpg [cols]
d=$1; o=$2; c=${3:-4}
files=$(ls $d/f_*.jpg | sort -t_ -k2 -n)
montage $files -tile ${c}x -geometry 640x360+4+4 -background '#222' -pointsize 22 -fill white -label '%t' $o 2>/dev/null || magick montage $files -tile ${c}x -geometry 640x360+4+4 -background '#222' $o
