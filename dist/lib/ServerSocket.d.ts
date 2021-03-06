/// <reference types="node" />
import { SocketHandler } from './Structures/Base/SocketHandler';
import { Socket as NetSocket } from 'net';
import { Server } from './Server';
/**
 * The connection status of this socket.
 * @since 0.7.0
 */
export declare enum ServerSocketStatus {
    /**
     * The connected status, the socket is connected and identified.
     * @since 0.7.0
     */
    Connected = 0,
    /**
     * The identifying status, the socket has connected but has not identified yet.
     * @since 0.7.0
     */
    Identifiying = 1,
    /**
     * The disconnected status, the socket has been disconnected and cannot operate anymore.
     * @since 0.7.0
     */
    Disconnected = 2
}
export declare class ServerSocket extends SocketHandler {
    readonly server: Server;
    status: ServerSocketStatus;
    constructor(server: Server, socket: NetSocket);
    setup(): Promise<boolean | undefined>;
    /**
     * Disconnect from the socket, this will also reject all messages
     */
    disconnect(close?: boolean): boolean;
    protected _onData(data: Uint8Array): void;
    private _onError;
    private _onClose;
}
