#!/bin/bash

rm exp.js
find src/js -name '*.js' -exec cat {} \; >> exp.js
echo >> exp.js
echo "main();" >> exp.js

# build for host
clang	-I $(pwd)/inc/														\
		src/gen/main.c														\
		src/gen/ip_tools.c													\
		src/gen/stage0_primitives.c											\
		src/gen/stage1_primitives.c											\
		src/gen/patchfinder.c												\
		src/gen/stage2.c													\
		src/gen/shit.c														\
		-o bin/main															\
		-D__WHOAMI__="\"$(whoami)\""										\
		-D__PWD__="\"$(pwd)\""												\
		-g
#		-rdynamic

# build armv7 (for untether install)
xcrun -sdk iphoneos clang -arch armv7	src/gen/main.c						\
										src/gen/ip_tools.c					\
										src/gen/stage0_primitives.c			\
										src/gen/stage1_primitives.c			\
										src/gen/patchfinder.c				\
										src/gen/stage2.c					\
										src/gen/shit.c						\
										-o bin/main_arm						\
										-D__WHOAMI__="\"$(whoami)\""		\
										-D__PWD__="\"$(pwd)\""				\
										-framework JavaScriptCore			\
										-g

ldid -Sent.xml bin/main_arm
