# p0laris untether
this is a work-in-progress.

gets ROP in racoon, then gets JS code exec with RWC primitives (arbitrary r/w, currently up to 26-arg call primitive)

current offsets are included for `iPhone4,1` on `9.3.6 (13G37)` & `iPod5,1` on `9.3.5 (13G36)`. it may work on other devices and/or firmwares, but that's unlikely. (besides maybe `9.3.5 (13G36)` on `iPhone4,1`?)

clarification: the actual racoon exploit should work on any device/firmware with the same ipsec-tools version (and maybe build :P), but the JSC call portion is currently specific to one dyld_shared_cache, which is usually device & build unique. the underlying bug should work on any firmware before ~ iOS 12. my exploit is 32-bit only prolly, at least practically, due to less ASLR slides. the exploit to get arbitrary mem write should work on < iOS 12 as well (i think), but the ROP chain's gadget addresses are currently hardcoded to one build. 

### current install steps
- procure an `iPhone4,1` on `9.3.6 (13G37)`
- jailbreak with p0laris (or Phoenix if you're old fashioned)
- install GCC, git, etc
- `git clone https://github.com/p0larisdev/untether.git`
- `cd untether`
- `./build_native.sh`
- `./install_native.sh`
- `/usr/libexec/dhcpd -q -cf old_exp.conf` <- run the racoon exploit once
- or instead `/usr/libexec/dhcpd -q -cf exploit.conf` <- run the racoon exploit forever, ctrl+c  when it exits

tools include:
- `fuck_aslr` *should* fix the ASLR slide for all new processes on the kernel level, offsets are for `iPhone4,1` `9.3.6 (13G37)` atm
- `jsc_fun` was a tool to test JavaScriptCore arb r/w prims, source got deleted tho, i'll prolly rewrite it sometime
- `shit` includes mostly thread-based call prim testing code
- `shc/` contains WIP C shellcode compilation
- and prolly more

~~current need is just to get a better call primitive, from what i can tell the phoenix bugs can't be exploited with only 4 args to functions. not sure how to get that better primitive working tho, so we'll see. :P~~ nevermind lol, 26 (and maybe more) should be enough, kek

greetz to @tihmstar for help with 935csbypass
