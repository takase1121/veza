/**
 * Creates an error.
 * @since 0.7.0
 * @param prefix The prefix indicating what the error is.
 * @param error The original error to wrap.
 * @internal
 * @private
 */
export function makeError(prefix: string, error: Error) {
	/* istanbul ignore next: Safe guard for edge cases. */
	return new Error(`${prefix}: ${error.message}`);
}
