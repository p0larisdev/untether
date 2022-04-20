#ifndef COMMON_H
#define COMMON_H

#include <stdint.h>
#include <stdlib.h>

struct racoon_offsets {
	uint32_t dns4_offset;
	uint32_t lc_conf_offset;
	uint32_t stack_base;
};

extern char* fuck_memory_leaks;

#endif