#!/bin/bash

ssh root@localhost -p 2222 << EOF
rm -rf /untether/
mkdir /untether/
echo "#!/usr/local/bin/scripter_ -q -cf" > /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/usr/sbin/racoon\");" >> /untether/get_code_exec
echo "execute(\"/untether/get_code_exec\");" >> /untether/get_code_exec
chmod +x /untether/get_code_exec
mkdir /usr/local/bin/
cp -p /usr/libexec/dhcpd /usr/local/bin/scripter_
chmod 4777 /usr/sbin/racoon
mv /usr/libexec/wifiFirmwareLoader /usr/libexec/wifiFirmwareLoader_
ln -s /untether/get_code_exec /usr/libexec/wifiFirmwareLoader
EOF