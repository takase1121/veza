"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketHandler_1 = require("./Structures/Base/SocketHandler");
const net_1 = require("net");
const DataFormat_1 = require("./Util/DataFormat");
const Header_1 = require("./Util/Header");
const MessageError_1 = require("./Structures/MessageError");
const Shared_1 = require("./Util/Shared");
/**
 * The connection status of this socket.
 * @since 0.7.0
 */
var ClientSocketStatus;
(function (ClientSocketStatus) {
    /**
     * The ready status, the socket has successfully connected and identified with the server.
     * @since 0.7.0
     */
    ClientSocketStatus[ClientSocketStatus["Ready"] = 0] = "Ready";
    /**
     * The connected status, the socket has successfully connected, but has not identified yet.
     * @since 0.7.0
     */
    ClientSocketStatus[ClientSocketStatus["Connected"] = 1] = "Connected";
    /**
     * The connecting status, the socket is not ready to operate but is attempting to connect.
     * @since 0.7.0
     */
    ClientSocketStatus[ClientSocketStatus["Connecting"] = 2] = "Connecting";
    /**
     * The disconnected status, the socket is idle and not ready to operate.
     * @since 0.7.0
     */
    ClientSocketStatus[ClientSocketStatus["Disconnected"] = 3] = "Disconnected";
})(ClientSocketStatus = exports.ClientSocketStatus || (exports.ClientSocketStatus = {}));
class ClientSocket extends SocketHandler_1.SocketHandler {
    constructor(client) {
        super(null, new net_1.Socket());
        /**
         * The socket's status
         * @since 0.7.0
         */
        this.status = ClientSocketStatus.Disconnected;
        this._expectClosing = false;
        this.client = client;
        this.retriesRemaining = client.maximumRetries === -1 ? Infinity : client.maximumRetries;
        Object.defineProperties(this, {
            _reconnectionTimeout: { value: null, writable: true }
        });
    }
    get canReconnect() {
        return this.client.retryTime !== -1 && this.retriesRemaining > 0 && this.status !== ClientSocketStatus.Disconnected;
    }
    async connect(...options) {
        await this._connect(...options);
        await this._handshake();
        this.client.servers.set(this.name, this);
        this.status = ClientSocketStatus.Ready;
        this.client.emit('ready', this);
        this.socket
            .on('data', this._onData.bind(this))
            .on('connect', this._onConnect.bind(this))
            .on('close', () => this._onClose(...options))
            .on('error', this._onError.bind(this));
        return this;
    }
    /**
     * Disconnect from the socket, this will also reject all messages.
     * @since 0.0.1
     */
    disconnect() {
        if (this.status === ClientSocketStatus.Disconnected)
            return false;
        if (this._reconnectionTimeout) {
            clearTimeout(this._reconnectionTimeout);
            this._reconnectionTimeout = null;
        }
        this.status = ClientSocketStatus.Disconnected;
        this.client.servers.delete(this.name);
        this.socket.destroy();
        if (this.queue.size) {
            const rejectError = new Error('Socket has been disconnected.');
            for (const element of this.queue.values())
                element.reject(rejectError);
        }
        this.client.emit('disconnect', this);
        return true;
    }
    _onData(data) {
        this.client.emit('raw', data, this);
        for (const processed of this.queue.process(data)) {
            if (processed.id === null) {
                this.client.emit('error', MessageError_1.makeError('Failed to parse message', processed.data), this);
            }
            else if (Shared_1.receivedVClose(processed)) {
                this._expectClosing = true;
            }
            else {
                this._expectClosing = false;
                const message = this._handleMessage(processed);
                if (message)
                    this.client.emit('message', message, this);
            }
        }
    }
    _onConnect() {
        this.retriesRemaining = this.client.maximumRetries;
        /* istanbul ignore else: Safe guard for race-conditions or unexpected behaviour. */
        if (this._reconnectionTimeout) {
            clearTimeout(this._reconnectionTimeout);
            this._reconnectionTimeout = null;
        }
        this.status = ClientSocketStatus.Connected;
        this.client.emit('connect', this);
        this.client.emit('ready', this);
    }
    _onClose(...options) {
        /* istanbul ignore else: Safe guard for race-conditions or unexpected behaviour. */
        if (!this._expectClosing && this.canReconnect) {
            this._reconnect(...options);
        }
        else if (this.status !== ClientSocketStatus.Disconnected) {
            if (this.name)
                this.client.servers.delete(this.name);
            this.status = ClientSocketStatus.Disconnected;
            this.client.emit('disconnect', this);
        }
    }
    _reconnect(...options) {
        if (this._reconnectionTimeout)
            clearTimeout(this._reconnectionTimeout);
        this._reconnectionTimeout = setTimeout(async () => {
            /* istanbul ignore else: Safe guard for race-conditions or unexpected behaviour. */
            if (this.status !== ClientSocketStatus.Disconnected) {
                --this.retriesRemaining;
                try {
                    await this._connect(...options);
                    await this._handshake();
                    this.client.servers.set(this.name, this);
                    this.status = ClientSocketStatus.Ready;
                    this.client.emit('ready', this);
                }
                catch {
                    this._onClose(...options);
                }
            }
        }, this.client.retryTime);
    }
    _onError(error) {
        const { code } = error;
        /* istanbul ignore next: This is mostly guard code, it's very hard for all cases to be covered. Open to a fix. */
        if (code === 'ECONNRESET' || code === 'ECONNREFUSED') {
            if (this.status !== ClientSocketStatus.Disconnected)
                return;
            this.status = ClientSocketStatus.Disconnected;
            this.client.emit('disconnect', this);
        }
        else if (this.status !== ClientSocketStatus.Disconnected) {
            this.client.emit('error', error, this);
        }
    }
    async _connect(...options) {
        await new Promise((resolve, reject) => {
            const onConnect = () => {
                this._emitConnect();
                resolve(cleanup(this.socket, this));
            };
            const onClose = () => reject(cleanup(this.socket, this));
            const onError = (error) => reject(cleanup(this.socket, error));
            function cleanup(socket, value) {
                socket.off('connect', onConnect);
                socket.off('close', onClose);
                socket.off('error', onError);
                return value;
            }
            this.socket
                .on('connect', onConnect)
                .on('close', onClose)
                .on('error', onError);
            this._attemptConnection(...options);
        });
    }
    async _handshake() {
        await new Promise((resolve, reject) => {
            let timeout;
            if (this.client.handshakeTimeout !== -1) {
                timeout = setTimeout(() => {
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    onError(new Error('Connection Timed Out.'));
                    this.socket.destroy();
                }, this.client.handshakeTimeout);
            }
            const onData = (message) => {
                try {
                    const name = DataFormat_1.deserialize(message);
                    if (typeof name === 'string') {
                        const previous = this.name;
                        this.name = name;
                        if (previous && previous !== name)
                            this.client.servers.delete(previous);
                        // Reply with the name of the node, using the header id and concatenating with the
                        // serialized name afterwards.
                        this.socket.write(Header_1.createFromID(Header_1.readID(message), false, DataFormat_1.serialize(this.client.name)));
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                        return resolve(cleanup());
                    }
                }
                catch {
                }
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                onError(new Error('Unexpected response from the server.'));
                this.socket.destroy();
            };
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            const onClose = () => reject(cleanup(this));
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            const onError = (error) => reject(cleanup(error));
            const cleanup = (value) => {
                this.socket.off('data', onData);
                this.socket.off('close', onClose);
                this.socket.off('error', onError);
                if (timeout)
                    clearTimeout(timeout);
                return value;
            };
            this.socket
                .on('data', onData)
                .on('close', onClose)
                .on('error', onError);
        });
    }
    _attemptConnection(...options) {
        this.status = ClientSocketStatus.Connecting;
        this.socket.connect(...options);
        this.client.emit('connecting', this);
    }
    _emitConnect() {
        if (this.status !== ClientSocketStatus.Connected) {
            this.status = ClientSocketStatus.Connected;
            this.client.emit('connect', this);
        }
    }
}
exports.ClientSocket = ClientSocket;
//# sourceMappingURL=ClientSocket.js.map