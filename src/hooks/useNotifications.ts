import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationKind = "info" | "success" | "warning" | "alert";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  createdAt: number;
  read: boolean;
}

interface NotificationsState {
  items: AppNotification[];
  unreadCount: () => number;
  push: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
}

const seed: AppNotification[] = [
  {
    id: "n-welcome",
    kind: "success",
    title: "Welcome to Nosky HomeOS",
    body: "Your home is connected. Try saying: \"Cipher, turn on the parlor bulb\".",
    createdAt: Date.now() - 1000 * 60 * 5,
    read: false,
  },
  {
    id: "n-tip",
    kind: "info",
    title: "Tip: Voice control",
    body: "Tap the Cipher orb anywhere to start a voice conversation with your home.",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    read: false,
  },
];

export const useNotifications = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: seed,
      unreadCount: () => get().items.filter((n) => !n.read).length,
      push: (n) =>
        set((s) => ({
          items: [
            {
              ...n,
              id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              createdAt: Date.now(),
              read: false,
            },
            ...s.items,
          ].slice(0, 50),
        })),
      markRead: (id) =>
        set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
      clear: () => set({ items: [] }),
    }),
    { name: "nosky-notifications-v1" },
  ),
);
