#!/bin/bash

ssh root@localhost -p 2222 << EOF
rm -rf /untether/
mkdir /untether/
echo "#!/usr/local/bin/scripter -q -cf" > /untether/get_code_exec
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
cp -p /usr/libexec/dhcpd /usr/local/bin/scripter
chmod 4777 /usr/sbin/racoon
mv /usr/sbin/BTServer /usr/sbin/BTServer_
ln -s /untether/get_code_exec /usr/sbin/BTServer
EOF