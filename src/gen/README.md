# racoon exploit
this code generates a racoon configuration file to exploit the Rocky Racoon bugs, and obtain r/w in JSC.

file descriptions:
- `ip_tools.c` & `ip_tools.h` - code to generate ip addresses from `uint32_t`'s
- `patchfinder.c` & `patchfinder.h` - patchfinder for racoon, incomplete, many hardcoded offsets (mainly for ROP) are still used
- `shit.c` & `shit.h` - possibly unused code for formatting
- `stage0_primitives.c` & `stage0_primitives.h` - Rocky Racoon arbitrary relative 4-byte write
- `stage1_primitives.c` & `stage1_primitives.h` - `lcconf` arbitrary unslid write (stolen from @JakeBlair420)
- `stage2.c` & `stage2.h` - ROP chain generation code that sets up JSC with r/w, and runs the JS portion (stage3)
- `main.c` - main function & such
