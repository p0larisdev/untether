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

/*
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
 */

function scall_wrapper(s) {
	function _scall_wrapper() {
		var args_to_pass = new Array();
		if (arguments.callee.hasOwnProperty("func_name")) {
			args_to_pass.push(arguments.callee.func_name);
		} else {
			args_to_pass.push(s);
		}

		if (arguments.callee.hasOwnProperty("pre_args")) {
			args_to_pass = args_to_pass.concat(arguments.callee.pre_args);
		}

		args_to_pass = args_to_pass.concat(Array.from(arguments));

		if (arguments.callee.hasOwnProperty("post_args")) {
			args_to_pass = args_to_pass.concat(arguments.callee.post_args);
		}

		return scall.apply(this, args_to_pass);
	}

	return _scall_wrapper;
}
  
var syslog = scall_wrapper("syslog");
var sleep = scall_wrapper("sleep");
var strlen = scall_wrapper("strlen");
var mach_task_self = scall_wrapper("mach_task_self");
var mach_thread_self = scall_wrapper("mach_thread_self");
var malloc = scall_wrapper("malloc");
var mach_port_allocate = scall_wrapper("malloc");
var mach_port_insert_right = scall_wrapper("malloc");
var mach_port_set_attributes = scall_wrapper("mach_port_set_attributes");
var usleep = scall_wrapper("usleep");
var sched_yield = scall_wrapper("sched_yield");
var memcpy = scall_wrapper("memcpy");
var memset = scall_wrapper("memset");
var io_service_add_notification_ool = scall_wrapper("io_service_add_notification_ool");
var host_get_io_master = scall_wrapper("host_get_io_master");
var mach_host_self = scall_wrapper("mach_host_self");
var mach_error_string = scall_wrapper("mach_error_string");
var IOServiceGetMatchingService = scall_wrapper("IOServiceGetMatchingService");
var IOServiceMatching = scall_wrapper("IOServiceMatching");
var io_service_open_extended = scall_wrapper("io_service_open_extended");
var IORegistryEntryGetChildIterator = scall_wrapper("IORegistryEntryGetChildIterator");
var IOIteratorNext = scall_wrapper("IOIteratorNext");
var IORegistryEntryGetProperty = scall_wrapper("IORegistryEntryGetProperty");
var mach_msg = scall_wrapper("mach_msg");
var mmap = scall_wrapper("mmap");
var free = scall_wrapper("free");
var mlock = scall_wrapper("mlock");
var mprotect = scall_wrapper("mprotect");