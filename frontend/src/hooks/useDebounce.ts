import { useEffect, useState } from 'react';

/**
 * Hook pour debouncer une valeur
 * @param value La valeur à debouncer
 * @param delay Délai en ms (défaut: 500ms)
 * @returns La valeur debouncée
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurer le timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup : annuler le timer si la valeur change avant la fin du délai
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
