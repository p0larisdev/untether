#ifndef SHITTY_ROP_H
#define SHITTY_ROP_H

#include <stdint.h>

struct rop_chain_shit_t {
	uint32_t* teh_chain;
	uint32_t  chain_len;
};

typedef struct rop_chain_shit_t* rop_chain_shit;

#define GARBAGE 0x6A9BA6E
//#define UNUSED 0xEEEEEEEE
#define UNUSED 0x40000000 | (0x100000 + (__LINE__))

rop_chain_shit gen_rop_chain(uint32_t base,
							 uint32_t default_domain_addr,
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
							 uint32_t other_weird_r3);

#endif