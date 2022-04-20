#include <stdio.h>
#include <stdlib.h>
#include <mach/mach.h>

#include <mach-o/dyld.h>

#include <dlfcn.h>

int lol;

int main(void) {
//	printf("[*] aslr better be a cripple now: &lol = %p, malloc(...) = %p\n", &lol, malloc(0x4));
//	printf("[*] lol2=0x%08x\n", *(uint32_t*)0x800000);
	task_t kek = mach_task_self();
	uint8_t* page = malloc(0x1000);

	for (int i = 0; i < _dyld_image_count(); i++) {
		printf("%s: 0x%x (slid 0x%x)\n", _dyld_get_image_name(i), _dyld_get_image_header(i), _dyld_get_image_vmaddr_slide(i));
	}

	printf("begin\n");
	fflush(stdout);

	printf("%p\n", dlopen("/System/Library/Frameworks/JavaScriptCore.framework/JavaScriptCore", RTLD_GLOBAL));

	printf("RTLD_LAZY=%d RTLD_NOW=%d RTLD_GLOBAL=%d RTLD_LOCAL=%d RTLD_NODELETE=%d RTLD_NOLOAD%d\n", RTLD_LAZY, RTLD_NOW, RTLD_GLOBAL, RTLD_LOCAL, RTLD_NODELETE, RTLD_NOLOAD);

#if 0
	for (int i = 0xb4000; i < 0xb5000; i += 4) {
//		uint32_t* lol = (uint32_t*)(0x1fe6a58c + (i << 12));
		uint32_t lol = *(uint32_t*)i;
		if (lol >= 0x1fe00000 && lol <= 0x1ff00000) {
			printf("0x%08x 0x%08x\n", i, lol);
		}
		(void)fflush(__stdoutp);
	}


		if (*lol == 0xb5f0) break;
	}
#endif

	printf("success\n");
	/*
	size_t size;
	for (uint32_t pagen = 0x0; pagen < (0xffffffff >> 12); pagen++) {

		if (pagen % ((0xffffffff >> 12) / 100) == 0) {
			//printf("%d\n", pagen / ((0xffffffff >> 12) / 100));
		}

		uint32_t page_start = pagen << 12;
		if (vm_read_overwrite(kek, page_start, 0x1000, (vm_address_t)page, &size))
			continue; // page isn't allocated

//		printf("0x%08x\n", page_start);
	}
	*/
	return 0;
}
