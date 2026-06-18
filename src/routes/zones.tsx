import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sofa, Bed, Baby, Box, Lightbulb, LucideIcon } from "lucide-react";
import { mockZones, mockDevices } from "@/components/devices/mockData";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/zones")({
  head: () => ({
    meta: [
      { title: "Zones — Nosky HomeOS" },
      { name: "description", content: "Manage every zone in your home." },
    ],
  }),
  component: ZonesLayout,
});

const ICON_MAP: Record<string, LucideIcon> = {
  sofa: Sofa,
  bed: Bed,
  baby: Baby,
  box: Box,
};

function ZonesLayout() {
  return <Outlet />;
}

export function ZonesList() {
  const totalDevices = mockDevices.length;

  return (
    <AppShell title="Zones" subtitle={`${mockZones.length} zones · ${totalDevices} devices across your home`}>
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockZones.map((z) => {
          const Icon = ICON_MAP[z.icon] || Lightbulb;
          const zoneDevices = mockDevices.filter(d => d.zoneId === z.id);
          const activeDevices = zoneDevices.filter(d => d.powerState === "on").length;
          const onlineDevices = zoneDevices.filter(d => d.status === "online").length;

          return (
            <Link
              key={z.id}
              to="/zones/$zoneId"
              params={{ zoneId: z.id }}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden block"
            >
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 grid place-items-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-semibold truncate text-lg">{z.name}</div>
                    <div className="text-xs text-muted-foreground">{zoneDevices.length} devices</div>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                      onlineDevices === zoneDevices.length
                        ? "bg-success/15 text-success border border-success/20"
                        : "bg-muted/40 text-muted-foreground border border-border"
                    }`}
                  >
                    {onlineDevices === zoneDevices.length ? "All Online" : `${onlineDevices}/${zoneDevices.length} Connected`}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <div className="rounded-lg bg-surface/40 border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      <Lightbulb className="h-3 w-3" /> System Status
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold">
                      {activeDevices} active devices
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
