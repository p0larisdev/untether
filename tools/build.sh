mkdir bin
xcrun -sdk iphoneos clang -arch armv7 fuck_aslr.c -o bin/fuck_aslr; ldid -Sent.xml bin/fuck_aslr; cat bin/fuck_aslr | ssh root@localhost -p 2222 "rm fuck_aslr; cat > fuck_aslr; chmod +x fuck_aslr"
xcrun -sdk iphoneos clang -arch armv7 fuck_aslr2.c -o bin/fuck_aslr2; ldid -Sent.xml bin/fuck_aslr2; cat bin/fuck_aslr2 | ssh root@localhost -p 2222 "rm fuck_aslr2; cat > fuck_aslr2; chmod +x fuck_aslr2"
xcrun -sdk iphoneos clang -arch armv7 fuck_ptr.c -o bin/fuck_ptr; ldid -S bin/fuck_ptr; cat bin/fuck_ptr | ssh root@localhost -p 2222 "rm fuck_ptr; cat > fuck_ptr; chmod +x fuck_ptr"
xcrun -sdk iphoneos clang -arch armv7 jit_all_the_things.c -o bin/jit_all_the_things; ldid -S bin/jit_all_the_things; cat bin/jit_all_the_things | ssh root@localhost -p 2222 "rm jit_all_the_things; cat > jit_all_the_things; chmod +x jit_all_the_things"
xcrun -sdk iphoneos clang -arch armv7 jsc_fun.c -framework JavaScriptCore -o bin/jsc_fun; ldid -S bin/jsc_fun; cat bin/jsc_fun | ssh root@localhost -p 2222 "rm jsc_fun; cat > jsc_fun; chmod +x jsc_fun"

scp -P 2222 lol.js root@localhost:/var/root/lol.js