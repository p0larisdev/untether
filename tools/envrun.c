#include <unistd.h>
#include <stdio.h>

int main(int argc, char* argv[]) {
	char* argv_[] = {
		"/bin/sh",
		NULL
	};

	char* envp_[] = {
		"SHELL=/bin/sh",
		"USER=mobile",
		"HOME=/var/mobile",
		"XPC_FLAGS=0x0",
		"XPC_SERVICE_NAME=0",
		"LOGNAME=mobile",
		"PATH=/usr/bin:/bin:/usr/sbin:/sbin",
		"__CF_USER_TEXT_ENCODING=0x1F5:0:0",
		NULL
	};

	execle("/bin/sh", "/bin/sh", NULL, envp_);

	return 0;
}