/*
 * ip_tools
 */

#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>

#include "ip_tools.h"

char* uint32_t_to_ip(uint32_t val) {
	uint8_t byte1	= (val >>  0) & 0xff;
	uint8_t byte2	= (val >>  8) & 0xff;
	uint8_t byte3	= (val >> 16) & 0xff;
	uint8_t byte4	= (val >> 24) & 0xff;
	char* ret		= NULL;

	asprintf(&ret,	"%u.%u.%u.%u",
			 byte1,
			 byte2,
			 byte3,
			 byte4);
	return ret;
}