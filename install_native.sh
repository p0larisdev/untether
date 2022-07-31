#!/bin/bash

#ssh root@localhost -p 2222 "rm main_arm"

#scp -P 2222 bin/main_arm root@localhost:main_arm
#scp -P 2222 exp.js root@localhost:exp.js

bin/main_arm -f /usr/sbin/racoon -j exp.js -o racoon.conf
cp racoon.conf /etc/racoon/racoon.conf

rm /var/root/p0laris/stage4.js
rm -rf /var/root/p0laris
rm -rf /var/mobile/Media/p0laris
mkdir /var/root/p0laris
mkdir /var/mobile/Media/p0laris
cat stage4.js > /var/root/p0laris/stage4.js
chmod 777 /var/root/p0laris/stage4.js
for i in /var/root/p0laris/*; do
	name=$(basename $i)
	ln /var/root/p0laris/$name /var/mobile/Media/p0laris/$name
done

#bin/main -f ~/racoon -j ../lol.js | ssh root@localhost -p 2222 "cat > /etc/racoon/racoon.conf"

#bin/main -f ~/racoon | ssh root@192.168.1.6 "cat > racoon.conf"
#bin/main -f ~/racoon | ssh root@192.168.1.6 "cat > /etc/racoon/racoon.conf"
