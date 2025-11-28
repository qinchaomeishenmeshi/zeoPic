import { useRef, useCallback } from 'react';

export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) => {
  const isThrottled = useRef<boolean>(false);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (isThrottled.current) {
        return;
      }
      callback(...args);
      isThrottled.current = true;
      setTimeout(() => {
        isThrottled.current = false;
      }, delay);
    },
    [callback, delay]
  );

  return throttledCallback;
};
