/*
 * fuck_aslr
 */

#include <stdio.h>
#include <mach/mach.h>

task_t tfp0;
#define LC_SIZE 0x0000000f

uint8_t lol[] = {
	0x40, 0xf2, 0x69, 0x00
};

mach_port_t get_kernel_task_port() {
	mach_port_t kernel_task;
	kern_return_t kr;
	if ((kr = task_for_pid(mach_task_self(), 0, &kernel_task)) != KERN_SUCCESS) {
		return -1;
	}
	return kernel_task;
}

uint32_t do_kernel_read(uint32_t addr) {
	size_t size = 4;
	uint32_t data = 0;
	
	kern_return_t kr = vm_read_overwrite(get_kernel_task_port(),(vm_address_t)addr,size,(vm_address_t)&data,&size);
	if (kr != KERN_SUCCESS) {
		printf("[!] Read failed. %s\n",mach_error_string(kr));
		return -1;
	}
	return data;
}

void do_kernel_write(uint32_t addr, uint32_t data) {
	kern_return_t kr = vm_write(get_kernel_task_port(),(vm_address_t)addr,(vm_address_t)&data,sizeof(data));

	if (kr != KERN_SUCCESS) {
		printf("Error writing!\n");
		return;
	}
}

uint32_t get_kernel_slide() {
	uint32_t slide;
	uint32_t base = 0x80001000;
	uint32_t slid_base;

	for (int slide_byte = 256; slide_byte >= 1; slide_byte--) {
		slide = 0x01000000 + 0x00200000 * slide_byte;
		slid_base = base + slide;

		if (do_kernel_read(slid_base) == 0xfeedface) {
			if (do_kernel_read(slid_base + 0x10) == LC_SIZE) {
				return slide;
			}
		}
	}
	return -1;
}

int main(int argc, char* argv[]) {
	printf("[*] fuck aslr\n");
	task_for_pid(mach_task_self(), 0, &tfp0);
	uint8_t lol_slide;
	/*
	 *                         LAB_8029c06e                              XREF[1]:   8029c04e(j)  
     *  8029c06e 4c a8         add       r0,sp,#0x130
     *  8029c070 04 21         movs      r1,#0x4
     *  8029c072 15 f6 d5      bl        _read_random                               void _read_random(void * buf
     *           fb
     *  8029c076 c4 f1 14      rsb.w     r0,r4,#0x14
     *           00
     *  8029c07a 01 21         movs      r1,#0x1
     *  8029c07c 01 fa 00      lsl.w     r8,r1,r0
     *           f8
     *  8029c080 4c 98         ldr       r0,[sp,#local_190]
     *  8029c082 4f ea e8      asr.w     r11,r8, asr #0x1f
     *           7b
     *  8029c086 00 21         movs      r1,#0x0
     *  8029c088 20 f0 00      bic       r0,r0,#0x80000000
     *           40
     *  8029c08c 42 46         mov       r2,r8
     *  8029c08e 5b 46         mov       r3,r11
     *  8029c090 f7 f0 b6      bl        FUN_80393200                               undefined FUN_80393200()
     *           f8
     *  8029c094 82 46         mov       r10,r0
     *  8029c096 0e 46         mov       r6,r1
     *  8029c098 2c 46         mov       r4,r5
     *  8029c09a 00 2d         cmp       r5,#0x0
     *  8029c09c 01 d0         beq       LAB_8029c0a2
     *  8029c09e e5 6a         ldr       r5,[r4,#0x2c]
     *  8029c0a0 00 e0         b         LAB_8029c0a4

	 */
	uint32_t patch_addy = 0x8029c088; // iPad2,1 9.3.5 
	if (argc < 2) {
		lol_slide = 0x0;
	} else {
		lol_slide = strtoul(argv[1], NULL, 16);
	}
	if (argc != 3) {
		lol[2] = lol_slide;
		printf("[*] vm_write returned %d\n", vm_write(tfp0, patch_addy + get_kernel_slide(), (vm_address_t)lol, sizeof(lol)));
	} else {
		lol[0] = 0x20;
		lol[1] = 0xf0;
		lol[2] = 0x00;
		lol[3] = 0x40;
		printf("[*] vm_write returned %d\n", vm_write(tfp0, patch_addy + get_kernel_slide(), (vm_address_t)lol, sizeof(lol)));
	}
	return 0;
}