/**
 * Create a new message.
 * @since 0.6.0
 * @param receptive Whether the message is receptive or not.
 * @param bytes The bytes to write in this message.
 * @internal
 * @private
 */
export declare function create(receptive: boolean, bytes: Uint8Array): Uint8Array;
/**
 * Create a new message given a numeric ID.
 * @since 0.6.0
 * @param id The ID to create the header from.
 * @param receptive Whether the message is receptive or not.
 * @param bytes The bytes to write in this message.
 * @internal
 * @private
 */
export declare function createFromID(id: number, receptive: boolean, bytes: Uint8Array): Uint8Array;
/**
 * Read the header data.
 * @since 0.6.0
 * @param header The header buffer to read from.
 * @internal
 * @private
 */
export declare function read(header: Uint8Array): {
    id: number;
    receptive: boolean;
    byteLength: number;
};
/**
 * Write the date part of the header.
 * @since 0.6.0
 * @param header The header buffer to write to.
 * @param date The date to write into the header.
 * @internal
 * @private
 */
export declare function writeDate(header: Uint8Array, date: number): void;
/**
 * Write the increment part of the header.
 * @since 0.6.0
 * @param header The header buffer to write to.
 * @param increment The increment number to write.
 * @internal
 * @private
 */
export declare function writeIncrement(header: Uint8Array, increment: number): void;
/**
 * Write a 32-bit value into the header.
 * @since 0.6.0
 * @param buffer The buffer to read at.
 * @param value The value to be written.
 * @param offset The offset at which the data should be written.
 * @internal
 * @private
 */
export declare function write32At(buffer: Uint8Array, value: number, offset: number): void;
/**
 * Write the receptive part of the header.
 * @since 0.6.0
 * @param header The header buffer to write to.
 * @param receptive Whether the message should be receptive or not.
 * @internal
 * @private
 */
export declare function writeReceptive(header: Uint8Array, receptive: boolean): void;
/**
 * Read the numeric ID from this header.
 * @since 0.6.0
 * @param header The header buffer to read from.
 * @internal
 * @private
 */
export declare function readID(header: Uint8Array): number;
/**
 * Read the date part of the ID from this header.
 * @since 0.6.0
 * @param header The header buffer to read from.
 * @internal
 * @private
 */
export declare function readDate(header: Uint8Array): number;
/**
 * Read the increment part of the ID from this header.
 * @since 0.6.0
 * @param header The header buffer to read from.
 * @internal
 * @private
 */
export declare function readIncrement(header: Uint8Array): number;
/**
 * Read a 32-bit number from a buffer.
 * @since 0.6.0
 * @param buffer The buffer to read from.
 * @param offset The offset at which this should read at.
 * @internal
 * @private
 */
export declare function read32At(buffer: Uint8Array, offset: number): number;
