#include <unistd.h>
#include <stdio.h>

int main(int argc, char* argv[], char* envp[]) {
	char** environ_ = envp;

	FILE* fp = fopen("/tmp/envdump.txt", "w");

	while (*environ_) {
		fprintf(fp, "%s\n", *environ_);
		environ_++;
	}

	fclose(fp);

	return 0;
}