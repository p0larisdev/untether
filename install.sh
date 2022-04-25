#!/bin/bash

ssh root@localhost -p 2222 "rm main_arm"

scp -P 2222 bin/main_arm root@localhost:main_arm
scp -P 2222 exp.js root@localhost:exp.js

ssh root@localhost -p 2222 "./main_arm -f /usr/sbin/racoon -j exp.js -o racoon.conf; cp racoon.conf /etc/racoon/racoon.conf"
#bin/main -f ~/racoon -j ../lol.js | ssh root@localhost -p 2222 "cat > /etc/racoon/racoon.conf"

#bin/main -f ~/racoon | ssh root@192.168.1.6 "cat > racoon.conf"
#bin/main -f ~/racoon | ssh root@192.168.1.6 "cat > /etc/racoon/racoon.conf"
