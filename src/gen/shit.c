#include <stdarg.h>
#include "common.h"
#include <stdio.h>
#include "shit.h"

extern FILE* fp;

int _asprintf(char **strp, const char *fmt, ...) {
	va_list ap;
	char* tmp = NULL;

	*strp = "";

	/*
	 *  shit
	 */

	va_start(ap, fmt);
	vfprintf(fp, fmt, ap);
	va_end(ap);

#if 0
	strcpy(fuck_memory_leaks, tmp);

	if (strp)
		*strp = fuck_memory_leaks;
	
	free(tmp);
#endif

	return 0;
}