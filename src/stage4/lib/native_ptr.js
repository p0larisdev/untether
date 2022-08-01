class native_ptr {
//	constructor(addy, size = 4, buf_to_obj = u8x4_to_u32) {
	constructor() {
		this.addy = arguments[0];
		var our_proto = Object.getPrototypeOf(this);

		p0laris_log(JSON.stringify(Object.getPrototypeOf(this)));

		if (our_proto.predef == true) {
			p0laris_log("lol");
			this.size = our_proto.size;
			this.buf_to_obj = our_proto.buf_to_obj;
			this.obj_to_buf = our_proto.obj_to_buf;
		} else {
			this.size = arguments[1];
			this.buf_to_obj = arguments[2];
			this.obj_to_buf = arguments[3];
		}

		if (this.addy === undefined) {
			this.addy = shit_heap(this.size);
		}

		if (our_proto.predef == true) {
			return;
		}

		if (this.size === undefined) {
			this.size = 4;
		}

		if (this.buf_to_obj === undefined) {
			this.buf_to_obj = u8x4_to_u32;
		}
		if (this.obj_to_buf === undefined) {
			this.obj_to_buf = u32_to_u8x4;
		}
	}

	deref() {
		var n = arguments[0];
		if (n === undefined) {
			n = 0;
		}

		return this.buf_to_obj(read_buf(this.addy + (n * this.size), this.size));
	}

	write() {
		var v = arguments[0];

		var n = arguments[1];
		if (n === undefined) {
			n = 0;
		}

		write_buf(this.addy + (n * this.size), this.obj_to_buf(v), this.size);
	}
}

function native_ptr_type(size, buf_to_obj, obj_to_buf) {
	class ret extends native_ptr {
		//
	}

	ret.prototype.predef = true;
	ret.prototype.size = size;
	ret.prototype.buf_to_obj = buf_to_obj;
	ret.prototype.obj_to_buf = obj_to_buf;

	return ret;
}

/*
typedef struct{
	void*                         address;
	mach_msg_size_t               count;
	boolean_t                     deallocate: 8;
	mach_msg_copy_options_t       copy: 8;
	mach_msg_type_name_t          disposition : 8;
	mach_msg_descriptor_type_t    type : 8;
} mach_msg_ool_ports_descriptor_t;
 */
function mach_msg_ool_ports_descriptor_t_buf_to_obj(buf) {
	var ret = {};

	ret.address = u8x4_to_u32(buf);
	ret.count = u8x4_to_u32([buf[4], buf[5], buf[6], buf[7]]);
	ret.deallocate = buf[8];
	ret.copy = buf[9];
	ret.disposition = buf[10];
	ret.type = buf[11];

	return ret;
}

var mach_msg_ool_ports_descriptor_t = native_ptr_type(12,
													  mach_msg_ool_ports_descriptor_t_buf_to_obj,
													  function(){});