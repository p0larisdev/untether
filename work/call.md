# call primitive

4-arg call primitive (fast b0i) works like this:
- backup `atan2` lazy symbol address
- take 4 32-bit args and pack them into 2 doubles. 1 double (64-bits) is passed as 2 registers (32-bits), thus giving us 4 32-bit args.
- overwrite `atan2` lazy symbol address with addy to call (used by `Math.atan2`)
- call `Math.atan2` with args, get ret val from same function
- replace `atan2` lazy symbol address with its real value
- return ret val

26-arg call primitive (slower b0i) works like this:
- overwrite lazy symbol address for __stack_chk_fail (doesn't specifically need to be that function, i just use it as it shouldn't be called in normal operation anyway), with its own resolver, so calling it will just spin.
- create a new pthread running __stack_chk_fail's resolver, so it spins indefinitely
- get the mach thread port thing for that pthread, for later
- suspend the thread
- allocate some memory for the mach thread state
- allocate some memory for a fake stack
- write first 4 arguments to r0-r3 in the thread state itself
- place the rest of the args on the fake stack, and set the stack ptr to point to the fake stack
- set return address (lr) to a ROP gadget that adds 0x3c to the stack, and pops a bunch of reg's (more args)
- write pthread_exit to fake stack + 0x58, where the pc will be popped from
- run pthread_join
- wait
- pthread_exit exits the thread, r0 contains the function we called's return value, which will be grabbed by pthread_join
- pthread_join writes the ret val to a known location, which we then read the return value from
- return the ret val