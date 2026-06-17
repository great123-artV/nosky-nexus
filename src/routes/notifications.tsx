import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AlertTriangle, CheckCircle2, Info, Shield, Zap, Wind } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Nosky HomeOS" },
      { name: "description", content: "System alerts, activity and recommendations." },
    ],
  }),
  component: Notifications,
});

const items = [
  {
    icon: Shield,
    tone: "success",
    title: "Home armed successfully",
    body: "Away mode activated. All sensors are online.",
    time: "2 min ago",
  },
  {
    icon: AlertTriangle,
    tone: "warning",
    title: "Filter replacement due",
    body: "Dyson Purifier — Bedroom needs a new filter within 5 days.",
    time: "1 hour ago",
  },
  {
    icon: Zap,
    tone: "info",
    title: "Energy report ready",
    body: "You used 18% less energy this week. Tap to view full breakdown.",
    time: "3 hours ago",
  },
  {
    icon: CheckCircle2,
    tone: "success",
    title: "Firmware updated",
    body: "Eero Pro 6E updated to version 7.4.2 with improved stability.",
    time: "Yesterday",
  },
  {
    icon: Wind,
    tone: "info",
    title: "Air quality improved",
    body: "Bedroom PM2.5 dropped to 6 µg/m³ — Excellent.",
    time: "Yesterday",
  },
  {
    icon: Info,
    tone: "info",
    title: "New automation suggested",
    body: "Auto-dim living room lights after sunset to save ~4 kWh/week.",
    time: "2 days ago",
  },
];

const toneClass = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-primary/15 text-primary",
} as const;

function Notifications() {
  return (
    <AppShell title="Notifications" subtitle="6 recent events · 2 require attention">
      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((n, i) => {
          const Icon = n.icon;
          return (
            <div
              key={i}
              className="glass rounded-2xl p-5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 hover:border-primary/30 transition-all"
            >
              <div
                className={`h-10 w-10 shrink-0 rounded-xl grid place-items-center ${toneClass[n.tone as keyof typeof toneClass]}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{n.title}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{n.body}</div>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
