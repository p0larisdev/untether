#ifndef PATCHFINDER_H
#define PATCHFINDER_H

#include <stdint.h>

uint32_t find_dns4_offset(uint32_t region,
						  uint8_t* bin,
						  size_t   size);

uint32_t find_lc_conf_offset(uint32_t region,
							 uint8_t* bin,
							 size_t   size);

#endif