import { setInterval, clearInterval } from "alt-client";

/**
 * Runs the provided callback once and retries every `timeoutMs` milliseconds unless resolved
 * @param callback
 * @param timeoutMs
 * @param rejectAfterRetries Optional
 * @param reject Optional promise rejection callback to be called if `rejectAfterRetries` is reached
 * @returns Resolver
 */
export function retryOnTimeout(
  callback: (...args: any) => void,
  timeoutMs: number,
  rejectAfterRetries?: number,
  reject?: (...args: any) => void,
) {
  let retries = 0;

  const interval = setInterval(() => {
    if (rejectAfterRetries && reject && retries >= rejectAfterRetries) {
      clearInterval(interval);
      return reject();
    }

    retries++;
    callback();
  }, timeoutMs);

  const resolver = () => clearInterval(interval);
  callback();

  return {
    resolve: resolver,
  };
}
