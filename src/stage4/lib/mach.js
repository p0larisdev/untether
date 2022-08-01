function MACH_MSGH_BITS(remote, local) {
    return ((remote) | ((local) << 8));
}

var MACH_MSGH_BITS_COMPLEX = 0x80000000;
var MACH_MSG_TYPE_MAKE_SEND_ONCE = 21;