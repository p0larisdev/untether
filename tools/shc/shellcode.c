/*
 *  native C shellcode
 */

typedef unsigned int uint32_t;

void shellcode(void) {
	*(uint32_t*)0x41414141 = 0x42424242;
//	__builtin_unreachable();
}