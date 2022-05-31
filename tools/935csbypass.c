#include <stdint.h>
#include <stdio.h>

uint8_t payload[] = {
	0x42, 0x01, 0x04, 0xE3,
	0x44, 0x03, 0x44, 0xE3,
	0x1E, 0xFF, 0x2F, 0xE1,
};

int main(int argc, char* argv[]) {
	uint32_t (*lol)() = (uint32_t (*)())&payload;
	printf("Hello, world! %x\n", lol());
	return 0;
}