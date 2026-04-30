import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { RecipientNotification } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";

/**
 * Centralized notifications store (per-user, persisted).
 * New accounts start empty; entries persist until the user dismisses them.
 */
export function useNotifications() {
  const { user } = useAuth();
  const key = `daurpangan.notifications.${user?.email ?? "anon"}`;
  const [items, setItems] = useLocalStorage<RecipientNotification[]>(key, []);

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = useCallback(
    () => setItems((prev) => prev.map((n) => ({ ...n, read: true }))),
    [setItems],
  );

  const markRead = useCallback(
    (id: string) =>
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
    [setItems],
  );

  const dismiss = useCallback(
    (id: string) => setItems((prev) => prev.filter((n) => n.id !== id)),
    [setItems],
  );

  const add = useCallback(
    (n: Omit<RecipientNotification, "id" | "date" | "read"> & Partial<RecipientNotification>) =>
      setItems((prev) => [
        {
          id: n.id ?? `n-${Date.now()}`,
          date: n.date ?? new Date(),
          read: n.read ?? false,
          title: n.title,
          body: n.body,
          listingId: n.listingId,
        },
        ...prev,
      ]),
    [setItems],
  );

  return { items, unread, markAllRead, markRead, dismiss, add };
}
