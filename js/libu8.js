/*
 *  turn a uint32_t into a little-endian 4 byte array
 */
function u32_to_u8x4(val) {
	u8x4 = new Uint8Array(0x4);

	val_ = val >>> 0;

	u8x4[0] = ((val_ >>  0) & 0xff);
	u8x4[1] = ((val_ >>  8) & 0xff);
	u8x4[2] = ((val_ >> 16) & 0xff);
	u8x4[3] = ((val_ >> 24) & 0xff);

	return u8x4;
}

/*
 *  turn a uint16_t into a little-endian 2 byte array
 */
function u16_to_u8x2(val) {
	u8x2 = new Uint8Array(0x2);

	val_ = val >>> 0;

	u8x2[0] = ((val_ >>  0) & 0xff);
	u8x2[1] = ((val_ >>  8) & 0xff);

	return u8x2;
}

/*
 *  turn a little-endian 4 byte array into a uint32_t
 */
function u8x4_to_u32(buf) {
	u32  = 0x0;

	u32 += (buf[0] <<  0);
	u32 += (buf[1] <<  8);
	u32 += (buf[2] << 16);
	u32 += (buf[3] << 24);

	return u32 >>> 0;
}

/*
 *  turn a little-endian 2 byte array into a uint16_t
 */
function u8x2_to_u16(buf) {
	u16  = 0x0;

	u16 += (buf[0] <<  0);
	u16 += (buf[1] <<  8);

	return u16 >>> 0;

}
