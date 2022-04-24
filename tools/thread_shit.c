#include <mach/mach.h>
#include <stdio.h>

int main(int argc, char* argv[]) {
	kern_return_t kr;
	thread_t th;
	mach_port_name_t mytask, mythread;
	printf("Hello, world!\n");
	mytask = mach_task_self();
	mythread = mach_thread_self();

	thread_create(mytask, &th);
	arm_thread_state_t state;
	mach_msg_type_number_t count;
	kr = thread_get_state(th, ARM_THREAD_STATE, (thread_state_t)&state, &count);
	printf("%d %d %s\n", kr, KERN_SUCCESS, mach_error_string(kr));
	for (int i = 0; i < 13; i++) {
		state.__r[i] = 0x41414140 + i;
	}
	state.__sp = 0x4141414c;
	state.__lr = 0x4141414d;
	state.__pc = 0x4141414e;
	kr = thread_set_state(th, ARM_THREAD_STATE, (thread_state_t)&state, ARM_THREAD_STATE_COUNT);
	printf("%d %d %s\n", kr, KERN_SUCCESS, mach_error_string(kr));
	kr = thread_resume(th);
	printf("%d %d %s\n", kr, KERN_SUCCESS, mach_error_string(kr));

	printf("still alive?\n");

	return 0;
}