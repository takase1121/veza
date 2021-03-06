import { DeserializerError, DeserializerReason } from 'binarytf/dist/lib/errors/DeserializerError';
/**
 * The MessageError class for deserializer errors
 * @since 0.7.0
 * @extends Error
 */
export declare class MessageError extends Error {
    /**
     * The kind of error from BinaryTF's error.
     * @since 0.7.0
     */
    kind: DeserializerReason;
    /**
     * Constructs a MessageError instance.
     * @since 0.7.0
     * @param prefix The prefix indicating more information about the error.
     * @param error The DeserializerError instance to wrap.
     */
    constructor(prefix: string, error: DeserializerError);
}
/**
 * Creates an error.
 * @since 0.7.0
 * @param prefix The prefix indicating what the error is.
 * @param error The original error to wrap.
 * @internal
 * @private
 */
export declare function makeError(prefix: string, error: Error): Error;
