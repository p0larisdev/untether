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
	vm_size_t segment = 0x800;
	uint32_t lol = get_kernel_slide();
	task_t tfp0 = get_kernel_task_port();
	uint32_t len = 32 * 1024 * 1024;
	uint8_t* kdata = (uint8_t*)malloc(len);
	for (int i = 0; i < len / segment; i++) {
		/*
		 *  DUMP DUMP DUMP
		 */
		
		vm_read_overwrite(tfp0,
						  0x80001000 + lol + (i * segment),
						  segment,
						  (vm_address_t)kdata + (i * segment),
						  &segment);
	}

	FILE* fp = fopen("dump.bin", "wb");
	fwrite(kdata, 1, len, fp);
	fclose(fp);

	return 0;
}