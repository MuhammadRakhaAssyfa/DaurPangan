import { useCallback, useEffect, useState } from "react";
import type { RecipientAddress } from "@/lib/mock-data";

const STORAGE_KEY = "daurpangan:recipient-address";

const read = (): RecipientAddress | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecipientAddress) : null;
  } catch {
    return null;
  }
};

/**
 * Lightweight client-side store for the recipient's saved pickup address.
 * Persists in localStorage and broadcasts changes across hook instances via
 * a custom event so the profile and the claim dialog stay in sync.
 */
export const useRecipientAddress = () => {
  const [address, setAddress] = useState<RecipientAddress | null>(() => read());

  useEffect(() => {
    const onChange = () => setAddress(read());
    window.addEventListener("daurpangan:address-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("daurpangan:address-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const save = useCallback((next: RecipientAddress) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAddress(next);
    window.dispatchEvent(new Event("daurpangan:address-changed"));
  }, []);

  const clear = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
    window.dispatchEvent(new Event("daurpangan:address-changed"));
  }, []);

  return { address, save, clear };
};
