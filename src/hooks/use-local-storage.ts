import { useCallback, useEffect, useState } from "react";

/**
 * useLocalStorage — small persistence hook with cross-tab sync.
 * Generic: works for arrays, objects, primitives.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const read = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initial;
      return JSON.parse(raw, (_k, v) => {
        // Revive ISO date strings
        if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
          const d = new Date(v);
          if (!isNaN(d.getTime())) return d;
        }
        return v;
      }) as T;
    } catch {
      return initial;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [value, setValue] = useState<T>(read);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota */
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, read]);

  return [value, setValue] as const;
}
