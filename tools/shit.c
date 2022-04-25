#include <mach/mach.h>
#include <sys/mman.h>
#include <stdio.h>

int main(int argc, char* argv[]) {
	kern_return_t kr;
	thread_t th;
	mach_port_name_t mytask, mythread;
	arm_thread_state_t state;
	mach_msg_type_number_t count;
	printf("Hello, world!\n");
	mytask = mach_task_self();
	mythread = mach_thread_self();

	printf("%x %x %x %x %x %x %x %x %x %x %x %x\n", mytask, &th, th, &state, &count, 0x41414141);
	mmap(0x1300000, 0x100000, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANON, 0, 0);
	printf("%x %x %x %x %x %x %x %x %x %x %x %x\n", mytask, &th, th, &state, &count, 0x41414141);

	*(uint32_t*)0x1301004 = 0x1300100;
	*(uint32_t*)0x1301008 = 0x1300200;
	*(uint32_t*)0x1301000 = 0x1300000;

	*(uint32_t*)0x1302000 = 0x1301000;
	*(uint32_t*)0x1302004 = 0x1301004;
	*(uint32_t*)0x1302008 = 0x1301008;

	*(uint32_t*)0x1304008 = 0x1303008;
	*(uint32_t*)0x1305008 = 0x1304008;

	printf("%d(%x) %d(%x)\n", ARM_THREAD_STATE, ARM_THREAD_STATE, ARM_THREAD_STATE_COUNT, ARM_THREAD_STATE_COUNT);

	// 707 10580c 105848 1057c8 1057c4 41414141 105850 1 0 0 0 0
	printf("%x %x %x %x %x %x %x %x %x %x %x %x\n", mytask, &th, th, &state, &count, 0x41414141);

	printf("still alive?\n");
	printf("%x\n", *(uint32_t*)0x1300000);
	kr = thread_create(mytask, 0x1300000);
	printf("%d %d %s\n", kr, KERN_SUCCESS, mach_error_string(kr));

	printf("%x\n", *(uint32_t*)0x1300000);
	printf("still alive?\n");
	kr = thread_get_state(0x1300000, ARM_THREAD_STATE, 0x1301008, 0x1301000);

	printf("%d %d %s\n", kr, KERN_SUCCESS, mach_error_string(kr));
	printf("still alive?\n");
	*(uint32_t*)0x1302008 = 0x41414141;
	kr = thread_set_state(0x1300000, ARM_THREAD_STATE, 0x1305008, ARM_THREAD_STATE_COUNT);
	
	printf("%d %d %s\n", kr, KERN_SUCCESS, mach_error_string(kr));
	kr = thread_get_state(0x1300000, ARM_THREAD_STATE, 0x1304008, 0x1301000);
	
	printf("%d %d %s\n", kr, KERN_SUCCESS, mach_error_string(kr));
	printf("%x\n", *(uint32_t*)0x1302008);
	printf("still alive?\n");
	kr = thread_resume(0x1300000);
	
	printf("%d %d %s\n", kr, KERN_SUCCESS, mach_error_string(kr));
	printf("still alive?\n");

	printf("still alive?\n");

	return 0;
}