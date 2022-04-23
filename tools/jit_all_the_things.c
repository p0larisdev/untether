#include <sys/types.h>
#include <stdio.h>

#define PT_TRACE_ME 0
int ptrace(int, pid_t, caddr_t, int);
int main(int argc, char* argv[]) {
	ptrace(PT_TRACE_ME, 0, NULL, 0);
	exit(0);

	return 0;
}