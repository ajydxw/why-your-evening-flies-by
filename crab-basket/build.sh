#!/bin/bash
cd /data/crab
cat head.html core.js c0_common.js c1_open.js c2_reveal.js c3_kit.js c4_s1.js c5_s2.js c6_s3.js c7_why.js c8_break.js c8b_end.js c9b_dispatch.js c9_master.js tail.html > crab.html
awk '/<script>/{f=1;next}/<\/script>/{f=0}f' crab.html > /tmp/_c.js && node --check /tmp/_c.js && echo "syntax ok"
