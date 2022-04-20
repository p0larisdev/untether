

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
