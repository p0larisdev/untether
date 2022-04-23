function puts(s) {
	return calls4arg("puts\0", sptr(s), 0, 0, 0);
}