"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Header_1 = require("../Util/Header");
const DataFormat_1 = require("../Util/DataFormat");
class NodeMessage {
    /**
     * @since 0.0.1
     * @param client The socket that received this message.
     * @param id The ID of the message.
     * @param receptive Whether or not this message accepts a reply.
     * @param data The data received from the socket.
     */
    constructor(client, id, receptive, data) {
        Object.defineProperties(this, {
            client: { value: client },
            id: { value: id, enumerable: true },
            receptive: { value: receptive, enumerable: true }
        });
        this.data = data;
    }
    /**
     * Reply to the socket.
     * @since 0.0.1
     * @param content The content to send.
     */
    reply(content) {
        if (this.receptive) {
            this.client.socket.write(Header_1.createFromID(this.id, false, DataFormat_1.serialize(content)));
        }
    }
    /**
     * Freeze the message.
     * @since 0.0.1
     */
    freeze() {
        return Object.freeze(this);
    }
    /**
     * The toJSON overload for JSON.stringify.
     * @since 0.0.1
     */
    toJSON() {
        return {
            id: this.id,
            data: this.data,
            receptive: this.receptive
        };
    }
    /**
     * The toString overload for string casting.
     * @since 0.0.1
     */
    toString() {
        return `NodeMessage<${this.id}>`;
    }
}
exports.NodeMessage = NodeMessage;
//# sourceMappingURL=NodeMessage.js.map