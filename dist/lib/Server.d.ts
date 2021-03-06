/// <reference types="node" />
import { Server as NetServer, Socket as NetSocket, ListenOptions } from 'net';
import { ServerSocket } from './ServerSocket';
import { BroadcastOptions, SendOptions, NetworkError } from './Util/Shared';
import { EventEmitter } from 'events';
import { NodeMessage } from './Structures/NodeMessage';
/**
 * The connection status of this server.
 * @since 0.7.0
 */
export declare enum ServerStatus {
    /**
     * The server is opening, this is set immediately after calling listen.
     * @since 0.7.0
     */
    Opening = 0,
    /**
     * The server is connected and ready to get connections.
     * @since 0.7.0
     */
    Opened = 1,
    /**
     * The server is closing, this is set immediately after calling close.
     * @since 0.7.0
     */
    Closing = 2,
    /**
     * The server is closed and free to listen to a port.
     * @since 0.7.0
     */
    Closed = 3
}
/**
 * The server that receives connections.
 */
export declare class Server extends EventEmitter {
    /**
     * The internal net.Server that powers this instance.
     * @since 0.7.0
     */
    server: NetServer;
    /**
     * The name of this server. This is set as the first argument of the Server's constructor.
     * @since 0.7.0
     */
    readonly name: string;
    /**
     * The sockets map for this server. Each value is a ServerSocket instance that identifies as an incoming connection
     * to the server.
     * @since 0.7.0
     */
    readonly sockets: Map<string, ServerSocket>;
    /**
     * The status of this server.
     * @since 0.7.0
     */
    status: ServerStatus;
    /**
     * Construct the server.
     * @since 0.7.0
     * @param name The name for this server.
     * @param connectionListener Automatically set as a listener for the 'connection' event.
     * @see https://nodejs.org/dist/latest/docs/api/net.html#net_net_createserver_options_connectionlistener
     */
    constructor(name: string, connectionListener?: (socket: NetSocket) => void);
    /**
     * Construct the server.
     * @since 0.7.0
     * @param name The name for this server.
     * @param options The options for the internal server.
     * @param options.allowHalfOpen Indicates whether half-opened TCP connections are allowed. Default: false.
     * @param options.pauseOnConnect Indicates whether the socket should be paused on incoming connections. Default: false.
     * @param connectionListener Automatically set as a listener for the 'connection' event.
     * @see https://nodejs.org/dist/latest/docs/api/net.html#net_net_createserver_options_connectionlistener
     */
    constructor(name: string, options?: {
        allowHalfOpen?: boolean;
        pauseOnConnect?: boolean;
    }, connectionListener?: (socket: NetSocket) => void);
    /**
     * Get a NodeSocket by its name or Socket.
     * @since 0.7.0
     * @param name The NodeSocket to get.
     */
    get(name: string | ServerSocket): ServerSocket | null;
    /**
     * Check if a NodeSocket exists by its name of Socket.
     * @since 0.7.0
     * @param name The NodeSocket to get.
     */
    has(name: string | ServerSocket): boolean;
    /**
     * Send a message to a connected socket.
     * @since 0.7.0
     * @param name The label name of the socket to send the message to.
     * @param data The data to send to the socket.
     * @param options The options for this message.
     */
    sendTo(name: string | ServerSocket, data: any, options?: SendOptions): Promise<any>;
    /**
     * Broadcast a message to all connected sockets from this server.
     * @since 0.7.0
     * @param data The data to send to other sockets.
     * @param options The options for this broadcast.
     */
    broadcast(data: any, { receptive, timeout, filter }?: BroadcastOptions): Promise<Array<any>>;
    /**
     * Create a server for this Node instance.
     * @since 0.7.0
     * @param options The options to pass to net.Server#listen.
     * @see https://nodejs.org/dist/latest-v12.x/docs/api/net.html#net_server_listen
     */
    listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): Promise<this>;
    listen(port?: number, hostname?: string, listeningListener?: () => void): Promise<this>;
    listen(port?: number, backlog?: number, listeningListener?: () => void): Promise<this>;
    listen(port?: number, listeningListener?: () => void): Promise<this>;
    listen(path: string, backlog?: number, listeningListener?: () => void): Promise<this>;
    listen(path: string, listeningListener?: () => void): Promise<this>;
    listen(options: ListenOptions, listeningListener?: () => void): Promise<this>;
    listen(handle: any, backlog?: number, listeningListener?: () => void): Promise<this>;
    listen(handle: any, listeningListener?: () => void): Promise<this>;
    /**
     * Disconnect the server and rejects all current messages.
     * @since 0.7.0
     */
    close(closeSockets?: boolean): Promise<boolean>;
    /**
     * Connection listener.
     * @since 0.7.0
     * @param socket The received socket
     */
    private _onConnection;
    /**
     * Error listener.
     * @since 0.7.0
     * @param error The error received.
     */
    private _onError;
    /**
     * The close listener.
     * @since 0.7.0
     */
    private _onClose;
}
export interface Server {
    /**
     * Emitted when the server receives data.
     */
    on(event: 'raw', listener: (data: Uint8Array, client: ServerSocket) => void): this;
    /**
     * Emitted when the server opens.
     */
    on(event: 'open', listener: () => void): this;
    /**
     * Emitted when the server closes.
     */
    on(event: 'close', listener: () => void): this;
    /**
     * Emitted when an error occurs.
     */
    on(event: 'error', listener: (error: Error | NetworkError, client: ServerSocket | null) => void): this;
    /**
     * Emitted when a new connection is made and set up.
     */
    on(event: 'connect', listener: (client: ServerSocket) => void): this;
    /**
     * Emitted when a client disconnects from the server.
     */
    on(event: 'disconnect', listener: (client: ServerSocket) => void): this;
    /**
     * Emitted when the server receives and parsed a message.
     */
    on(event: 'message', listener: (message: NodeMessage, client: ServerSocket) => void): this;
    /**
     * Emitted when the server receives data.
     */
    once(event: 'raw', listener: (data: Uint8Array, client: ServerSocket) => void): this;
    /**
     * Emitted when the server opens.
     */
    once(event: 'open', listener: () => void): this;
    /**
     * Emitted when the server closes.
     */
    once(event: 'close', listener: () => void): this;
    /**
     * Emitted when an error occurs.
     */
    once(event: 'error', listener: (error: Error | NetworkError, client: ServerSocket | null) => void): this;
    /**
     * Emitted when a new connection is made and set up.
     */
    once(event: 'connect', listener: (client: ServerSocket) => void): this;
    /**
     * Emitted when a client disconnects from the server.
     */
    once(event: 'disconnect', listener: (client: ServerSocket) => void): this;
    /**
     * Emitted once when a server is ready.
     */
    once(event: 'ready', listener: () => void): this;
    /**
     * Emitted when the server receives and parsed a message.
     */
    once(event: 'message', listener: (message: NodeMessage, client: ServerSocket) => void): this;
    /**
     * Emitted when the server receives data.
     */
    off(event: 'raw', listener: (data: Uint8Array, client: ServerSocket) => void): this;
    /**
     * Emitted when the server opens.
     */
    off(event: 'open', listener: () => void): this;
    /**
     * Emitted when the server closes.
     */
    off(event: 'close', listener: () => void): this;
    /**
     * Emitted when an error occurs.
     */
    off(event: 'error', listener: (error: Error | NetworkError, client: ServerSocket | null) => void): this;
    /**
     * Emitted when a new connection is made and set up.
     */
    off(event: 'connect', listener: (client: ServerSocket) => void): this;
    /**
     * Emitted when a client disconnects from the server.
     */
    off(event: 'disconnect', listener: (client: ServerSocket) => void): this;
    /**
     * Emitted when the server receives and parsed a message.
     */
    off(event: 'message', listener: (message: NodeMessage, client: ServerSocket) => void): this;
    /**
     * Emits raw data received from the underlying socket.
     */
    emit(event: 'raw', data: Uint8Array, client: ServerSocket): boolean;
    /**
     * Emits a server open event.
     */
    emit(event: 'open'): boolean;
    /**
     * Emits a server close event.
     */
    emit(event: 'close'): boolean;
    /**
     * Emits a server error event.
     */
    emit(event: 'error', error: Error | NetworkError, client: ServerSocket | null): boolean;
    /**
     * Emits a connection made and set up to the server.
     */
    emit(event: 'connect', client: ServerSocket): boolean;
    /**
     * Emits a disconnection of a client from the server.
     */
    emit(event: 'disconnect', client: ServerSocket): boolean;
    /**
     * Emits a parsed NodeMessage instance ready for usage.
     */
    emit(event: 'message', message: NodeMessage, client: ServerSocket): boolean;
}
