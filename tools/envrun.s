	.cstring
	.align 2
LC0:
	.ascii "SHELL=/bin/sh\0"
	.align 2
LC1:
	.ascii "USER=mobile\0"
	.align 2
LC2:
	.ascii "HOME=/var/mobile\0"
	.align 2
LC3:
	.ascii "XPC_FLAGS=0x0\0"
	.align 2
LC4:
	.ascii "XPC_SERVICE_NAME=0\0"
	.align 2
LC5:
	.ascii "LOGNAME=mobile\0"
	.align 2
LC6:
	.ascii "PATH=/usr/bin:/bin:/usr/sbin:/sbin\0"
	.align 2
LC7:
	.ascii "__CF_USER_TEXT_ENCODING=0x1F5:0:0\0"
	.const_data
	.align 2
_C.2.2397:
	.long	LC0
	.long	LC1
	.long	LC2
	.long	LC3
	.long	LC4
	.long	LC5
	.long	LC6
	.long	LC7
	.long	0
	.cstring
	.align 2
LC8:
	.ascii "/bin/sh\0"
	.const_data
	.align 2
_C.1.2396:
	.long	LC8
	.long	0
	.text
	.align 2
	.globl _main
_main:
	@ args = 0, pretend = 0, frame = 52
	@ frame_needed = 1, uses_anonymous_args = 0
	stmfd	sp!, {r4, r7, lr}
	add	r7, sp, #4
	sub	sp, sp, #52
	str	r0, [sp, #4]
	str	r1, [sp, #0]
	ldr	r3, L7
L2:
	add	r3, pc, r3
	ldmia	r3, {r3-r4}
	str	r3, [sp, #44]
	str	r4, [sp, #48]
	ldr	r3, L7+4
L3:
	add	r3, pc, r3
	add	lr, sp, #8
	mov	ip, r3
	ldmia	ip!, {r0, r1, r2, r3}
	stmia	lr!, {r0, r1, r2, r3}
	ldmia	ip!, {r0, r1, r2, r3}
	stmia	lr!, {r0, r1, r2, r3}
	ldr	r3, [ip, #0]
	str	r3, [lr, #0]
	add	ip, sp, #8
	ldr	r3, L7+8
L4:
	add	r3, pc, r3
	mov	r0, r3
	ldr	r3, L7+12
L5:
	add	r3, pc, r3
	mov	r1, r3
	mov	r2, #0
	mov	r3, ip
	bl	L_execle$stub
	mov	r3, #0
	mov	r0, r3
	sub	sp, r7, #4
	ldmfd	sp!, {r4, r7, pc}
	.p2align 2
L8:
	.align 2
L7:
	.long	_C.1.2396-8-(L2)
	.long	_C.2.2397-8-(L3)
	.long	LC8-8-(L4)
	.long	LC8-8-(L5)
	.section __TEXT,__picsymbolstub4,symbol_stubs,none,16
	.align 2
L_execle$stub:
	.indirect_symbol _execle
	ldr	ip, L_execle$slp
L1$scv:	add	ip, pc, ip
	ldr	pc, [ip, #0]
L_execle$slp:
	.long	L_execle$lazy_ptr - (L1$scv + 8)
	.lazy_symbol_pointer
L_execle$lazy_ptr:
	.indirect_symbol	_execle
	.long	dyld_stub_binding_helper
	.subsections_via_symbols
