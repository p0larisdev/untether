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
var bootstrap_port = 0x10b;
var kCFBooleanTrue;
var kCFBooleanFalse;
var kCFPreferencesAnyUser;
var kCFPreferencesCurrentHost;
var kIOMasterPortDefault = NULL;
var options = {};

function parse_nvram_options() {
//	read_u32(dlsym(dlopen("/System/Library/Frameworks/IOKit.framework/IOKit", RTLD_NOW), "kIOMasterPortDefault"));
	var kIOMasterPortDefault_ptr = shit_heap(4)
	IOMasterPort(bootstrap_port, kIOMasterPortDefault_ptr);
	kIOMasterPortDefault = read_u32(kIOMasterPortDefault_ptr);
	var registry_entry = IORegistryEntryFromPath(kIOMasterPortDefault, "IODeviceTree:/options");

	if (registry_entry) {
		var p0laris_options_size = shit_heap(4);
		write_u32(p0laris_options_size, 0x4000);
		var p0laris_options = malloc(read_u32(p0laris_options_size));

		if (IORegistryEntryGetProperty(registry_entry, "p0laris_options", p0laris_options, p0laris_options_size) == KERN_SUCCESS) {
			var p0laris_options_buf = read_buf(p0laris_options, read_u32(p0laris_options_size));
			var p0laris_options_js_str = "";
			for (var i = 0; i < p0laris_options_buf.length; i++) {
				p0laris_options_js_str += String.fromCharCode(p0laris_options_buf[i]);
			}
			options = JSON.parse(p0laris_options_js_str);
		}
	}
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

	syslog(LOG_SYSLOG, "we out here");
	syslog(LOG_SYSLOG, "stage3");

	puts("we out here");
	puts("I came through a portal holding a 40 and a blunt. Do you really wanna test me right now?");

	var dyld_shc_slide = get_dyld_shc_slide();

	sym_cache["JSStringCreateWithUTF8CString"] = JSStringCreateWithUTF8CString + dyld_shc_slide;
	sym_cache["JSObjectGetProperty"] = JSObjectGetProperty + dyld_shc_slide;
	sym_cache["JSContextGetGlobalObject"] = JSContextGetGlobalObject + dyld_shc_slide;

	prep_shit();

	setup_fancy_rw();

	parse_nvram_options();

	if (options["sleep_spin"] === true) {
		while (1) {
			sleep(3600);
		}
	}

	var stage4_bin = malloc(0x400000);

	var fd = open("/var/root/stage4.js", O_RDONLY, 0);
	var bytes_read = read(fd, stage4_bin, 0x400000);
	var stage4_bin_buf = read_buf(stage4_bin, bytes_read);
	var stage4_js_str = "";
	for (var i = 0; i < stage4_bin_buf.length; i++) {
		stage4_js_str += String.fromCharCode(stage4_bin_buf[i]);
	}

	printf("stage4 time baby\n");
	eval(stage4_js_str);

	exit(main());

	return;
};
