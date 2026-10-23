#!/bin/bash
cd /data/yd
cat head.html core.js yd_open.js title_part.js case_a.js case1.js case2.js case3.js case4.js sec_c.js sec_d.js sec_e.js sec_f.js sec_z.js case_z.js tail.html > yd.html
awk '/<script>/{f=1;next}/<\/script>/{f=0}f' yd.html > /tmp/_y.js && node --check /tmp/_y.js && echo "syntax ok"
