import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";
import { Bell, CheckCheck, Trash2, Info, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Nosky HomeOS" }] }),
  component: NotificationsPage,
});

const iconFor = (k: AppNotification["kind"]) =>
  k === "success" ? CheckCircle2 : k === "warning" ? AlertTriangle : k === "alert" ? AlertOctagon : Info;

const toneFor = (k: AppNotification["kind"]) =>
  k === "success"
    ? "text-emerald-400 bg-emerald-500/10"
    : k === "warning"
      ? "text-amber-400 bg-amber-500/10"
      : k === "alert"
        ? "text-destructive bg-destructive/10"
        : "text-primary bg-primary/10";

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function NotificationsPage() {
  const items = useNotifications((s) => s.items);
  const markAllRead = useNotifications((s) => s.markAllRead);
  const markRead = useNotifications((s) => s.markRead);
  const clear = useNotifications((s) => s.clear);
  const unread = items.filter((n) => !n.read).length;

  return (
    <AppShell title="Notifications" subtitle={`${unread} unread of ${items.length}`}>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary grid place-items-center">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display font-semibold">Activity Feed</h2>
              <p className="text-xs text-muted-foreground">System events and assistant actions.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              disabled={unread === 0}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg glass text-xs font-medium hover:bg-accent transition-colors disabled:opacity-40"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
            <button
              onClick={clear}
              disabled={items.length === 0}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg glass text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Bell className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">You're all caught up.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((n) => {
              const Icon = iconFor(n.kind);
              return (
                <li
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  className={cn(
                    "glass rounded-2xl p-4 flex gap-3 cursor-pointer transition-all hover:bg-accent/40",
                    !n.read && "border-primary/30 bg-primary/[0.02]",
                  )}
                >
                  <div className={cn("h-9 w-9 rounded-lg grid place-items-center shrink-0", toneFor(n.kind))}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    {n.body && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.body}</p>}
                  </div>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary glow-primary mt-1.5 shrink-0" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
