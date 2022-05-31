#include <stdint.h>
#include <stdio.h>
#include <dlfcn.h>
//#include <CoreFoundation/CoreFoundation.h>

uintptr_t get_dyld_shc_slide(void) {
	return _dyld_get_image_vmaddr_slide(1);
}

uint32_t dlsym_cf(char* s) {
	return dlsym(dlopen("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation", RTLD_NOW), s) - get_dyld_shc_slide();
}

void fuck(char* s) {
	printf("var %s_addr = 0x%08x;\n", s, dlsym_cf(s));
}

int main(int argc, char* argv[]) {
	printf("#define PRINTF_ADDR 0x%x\n", dlsym(RTLD_DEFAULT, "printf"));
//	printf("%x %x %x %x %x %x %x %x\n", RTLD_NOW, dlsym_cf("kCFTypeDictionaryKeyCallBacks"), 0x41414141);//, &kCFTypeDictionaryValueCallBacks, kCFNumberSInt32Type);
	fuck("CFDictionaryCreateMutable");
	fuck("kCFTypeDictionaryKeyCallBacks");
	fuck("kCFTypeDictionaryValueCallBacks");
//	fuck("kCFNumberSInt32Type");
	fuck("CFDictionarySetValue");
	fuck("CFNumberCreate");
	return 0;
}
