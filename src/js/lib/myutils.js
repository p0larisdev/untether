function puts(s) {
	return calls4arg("puts", sptr(s), 0, 0, 0);
}

function printf() {
	if (arguments.length > 4) {
		return printf("warning: tried to printf with %d args, max %d.\n", arguments.length, 4);
	}

	var args_to_pass = new Array();

	args_to_pass.push("printf");

	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i].constructor === String) {
			args_to_pass.push(sptr(arguments[i]));
		} else {
			args_to_pass.push(arguments[i]);
		}
	}

	var count_to_me = 5 - arguments.length;
	for (var i = 0; i < count_to_me; i++) {
		args_to_pass.push(0);
	}

	return calls4arg.apply(this, args_to_pass);
}

function syslog() {
	if (arguments.length > 4) {
		return printf("warning: tried to printf with %d args, max %d.\n", arguments.length, 4);
	}

	var args_to_pass = new Array();

	sym = "syslog";

	if (sym in sym_cache) {
		var addy = sym_cache[sym];
	} else {
		var dlsym_addy = read_u32(reserve_addr + 24 + slid);
		var shc_slide = read_u32(reserve_addr + 20 + slid);
		var addy = call4arg(dlsym_addy + shc_slide, 0xfffffffe, sptr(sym), 0, 0);
		sym_cache[sym] = addy;
	}

	args_to_pass.push(addy);

	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i].constructor === String) {
			args_to_pass.push(sptr(arguments[i]));
		} else {
			args_to_pass.push(arguments[i]);
		}
	}

	return callnarg.apply(this, args_to_pass);
}

function sleep(t) {
	return calls4arg("sleep", t, 0, 0, 0);
}