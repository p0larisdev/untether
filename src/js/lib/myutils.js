function puts(s) {
	return calls4arg("puts\0", sptr(s + "\0"), 0, 0, 0);
}

function printf() {
	for (var i = 0; i < arguments.length; i++) {
		puts(arguments[i]);
	}
}