/*
 *  native C shellcode
 */

typedef unsigned int uint32_t;

//#define PRINTF_ADDR 0x2054a3b9
//#define BASE_ADDR 0x42000000

void entry(void) {
	*(uint32_t*)0x69696969 = (uint32_t)0x1;
	/*
	uint32_t dlsym_addr = *(uint32_t*)BASE_ADDR;
	void* (*dlsym)(void* handle, char* s) = (void* (*)(void*, char*))dlsym_addr;
	void (*abort)(void) = dlsym(0xfffffffe, "abort");
	abort();*/
}

/*
void shellcode_main(void) {
	uint32_t puts_addr = *(uint32_t*)BASE_ADDR;
	int (*puts)(char* s) = (int (*)(char* s))puts_addr;
	puts("Hello from shellcode!\n");
}*/