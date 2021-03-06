"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Header_1 = require("../Util/Header");
const DataFormat_1 = require("../Util/DataFormat");
/**
 * The queue class that manages messages.
 * @since 0.1.0
 */
class Queue extends Map {
    constructor() {
        super(...arguments);
        /**
         * The remaining buffer to truncate with other buffers.
         * @since 0.1.0
         */
        this._rest = null;
    }
    /**
     * Returns a new Iterator object that parses each value for this queue.
     * @since 0.1.0
     */
    process(buffer) {
        if (this._rest) {
            const join = new Uint8Array(this._rest.byteLength + buffer.byteLength);
            join.set(this._rest);
            join.set(buffer, this._rest.byteLength);
            buffer = join;
            this._rest = null;
        }
        const output = [];
        while (buffer.byteLength !== 0) {
            // If the header separator was not found, it may be due to an impartial message
            /* istanbul ignore next: This is hard to reproduce in Azure, it needs the buffer to overflow and split to extremely precise byte lengths. */
            if (buffer.length <= 11) {
                this._rest = buffer;
                break;
            }
            const { id, receptive, byteLength } = Header_1.read(buffer);
            // If the message is longer than it can read, buffer the content for later
            if (byteLength > buffer.byteLength) {
                this._rest = buffer;
                break;
            }
            try {
                const value = DataFormat_1.deserialize(buffer);
                output.push({ id, receptive, data: value });
            }
            catch (error) {
                output.push({ id: null, receptive: false, data: error });
            }
            buffer = buffer.subarray(byteLength + 11);
        }
        return output;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=Queue.js.map