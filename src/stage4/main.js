function main() {
	printf("[*] landed in stage4\n");
	syslog(LOG_SYSLOG, "we out here");

	printf("[*] p0laris.dyld_shc_slide=0x%08x\n", p0laris.dyld_shc_slide);
	printf("[*] p0laris.racoon_slide=0x%08x\n", p0laris.racoon_slide);

	return 0;
}