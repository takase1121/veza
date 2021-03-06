/// <reference types="node" />
import { SocketHandler } from './Structures/Base/SocketHandler';
import { SocketConnectOpts } from 'net';
import { Client } from './Client';
/**
 * The connection status of this socket.
 * @since 0.7.0
 */
export declare enum ClientSocketStatus {
    /**
     * The ready status, the socket has successfully connected and identified with the server.
     * @since 0.7.0
     */
    Ready = 0,
    /**
     * The connected status, the socket has successfully connected, but has not identified yet.
     * @since 0.7.0
     */
    Connected = 1,
    /**
     * The connecting status, the socket is not ready to operate but is attempting to connect.
     * @since 0.7.0
     */
    Connecting = 2,
    /**
     * The disconnected status, the socket is idle and not ready to operate.
     * @since 0.7.0
     */
    Disconnected = 3
}
export declare class ClientSocket extends SocketHandler {
    /**
     * The socket's client
     * @since 0.7.0
     */
    readonly client: Client;
    /**
     * The socket's status
     * @since 0.7.0
     */
    status: ClientSocketStatus;
    /**
     * How many reconnection attempts this socket has remaining.
     * @since 0.7.0
     */
    retriesRemaining: number;
    private _expectClosing;
    private _reconnectionTimeout;
    constructor(client: Client);
    private get canReconnect();
    /**
     * Connect to the socket.
     * @since 0.0.1
     * @param options The options to pass to connect.
     * @see https://nodejs.org/dist/latest/docs/api/net.html#net_socket_connect
     */
    connect(options: SocketConnectOpts, connectionListener?: () => void): Promise<this>;
    connect(port: number, host: string, connectionListener?: () => void): Promise<this>;
    connect(port: number, connectionListener?: () => void): Promise<this>;
    connect(path: string, connectionListener?: () => void): Promise<this>;
    /**
     * Disconnect from the socket, this will also reject all messages.
     * @since 0.0.1
     */
    disconnect(): boolean;
    protected _onData(data: Uint8Array): void;
    private _onConnect;
    private _onClose;
    private _reconnect;
    private _onError;
    private _connect;
    private _handshake;
    private _attemptConnection;
    private _emitConnect;
}
