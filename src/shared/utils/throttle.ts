import type { AnyFunction } from "../types/common.ts";

export type ThrottledFunction<T extends AnyFunction> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

export default function throttle<T extends AnyFunction>(
  fn: T,
  wait: number,
): ThrottledFunction<T> {
  let lastCallTime: number | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now();

    if (lastCallTime === null || now - lastCallTime >= wait) {
      lastCallTime = now;
      fn(...args);
    } else {
      lastArgs = args;

      if (!timeoutId) {
        const remaining = wait - (now - lastCallTime);
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now();
          timeoutId = null;
          if (lastArgs) {
            fn(...lastArgs);
            lastArgs = null;
          }
        }, remaining);
      }
    }
  };

  throttled.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
    lastArgs = null;
    lastCallTime = null;
  };

  return throttled;
}
