"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Header_1 = require("./Header");
const DataFormat_1 = require("../Util/DataFormat");
/**
 * The VCLOSE signal's message content to be sent.
 * @since 0.7.0
 * @internal
 * @private
 */
exports.VCLOSE_SIGNAL = 'VCLOSE';
/**
 * The VCLOSE signal.
 * @since 0.7.0
 * @internal
 * @private
 */
exports.VCLOSE = Header_1.createFromID(0, false, DataFormat_1.serialize(exports.VCLOSE_SIGNAL));
/**
 * Check whether the message is a VCLOSE signal.
 * @since 0.7.0
 * @param processed The processed data from the socket.
 * @internal
 * @private
 */
function receivedVClose(processed) {
    return processed.id === 0 && processed.receptive === false && processed.data === exports.VCLOSE_SIGNAL;
}
exports.receivedVClose = receivedVClose;
function normalizeLen(data) {
    return Buffer.isBuffer(data) ? data.length : data.byteLength;
}
exports.normalizeLen = normalizeLen;
//# sourceMappingURL=Shared.js.map