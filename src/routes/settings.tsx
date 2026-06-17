import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { User, Bell, Shield, Wifi, Palette, Globe, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nosky HomeOS" },
      { name: "description", content: "Configure your home, account and integrations." },
    ],
  }),
  component: Settings,
});

const sections = [
  {
    title: "Account",
    icon: User,
    items: [
      { label: "Profile & household", value: "Noor · 4 members" },
      { label: "Subscription", value: "Nosky Premium" },
      { label: "Connected accounts", value: "3 linked" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Push alerts", value: "On" },
      { label: "Email digest", value: "Weekly" },
      { label: "Quiet hours", value: "22:00 – 07:00" },
    ],
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    items: [
      { label: "Two-factor authentication", value: "Enabled" },
      { label: "Camera recording", value: "Local only" },
      { label: "Data export", value: "Manage" },
    ],
  },
  {
    title: "Network",
    icon: Wifi,
    items: [
      { label: "Primary network", value: "Nosky-5G" },
      { label: "Guest network", value: "Off" },
      { label: "Hub firmware", value: "v2.4.1 · up to date" },
    ],
  },
  {
    title: "Appearance",
    icon: Palette,
    items: [
      { label: "Theme", value: "Midnight (Dark)" },
      { label: "Accent colour", value: "Aurora Blue" },
      { label: "Reduce motion", value: "Off" },
    ],
  },
  {
    title: "Region",
    icon: Globe,
    items: [
      { label: "Language", value: "English" },
      { label: "Time zone", value: "UTC+02:00" },
      { label: "Units", value: "Metric" },
    ],
  },
];

function Settings() {
  return (
    <AppShell title="Settings" subtitle="Personalize your Nosky HomeOS experience">
      <div className="max-w-4xl mx-auto space-y-6">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary grid place-items-center">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="font-display font-semibold">{s.title}</div>
              </div>
              <div className="divide-y divide-border">
                {s.items.map((it) => (
                  <button
                    key={it.label}
                    className="w-full px-5 py-4 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 hover:bg-accent/30 transition-colors text-left"
                  >
                    <span className="text-sm truncate">{it.label}</span>
                    <span className="text-sm text-muted-foreground truncate">{it.value}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
