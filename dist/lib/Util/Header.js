"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let i = 0;
/**
 * Create a new message.
 * @since 0.6.0
 * @param receptive Whether the message is receptive or not.
 * @param bytes The bytes to write in this message.
 * @internal
 * @private
 */
function create(receptive, bytes) {
    const header = new Uint8Array(11 + bytes.byteLength);
    writeDate(header, Date.now());
    writeIncrement(header, i);
    writeReceptive(header, receptive);
    write32At(header, bytes.byteLength, 7);
    header.set(bytes, 11);
    /* istanbul ignore next: Basic arithmetic, but needs to run 458745 times for the other branch to run. */
    i = i < 0xFFFF ? i + 1 : 0;
    return header;
}
exports.create = create;
/**
 * Create a new message given a numeric ID.
 * @since 0.6.0
 * @param id The ID to create the header from.
 * @param receptive Whether the message is receptive or not.
 * @param bytes The bytes to write in this message.
 * @internal
 * @private
 */
function createFromID(id, receptive, bytes) {
    const header = new Uint8Array(11 + bytes.byteLength);
    writeDate(header, Number(BigInt(id) >> 16n));
    writeIncrement(header, id & 0xFFFF);
    writeReceptive(header, receptive);
    write32At(header, bytes.byteLength, 7);
    header.set(bytes, 11);
    return header;
}
exports.createFromID = createFromID;
/**
 * Read the header data.
 * @since 0.6.0
 * @param header The header buffer to read from.
 * @internal
 * @private
 */
function read(header) {
    return {
        id: readID(header),
        receptive: Boolean(header[6]),
        byteLength: read32At(header, 7)
    };
}
exports.read = read;
/**
 * Write the date part of the header.
 * @since 0.6.0
 * @param header The header buffer to write to.
 * @param date The date to write into the header.
 * @internal
 * @private
 */
function writeDate(header, date) {
    write32At(header, date % 0xFFFFFFFF, 0);
}
exports.writeDate = writeDate;
/**
 * Write the increment part of the header.
 * @since 0.6.0
 * @param header The header buffer to write to.
 * @param increment The increment number to write.
 * @internal
 * @private
 */
function writeIncrement(header, increment) {
    header[5] = increment & 0xFF;
    increment >>= 8;
    header[4] = increment & 0xFF;
}
exports.writeIncrement = writeIncrement;
/**
 * Write a 32-bit value into the header.
 * @since 0.6.0
 * @param buffer The buffer to read at.
 * @param value The value to be written.
 * @param offset The offset at which the data should be written.
 * @internal
 * @private
 */
function write32At(buffer, value, offset) {
    buffer[offset + 3] = value;
    value >>>= 8;
    buffer[offset + 2] = value;
    value >>>= 8;
    buffer[offset + 1] = value;
    value >>>= 8;
    buffer[offset] = value;
}
exports.write32At = write32At;
/**
 * Write the receptive part of the header.
 * @since 0.6.0
 * @param header The header buffer to write to.
 * @param receptive Whether the message should be receptive or not.
 * @internal
 * @private
 */
function writeReceptive(header, receptive) {
    header[6] = receptive ? 1 : 0;
}
exports.writeReceptive = writeReceptive;
/**
 * Read the numeric ID from this header.
 * @since 0.6.0
 * @param header The header buffer to read from.
 * @internal
 * @private
 */
function readID(header) {
    return Number(BigInt(readDate(header)) << 16n) + readIncrement(header);
}
exports.readID = readID;
/**
 * Read the date part of the ID from this header.
 * @since 0.6.0
 * @param header The header buffer to read from.
 * @internal
 * @private
 */
function readDate(header) {
    return read32At(header, 0);
}
exports.readDate = readDate;
/**
 * Read the increment part of the ID from this header.
 * @since 0.6.0
 * @param header The header buffer to read from.
 * @internal
 * @private
 */
function readIncrement(header) {
    return (header[4] << 0o10) + header[5];
}
exports.readIncrement = readIncrement;
/**
 * Read a 32-bit number from a buffer.
 * @since 0.6.0
 * @param buffer The buffer to read from.
 * @param offset The offset at which this should read at.
 * @internal
 * @private
 */
function read32At(buffer, offset) {
    return (buffer[offset++] * (2 ** 24)) +
        (buffer[offset++] * (2 ** 16)) +
        (buffer[offset++] * (2 ** 8)) +
        buffer[offset++];
}
exports.read32At = read32At;
//# sourceMappingURL=Header.js.map