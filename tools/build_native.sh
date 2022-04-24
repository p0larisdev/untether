mkdir bin
rm bin/thread_shit
gcc thread_shit.c -o bin/thread_shit --std=c99
ldid -S bin/thread_shit

rm bin/testlol
gcc testlol.c -o bin/testlol --std=c99
ldid -S bin/testlol