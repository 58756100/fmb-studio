#!/bin/sh
# copy the storyboard kit + reel files into public/ so the Story engine can load them
cd "$(dirname "$0")"
cp ../storyboard/logo.js ../storyboard/kit.js ../storyboard/screens.js ../storyboard/screens2.js public/sbkit/
sed 's|url(../remotion/public/fonts/|url(../fonts/|' ../storyboard/ui.css > public/sbkit/ui.css
cp ../storyboard/w42/*.js public/sbkit/w42/ 2>/dev/null; rm -f public/sbkit/w42/shoot.mjs
printf 'const F=[];const add=(id,t,html,bg="studio",note="")=>F.push({id,t,note,html:`<div class="frame" id="${id}"><div class="bg ${bg}"></div>${html}<div class="tc">${id}</div></div>`});\n' > public/sbkit/prelude.js
printf 'window.__F=F;window.__META=(typeof META!=="undefined"?META:window.META)||{};\n' > public/sbkit/post.js
