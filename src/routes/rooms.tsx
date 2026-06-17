import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sofa, Bed, ChefHat, Bath, Trees, Tv, Lightbulb, Thermometer } from "lucide-react";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms — Nosky HomeOS" },
      { name: "description", content: "Manage every room in your home." },
    ],
  }),
  component: RoomsLayout,
});

const rooms = [
  { name: "Living Room", icon: Sofa, devices: 6, temp: "22°", lights: 4, active: true },
  { name: "Master Bedroom", icon: Bed, devices: 5, temp: "21°", lights: 2, active: true },
  { name: "Kitchen", icon: ChefHat, devices: 8, temp: "23°", lights: 3, active: true },
  { name: "Bathroom", icon: Bath, devices: 3, temp: "24°", lights: 1, active: false },
  { name: "Garden", icon: Trees, devices: 4, temp: "19°", lights: 6, active: true },
  { name: "Media Room", icon: Tv, devices: 7, temp: "21°", lights: 2, active: false },
];

function RoomsLayout() {
  return <Outlet />;
}

export function RoomsList() {
  return (
    <AppShell title="Rooms" subtitle="6 rooms · 33 devices across your home">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.name}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 grid place-items-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-semibold truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.devices} devices</div>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                      r.active
                        ? "bg-success/15 text-success border border-success/20"
                        : "bg-muted/40 text-muted-foreground border border-border"
                    }`}
                  >
                    {r.active ? "Active" : "Idle"}
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-surface/40 border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Thermometer className="h-3 w-3" /> Climate
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold">{r.temp}</div>
                  </div>
                  <div className="rounded-lg bg-surface/40 border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Lightbulb className="h-3 w-3" /> Lights
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold">{r.lights} on</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
