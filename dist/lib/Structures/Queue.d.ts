import { RawMessage } from './Base/SocketHandler';
/**
 * The queue class that manages messages.
 * @since 0.1.0
 */
export declare class Queue extends Map<number, QueueEntry> {
    /**
     * The remaining buffer to truncate with other buffers.
     * @since 0.1.0
     */
    private _rest;
    /**
     * Returns a new Iterator object that parses each value for this queue.
     * @since 0.1.0
     */
    process(buffer: Uint8Array): RawMessage[];
}
/**
 * An entry for this queue
 */
interface QueueEntry {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
}
export {};
