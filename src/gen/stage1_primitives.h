#ifndef STAGE1_PRIMITIVES_H
#define STAGE1_PRIMITIVES_H

#include <stdint.h>

extern uint32_t LC_CONF_OFFSET;

char* write32_unslid(uint32_t where,
					 uint32_t what);

char* writebuf_old_unslid(uint32_t	where,
						  char*    what,
						  uint32_t len);

char* writebuf_unslid(uint32_t	where,
					  char*    what,
					  uint32_t len);

#endif