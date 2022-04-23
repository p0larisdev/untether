function puts(s) {
	return calls4arg("puts\0", sptr(s), 0, 0, 0);
}

function printf() {
	if (arguments.length > 4) {
		return printf("warning: tried to printf with %d args, max %d.\n", arguments.length, 4);
	}

	var args_to_pass = new Array();

	args_to_pass.push("printf");

	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i].constructor === String) {
			args_to_pass.push(sptr(arguments[i]));
		} else {
			args_to_pass.push(arguments[i]);
		}
	}

	var count_to_me = 5 - arguments.length;
	for (var i = 0; i < count_to_me; i++) {
		args_to_pass.push(0);
	}

	return calls4arg.apply(this, args_to_pass);
}