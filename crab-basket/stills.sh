#!/bin/bash
# usage: stills.sh outdir "beat1,beat2,..."  (beats in Q units)  -> contact sheet outdir.jpg
cd /data/crab && ./build.sh >/dev/null || exit 1
OUT=$1; TS=$(python3 -c "import sys;print(','.join('%.3f'%(0.145+0.713*float(b)) for b in sys.argv[1].split(',')))" "$2")
rm -rf $OUT; node render.cjs "$TS" 0 $OUT 2>&1 | grep -v "^PAGE" | head -5
python3 - "$OUT" <<'PY'
import sys,glob
from PIL import Image
d=sys.argv[1]; fs=sorted(glob.glob(d+'/f_*.jpg'),key=lambda f:float(f.split('_')[-1][:-4]))
w,h=480,270; cols=4; rows=(len(fs)+cols-1)//cols
S=Image.new('RGB',(cols*w+(cols-1)*4,rows*h+(rows-1)*4),(30,30,30))
for i,f in enumerate(fs): S.paste(Image.open(f).resize((w,h)),((i%cols)*(w+4),(i//cols)*(h+4)))
S.save(d+'.jpg',quality=85); print(len(fs),'frames ->',d+'.jpg')
PY
