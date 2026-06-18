import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sofa,
  Bed,
  Baby,
  Box,
  Lightbulb,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { mockZones, mockDevices } from "@/components/devices/mockData";
import { Zone } from "@/components/devices/types";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nosky HomeOS" },
      {
        name: "description",
        content: "Luxury smart-home control center.",
      },
    ],
  }),
  component: Dashboard,
});

const ICON_MAP: Record<string, LucideIcon> = {
  sofa: Sofa,
  bed: Bed,
  baby: Baby,
  box: Box,
};

function ZoneCard({ zone }: { zone: Zone }) {
  const Icon = ICON_MAP[zone.icon] || Lightbulb;
  const zoneDevices = mockDevices.filter(d => d.zoneId === zone.id);
  const onlineCount = zoneDevices.filter(d => d.status === "online").length;

  return (
    <div className="glass group rounded-3xl p-6 hover:border-primary/40 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-start mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 grid place-items-center group-hover:scale-110 transition-transform duration-500">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="font-display text-xl font-semibold tracking-tight">{zone.name}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
          <span>{zoneDevices.length} Devices</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-emerald-400 font-medium">{onlineCount} Connected</span>
        </div>
      </div>

      <Link
        to="/zones/$zoneId"
        params={{ zoneId: zone.id }}
        className="w-full h-12 glass-strong rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-primary/10 hover:border-primary/30 transition-all group/btn"
      >
        Open Zone
        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

function Dashboard() {
  const { profile } = useAuth();
  const firstName = profile?.full_name ? profile.full_name.split(' ')[0] : null;

  return (
    <AppShell title="Dashboard" subtitle="Nosky HomeOS Luxury Edition">
      <div className="max-w-[1600px] mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-700">
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-gradient">
              {firstName ? `Welcome Home, ${firstName}` : "Welcome Home"}
            </h2>
            <p className="text-2xl md:text-3xl text-muted-foreground font-light">Your residence is ready</p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-success/10 border border-success/20 rounded-full animate-in fade-in slide-in-from-right-4 duration-700">
            <span className="h-2.5 w-2.5 rounded-full bg-success pulse-ring" />
            <span className="text-sm font-medium text-success tracking-wide">
              Home Connected
            </span>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold tracking-tight">Home Zones</h2>
            <div className="text-sm text-muted-foreground">{mockZones.length} Rooms</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockZones.map((zone) => (
              <ZoneCard key={zone.id} zone={zone} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
