// ============================================================================
// Learnix LMS - Try-Catch Utility (ટ્રાય-કેચ ઉપયોગિતા)
// ============================================================================
// Aa file async operations mate Result type based error handling provide kare chhe.
// This file provides Result type based error handling for async operations.
//
// Promise ne { data, error } format ma wrap kare chhe -
// try/catch boilerplate reduce kare chhe.
// Wraps Promises into { data, error } format -
// reduces try/catch boilerplate.
// ============================================================================

// Success result type / Success result type
type Success<T> = {
  data: T;
  error: null;
};

// Failure result type / Failure result type
type Failure<E> = {
  data: null;
  error: E;
};

// Union result type - data ke error mathi ek j hoy
// Union result type - exactly one of data or error
type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Promise ne safe Result ma wrap karo / Wrap Promise in safe Result
 *
 * try/catch boilerplate vagar error handling karo.
 * Handle errors without try/catch boilerplate.
 *
 * Usage: const { data, error } = await tryCatch(somePromise);
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
