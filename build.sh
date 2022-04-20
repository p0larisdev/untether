#!/bin/bash

cat js/*.js > exp.js
echo >> exp.js
echo "main();" >> exp.js

# build for host
clang	-I $(pwd)/inc/														\
		src/main.c															\
		src/ip_tools.c														\
		src/stage0_primitives.c												\
		src/stage1_primitives.c												\
		src/patchfinder.c													\
		src/stage2.c														\
		src/shit.c															\
		-o bin/main															\
		-D__WHOAMI__="\"$(whoami)\""										\
		-D__PWD__="\"$(pwd)\""												\
		-g 

# build armv7 (for untether install)
xcrun -sdk iphoneos clang -arch armv7	src/main.c							\
										src/ip_tools.c						\
										src/stage0_primitives.c				\
										src/stage1_primitives.c				\
										src/patchfinder.c					\
										src/stage2.c						\
										src/shit.c							\
										-o bin/main_arm						\
										-D__WHOAMI__="\"$(whoami)\""		\
										-D__PWD__="\"$(pwd)\""				\
										-framework JavaScriptCore			\
										-g

ldid -Sent.xml bin/main_arm