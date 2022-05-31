#include <sys/types.h>
#include <sys/mman.h>
#include <stdio.h>
#include <dlfcn.h>

//uint8_t whatever[] = {0xe9, 0x2d, 0x40, 0x80, 0xe2, 0x8d, 0x70, 0x00, 0xeb, 0x00, 0x00, 0x08, 0xe8, 0xbd, 0x80, 0x80, 0xe9, 0x2d, 0x40, 0x80, 0xe2, 0x8d, 0x70, 0x00, 0xe5, 0x9f, 0x20, 0x08, 0xe5, 0x9f, 0x30, 0x08, 0xe5, 0x82, 0x30, 0x00, 0xe8, 0xbd, 0x80, 0x80, 0x41, 0x41, 0x41, 0x41, 0x42, 0x42, 0x42, 0x42};

#define PT_TRACE_ME 0
int ptrace(int, pid_t, caddr_t, int);
int main(int argc, char* argv[]) {
//	ptrace(PT_TRACE_ME, 0, NULL, 0);

	uint8_t* whatever = NULL;
	FILE* fp = fopen("shc/bin/shellcode.bin", "r");
	fseek(fp, 0L, SEEK_END);
	size_t sz = ftell(fp);
	rewind(fp);

	whatever = (uint8_t*)malloc(sz);
	fread(whatever, 1, sz, fp);
	fclose(fp);

	void* exec = mmap(0x42000000, 0x1000, PROT_READ | PROT_WRITE, MAP_ANON | MAP_PRIVATE | MAP_FIXED, 0, 0);

	mprotect(exec, 0x1000, PROT_READ | PROT_WRITE);

	memcpy(exec + 4, whatever, sz);
	*(uint32_t*)exec = dlsym(RTLD_DEFAULT, "dlsym");

	printf("%x\n", *(uint32_t*)exec);

	mprotect(exec, 0x1000, PROT_READ | PROT_EXEC);

	void (*lol)() = (void (*)())(exec + 4);

	lol();

	exit(0);

	return 0;
}