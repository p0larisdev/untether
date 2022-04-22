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

void* memmem(const void *l, size_t l_len, const void *s, size_t s_len);

#endif
