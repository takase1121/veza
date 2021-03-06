import { SocketHandler } from './Base/SocketHandler';
export declare class NodeMessage {
    /**
     * The client that received this message.
     * @since 0.0.1
     */
    readonly client: SocketHandler;
    /**
     * The id of this message.
     * @since 0.0.1
     */
    readonly id: number;
    /**
     * The data received from the socket.
     * @since 0.0.1
     */
    data: any;
    /**
     * Whether the message is receptive or not.
     * @since 0.0.1
     */
    readonly receptive: boolean;
    /**
     * @since 0.0.1
     * @param client The socket that received this message.
     * @param id The ID of the message.
     * @param receptive Whether or not this message accepts a reply.
     * @param data The data received from the socket.
     */
    constructor(client: SocketHandler, id: number, receptive: boolean, data: any);
    /**
     * Reply to the socket.
     * @since 0.0.1
     * @param content The content to send.
     */
    reply(content: unknown): void;
    /**
     * Freeze the message.
     * @since 0.0.1
     */
    freeze(): Readonly<this>;
    /**
     * The toJSON overload for JSON.stringify.
     * @since 0.0.1
     */
    toJSON(): {
        id: number;
        data: any;
        receptive: boolean;
    };
    /**
     * The toString overload for string casting.
     * @since 0.0.1
     */
    toString(): string;
}
