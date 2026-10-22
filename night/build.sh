#!/bin/bash
cd /data/night
cat head.html core.js scenes.js shots.js a0_common.js a2.js a3.js a4.js a5.js a6.js a9_master.js tail.html > night.html 2>/dev/null
awk '/<script>/{f=1;next}/<\/script>/{f=0}f' night.html > /tmp/_n.js && node --check /tmp/_n.js && echo "syntax ok"
