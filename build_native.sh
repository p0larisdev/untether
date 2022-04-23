#!/bin/bash

rm exp.js
find js -name '*.js' -exec cat {} \; >> exp.js
echo >> exp.js
echo "main();" >> exp.js

# build for host
gcc	-I $(pwd)/inc/														\
		src/main.c															\
		src/ip_tools.c														\
		src/stage0_primitives.c												\
		src/stage1_primitives.c												\
		src/patchfinder.c													\
		src/stage2.c														\
		src/shit.c															\
		-o bin/main_arm															\
		-D__WHOAMI__="\"$(whoami)\""										\
		-D__PWD__="\"$(pwd)\""												\
		-g \
		--std=c99

ldid -Sent.xml bin/main_arm
