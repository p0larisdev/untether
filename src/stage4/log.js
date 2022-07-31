function p0laris_log() {
	var args = [];
	for (var i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}

	if (args.length > 1) {
		printf.apply(this, [args[0] + "\n"].concat(args.slice(1)));
	} else {
		printf.apply(this, [args[0] + "\n"]);
	}
	syslog.apply(this, [LOG_SYSLOG].concat(args));

	return;
}