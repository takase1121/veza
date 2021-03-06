"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const ServerSocket_1 = require("./ServerSocket");
const events_1 = require("events");
/**
 * The connection status of this server.
 * @since 0.7.0
 */
var ServerStatus;
(function (ServerStatus) {
    /**
     * The server is opening, this is set immediately after calling listen.
     * @since 0.7.0
     */
    ServerStatus[ServerStatus["Opening"] = 0] = "Opening";
    /**
     * The server is connected and ready to get connections.
     * @since 0.7.0
     */
    ServerStatus[ServerStatus["Opened"] = 1] = "Opened";
    /**
     * The server is closing, this is set immediately after calling close.
     * @since 0.7.0
     */
    ServerStatus[ServerStatus["Closing"] = 2] = "Closing";
    /**
     * The server is closed and free to listen to a port.
     * @since 0.7.0
     */
    ServerStatus[ServerStatus["Closed"] = 3] = "Closed";
})(ServerStatus = exports.ServerStatus || (exports.ServerStatus = {}));
/**
 * The server that receives connections.
 */
class Server extends events_1.EventEmitter {
    constructor(name, ...args) {
        super();
        /**
         * The sockets map for this server. Each value is a ServerSocket instance that identifies as an incoming connection
         * to the server.
         * @since 0.7.0
         */
        this.sockets = new Map();
        /**
         * The status of this server.
         * @since 0.7.0
         */
        this.status = ServerStatus.Closed;
        this.name = name;
        this.server = new net_1.Server(...args);
    }
    /**
     * Get a NodeSocket by its name or Socket.
     * @since 0.7.0
     * @param name The NodeSocket to get.
     */
    get(name) {
        if (typeof name === 'string')
            return this.sockets.get(name) || null;
        if (name instanceof ServerSocket_1.ServerSocket)
            return name;
        throw new TypeError('Expected a string or a ServerClient instance.');
    }
    /**
     * Check if a NodeSocket exists by its name of Socket.
     * @since 0.7.0
     * @param name The NodeSocket to get.
     */
    has(name) {
        return Boolean(this.get(name));
    }
    /**
     * Send a message to a connected socket.
     * @since 0.7.0
     * @param name The label name of the socket to send the message to.
     * @param data The data to send to the socket.
     * @param options The options for this message.
     */
    sendTo(name, data, options) {
        const nodeSocket = this.get(name);
        return nodeSocket
            ? nodeSocket.send(data, options)
            : Promise.reject(new Error('Failed to send to the socket: It is not connected to this server.'));
    }
    /**
     * Broadcast a message to all connected sockets from this server.
     * @since 0.7.0
     * @param data The data to send to other sockets.
     * @param options The options for this broadcast.
     */
    broadcast(data, { receptive, timeout, filter } = {}) {
        if (filter && !(filter instanceof RegExp)) {
            throw new TypeError(`filter must be a RegExp instance.`);
        }
        const test = filter ? (name) => filter.test(name) : () => true;
        const promises = [];
        for (const [name, client] of this.sockets.entries()) {
            if (test(name))
                promises.push(client.send(data, { receptive, timeout }));
        }
        return Promise.all(promises);
    }
    async listen(...options) {
        this.status = ServerStatus.Opening;
        await new Promise((resolve, reject) => {
            /* eslint-disable @typescript-eslint/no-use-before-define */
            const onListening = () => resolve(cleanup(this, ServerStatus.Opened));
            const onClose = () => reject(cleanup(this, ServerStatus.Closed));
            const onError = (error) => reject(cleanup(error, ServerStatus.Closed));
            /* eslint-enable @typescript-eslint/no-use-before-define */
            const cleanup = (value, status) => {
                this.server.off('listening', onListening);
                this.server.off('close', onClose);
                this.server.off('error', onError);
                this.status = status;
                return value;
            };
            this.server
                .on('listening', onListening)
                .on('close', onClose)
                .on('error', onError);
            this.server.listen(...options);
        });
        this.emit('open');
        this.server
            .on('connection', this._onConnection.bind(this))
            .on('error', this._onError.bind(this))
            .on('close', this._onClose.bind(this));
        return this;
    }
    /**
     * Disconnect the server and rejects all current messages.
     * @since 0.7.0
     */
    async close(closeSockets) {
        // If it's closing or closed, do nothing
        if (this.status === ServerStatus.Closing || this.status === ServerStatus.Closed)
            return false;
        this.status = ServerStatus.Closing;
        // Disconnect all sockets
        for (const socket of this.sockets.values()) {
            socket.disconnect(closeSockets);
        }
        await new Promise((resolve, reject) => {
            this.server.close(error => {
                /* istanbul ignore next: Hard to reproduce, it is a safe guard. */
                if (error) {
                    reject(error);
                }
                else {
                    this.status = ServerStatus.Closed;
                    resolve();
                }
            });
        });
        this.emit('close');
        return true;
    }
    /**
     * Connection listener.
     * @since 0.7.0
     * @param socket The received socket
     */
    _onConnection(socket) {
        new ServerSocket_1.ServerSocket(this, socket).setup();
    }
    /**
     * Error listener.
     * @since 0.7.0
     * @param error The error received.
     */
    _onError(error) {
        /* istanbul ignore next: Hard to reproduce in Azure. */
        this.emit('error', error, null);
    }
    /**
     * The close listener.
     * @since 0.7.0
     */
    _onClose() {
        this.close();
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map