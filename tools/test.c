#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

#include <vproc.h>

#define LC_DEFAULT_CF	SYSCONFDIR "/racoon.conf"

typedef char vchar_t;

#define LC_PATHTYPE_INCLUDE	0
#define LC_PATHTYPE_PSK		1
#define LC_PATHTYPE_CERT	2
#define LC_PATHTYPE_BACKUPSA	3
#define LC_PATHTYPE_SCRIPT	4
#define LC_PATHTYPE_PIDFILE	5
#define LC_PATHTYPE_LOGFILE	6
#define LC_PATHTYPE_MAX		7

#define LC_DEFAULT_PAD_MAXSIZE		20
#define LC_DEFAULT_PAD_RANDOM		TRUE
#define LC_DEFAULT_PAD_RANDOMLEN	FALSE
#define LC_DEFAULT_PAD_STRICT		FALSE
#define LC_DEFAULT_PAD_EXCLTAIL		TRUE
#define LC_DEFAULT_RETRY_COUNTER	5
#define LC_DEFAULT_RETRY_INTERVAL	10
#define LC_DEFAULT_COUNT_PERSEND	1
#define LC_DEFAULT_RETRY_CHECKPH1	30
#define LC_DEFAULT_WAIT_PH2COMPLETE	30
#define LC_DEFAULT_NATT_KA_INTERVAL	20

#define LC_DEFAULT_SECRETSIZE	16	/* 128 bits */

#define LC_IDENTTYPE_MAX	5	/* XXX */

#define	LC_GSSENC_UTF16LE	0	/* GSS ID in UTF-16LE */
#define	LC_GSSENC_LATIN1	1	/* GSS ID in ISO-Latin-1 */
#define	LC_GSSENC_MAX		2

#define LC_AUTOEXITSTATE_SET		0x00000001
#define LC_AUTOEXITSTATE_CLIENT		0x00000010
#define LC_AUTOEXITSTATE_ENABLED	0x00000011	/* both VPN client and set */

struct a {
    char *logfile_param;		/* from command line */
	char *pathinfo[LC_PATHTYPE_MAX];
	vchar_t *ident[LC_IDENTTYPE_MAX]; /* base of Identifier payload. */

	int pad_random;
	int pad_randomlen;
	int pad_maxsize;
	int pad_strict;
	int pad_excltail;
};

int main() {
    int* a = malloc(0x100);
    *a = 0x1;
    printf("%x", *(int*)a + 0xa4);
    printf("%x\n", sizeof(struct a));
}