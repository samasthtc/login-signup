import { useCallback, useRef } from "react";

export default function useDebounce(callback, delay = 300) {
  const timerRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

export function useDebouncePromise(callback, delay = 300) {
  const timerRefs = useRef({});

  const debouncedCallback = useCallback(
    (field, value) =>
      new Promise((resolve) => {
        if (timerRefs.current[field]) {
          clearTimeout(timerRefs.current[field]);
        }
        timerRefs.current[field] = setTimeout(() => {
          const result = callback(field, value);
          resolve(result);
        }, delay);
      }),
    [callback, delay]
  );

  return debouncedCallback;
}
