#ifndef STAGE0_PRIMITIVES_H
#define STAGE0_PRIMITIVES_H

#include <stdint.h>

extern uint32_t DNS4_OFFSET;
char* write32_slid(uint32_t where,
				   uint32_t what);

#endif