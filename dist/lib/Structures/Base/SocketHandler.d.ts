/// <reference types="node" />
import { NodeMessage } from '../NodeMessage';
import { Queue } from '../Queue';
import { Socket as NetSocket } from 'net';
import { SendOptions } from '../../Util/Shared';
/**
 * The abstract socket handler for {@link ClientSocket} and {@link ServerSocket}.
 * @since 0.0.1
 * @private
 */
export declare abstract class SocketHandler {
    /**
     * The name of this socket.
     * @since 0.0.1
     */
    name: string | null;
    /**
     * The internal socket that connects Veza to the network.
     * @since 0.0.1
     */
    socket: NetSocket;
    /**
     * The incoming message queue for this handler.
     * @since 0.1.0
     */
    queue: Queue;
    /**
     * @since 0.0.1
     * @param name The name for this socket handler.
     * @param socket The socket that will manage this instance.
     */
    constructor(name: string | null, socket: NetSocket);
    /**
     * Send a message to a connected socket.
     * @param data The data to send to the socket
     * @param options The options for this message
     */
    send(data: any, options?: SendOptions): Promise<unknown>;
    protected _handleMessage(message: RawMessage): Readonly<NodeMessage> | null;
    protected abstract _onData(data: Uint8Array): void;
}
/**
 * A raw message
 * @since 0.5.0
 * @private
 * @internal
 */
export interface RawMessage {
    /**
     * The message's ID
     * @since 0.5.0
     */
    id: number | null;
    /**
     * Whether the message should have a reply sent to it
     * @since 0.5.0
     */
    receptive: boolean;
    /**
     * The message's data
     * @since 0.5.0
     */
    data: any;
}
