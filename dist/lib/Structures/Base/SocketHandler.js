"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeMessage_1 = require("../NodeMessage");
const Queue_1 = require("../Queue");
const Header_1 = require("../../Util/Header");
const DataFormat_1 = require("../../Util/DataFormat");
/**
 * The abstract socket handler for {@link ClientSocket} and {@link ServerSocket}.
 * @since 0.0.1
 * @private
 */
class SocketHandler {
    /**
     * @since 0.0.1
     * @param name The name for this socket handler.
     * @param socket The socket that will manage this instance.
     */
    constructor(name, socket) {
        /**
         * The incoming message queue for this handler.
         * @since 0.1.0
         */
        this.queue = new Queue_1.Queue();
        this.name = name;
        this.socket = socket;
    }
    /**
     * Send a message to a connected socket.
     * @param data The data to send to the socket
     * @param options The options for this message
     */
    send(data, options = {}) {
        if (this.socket.destroyed) {
            return Promise.reject(new Error('Cannot send a message to a missing socket.'));
        }
        const { receptive = true, timeout = -1 } = options;
        return new Promise((resolve, reject) => {
            let id;
            try {
                const serialized = DataFormat_1.serialize(data);
                const message = Header_1.create(receptive, serialized);
                id = Header_1.read(message).id;
                this.socket.write(message);
                if (!receptive) {
                    resolve(undefined);
                    return;
                }
                const timer = timeout === -1
                    ? null
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    : setTimeout(() => send(reject, true, new Error('Timed out.')), timeout);
                const send = (fn, fromTimer, response) => {
                    if (timer && !fromTimer)
                        clearTimeout(timer);
                    this.queue.delete(id);
                    return fn(response);
                };
                this.queue.set(id, {
                    resolve: send.bind(null, resolve, false),
                    reject: send.bind(null, reject, false)
                });
            }
            catch (error) {
                /* istanbul ignore next: Hard to reproduce, this is a safe-guard. */
                const entry = this.queue.get(id);
                /* istanbul ignore next: Hard to reproduce, this is a safe-guard. */
                if (entry)
                    entry.reject(error);
                /* istanbul ignore next: Hard to reproduce, this is a safe-guard. */
                else
                    reject(error);
            }
        });
    }
    _handleMessage(message) {
        // Response message
        const queueData = this.queue.get(message.id);
        if (queueData) {
            queueData.resolve(message.data);
            return null;
        }
        return new NodeMessage_1.NodeMessage(this, message.id, message.receptive, message.data).freeze();
    }
}
exports.SocketHandler = SocketHandler;
//# sourceMappingURL=SocketHandler.js.map