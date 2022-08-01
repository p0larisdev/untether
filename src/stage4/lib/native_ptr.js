class native_ptr {
//	constructor(addy, size = 4, buf_to_obj = u8x4_to_u32) {
	constructor() {
		this.addy = arguments[1];
		this.count = arguments[0];
		var our_proto = Object.getPrototypeOf(this);

		if (our_proto.predef == true) {
			this.size = our_proto.size;
			this.buf_to_obj = our_proto.buf_to_obj;
			this.obj_to_buf = our_proto.obj_to_buf;
		} else {
			this.size = arguments[2];
			this.buf_to_obj = arguments[3];
			this.obj_to_buf = arguments[4];
		}

		if (this.count === undefined) {
			this.count = 1;
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

		if (Object.getPrototypeOf(this).deref_all != undefined) {
			this.size *= this.count;
		}

		if (this.addy === undefined) {
			this.addy = shit_heap(this.size * this.count);
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

function mach_msg_ool_ports_descriptor_t_obj_to_buf(obj) {
	var ret = new Uint8Array(12);
	var tmp;

	tmp = u32_to_u8x4(obj.address);

	ret[0] = tmp[0];
	ret[1] = tmp[1];
	ret[2] = tmp[2];
	ret[3] = tmp[3];

	tmp = u32_to_u8x4(obj.count);

	ret[0 + 4] = tmp[0];
	ret[1 + 4] = tmp[1];
	ret[2 + 4] = tmp[2];
	ret[3 + 4] = tmp[3];
	
	if (typeof obj.deallocate === 'boolean') {
		ret[8] = obj.deallocate ? 1 : 0;
	} else {
		ret[8] = obj.deallocate;
	}

	ret[9] = obj.copy;
	ret[10] = obj.disposition;
	ret[11] = obj.type;

	return ret;
}

function u32xn_to_u8xn(buf) {
	var ret = new Uint8Array(buf.length * 4);
	
	for (var i = 0; i < buf.length; i++) {
		var tmp = u32_to_u8x4(buf[i]);
		ret[(i << 2) + 0] = tmp[0];
		ret[(i << 2) + 1] = tmp[1];
		ret[(i << 2) + 2] = tmp[2];
		ret[(i << 2) + 3] = tmp[3];
	}

	return ret;
}

function u8xn_to_u32xn(buf) {
	var ret = new Uint32Array(buf.length >>> 2);
	
	for (var i = 0; i < buf.length; i += 4) {
		var tmp = [buf[(i) + 0],
				   buf[(i) + 1],
				   buf[(i) + 2],
				   buf[(i) + 3]];
		ret[i >> 2] = u8x4_to_u32(tmp);
	}

	return ret;
}

/*
typedef struct{
	mach_msg_bits_t       msgh_bits;
	mach_msg_size_t       msgh_size;
	mach_port_t           msgh_remote_port;
	mach_port_t           msgh_local_port;
	mach_port_name_t      msgh_voucher_port;
	mach_msg_id_t         msgh_id;
} mach_msg_header_t;
 */
function mach_msg_header_t_buf_to_obj(buf) {
	var arr = u8xn_to_u32xn(buf);
	var ret = {};

	ret.msgh_bits = arr[0];
	ret.msgh_size = arr[1];
	ret.msgh_remote_port = arr[2];
	ret.msgh_local_port = arr[3];
	ret.msgh_voucher_port = arr[4];
	ret.msgh_id = arr[5];

	return ret;
}

function mach_msg_header_t_obj_to_buf(obj) {
	var arr = [obj.msgh_bits,
			   obj.msgh_size,
			   obj.msgh_remote_port,
			   obj.msgh_local_port,
			   obj.msgh_voucher_port,
			   obj.msgh_id];
	var ret = u32xn_to_u8xn(arr);

	return ret;
}

function mach_msg_body_t_buf_to_obj(buf) {
	var ret = {};

	ret.msgh_descriptor_count = u8x4_to_u32(buf);

	return ret;
}

function mach_msg_body_t_obj_to_buf(obj) {
	var ret = u32_to_u8x4(obj.msgh_descriptor_count);

	return ret;
}

function Request_sp_buf_to_obj(buf) {
	var ret = {};
	var Head_buf = buf.subarray(0, 24);
	var msgh_body_buf = buf.subarray(24, 28);
	var init_port_set_buf = buf.subarray(28);
	ret.Head = mach_msg_header_t_buf_to_obj(Head_buf);
	ret.msgh_body = mach_msg_body_t_buf_to_obj(msgh_body_buf);
	ret.init_port_set = new Array();
	
	for (var i = 0; i < (buf.length - 28) / 28; i++) {
		var init_port_set_buf = buf.subarray((i * 28) + 28);
		ret.init_port_set.push(mach_msg_ool_ports_descriptor_t_buf_to_obj(init_port_set_buf));
	}

	return ret;
}

function Request_sp_obj_to_buf(obj) {
	var ret = new Uint8Array(this.size * this.count);
	var tmp = mach_msg_header_t_obj_to_buf(obj.Head);
	var begin = 0;
	var i = 0;

	begin = i;

	for (; i < 24; i++) {
		ret[i] = tmp[i - begin];
	}

	begin = i;

	var tmp = mach_msg_body_t_obj_to_buf(obj.msgh_body);

	for (; i < 28; i++) {
		ret[i] = tmp[i - begin];
	}

	begin = i;

	for (var i = 0; i < obj.init_port_set.length; i++) {
		var tmp = mach_msg_ool_ports_descriptor_t_obj_to_buf(obj.init_port_set[i]);
		for (var j = 0; j < tmp.length; j++) {
			ret[begin + (i * 12) + j] = tmp[j];
		}
	}
	return ret;
}

var mach_msg_header_t = native_ptr_type(24,
	mach_msg_header_t_buf_to_obj,
	mach_msg_header_t_obj_to_buf);
var mach_msg_body_t = native_ptr_type(4,
	mach_msg_body_t_buf_to_obj,
	mach_msg_body_t_obj_to_buf);
var mach_msg_ool_ports_descriptor_t = native_ptr_type(12,
	mach_msg_ool_ports_descriptor_t_buf_to_obj,
	mach_msg_ool_ports_descriptor_t_obj_to_buf);
var Request_sp = native_ptr_type(24 + 4 + 12,
	Request_sp_buf_to_obj,
	Request_sp_obj_to_buf);
Request_sp.prototype.deref_all = true;

var mach_port_t = native_ptr_type(4);