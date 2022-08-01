function dump_u32xn(buf) {
    var s = "";
    
    for (var i = 0; i < buf.length; i++) {
        s += pad_left(buf[i].toString(16), "0", 8);
    }

    return s;
}