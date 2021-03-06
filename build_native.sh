#!/bin/bash

rm exp.js
find src/js -name '*.js' -exec cat {} \; >> exp.js
echo >> exp.js
echo "main();" >> exp.js

# build for host
gcc	-I $(pwd)/inc/															\
		src/gen/main.c														\
		src/gen/ip_tools.c													\
		src/gen/stage0_primitives.c											\
		src/gen/stage1_primitives.c											\
		src/gen/patchfinder.c												\
		src/gen/stage2.c													\
		src/gen/shit.c														\
		-o bin/main_arm														\
		-D__WHOAMI__="\"$(whoami)\""										\
		-D__PWD__="\"$(pwd)\""												\
		-g 																	\
		--std=c99

ldid -Sent.xml bin/main_arm
