rm stage4.js
find src/stage4 -name '*.js' -exec cat {} \; >> stage4.js

cp stage4.js /home/spv/media/p0laris/