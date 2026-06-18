import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Zap,
  Cpu,
  Activity,
  Battery,
  Sofa,
  Bed,
  Baby,
  Box,
  ChefHat,
  Footprints,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
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

const ICON_MAP: Record<string, any> = {
  sofa: Sofa,
  bed: Bed,
  baby: Baby,
  box: Box,
  chefHat: ChefHat,
  footprints: Footprints,
};

const overviewCards = [
  { label: "Devices Online", value: "42", icon: Cpu, color: "text-blue-400" },
  { label: "Active Devices", value: "12", icon: Activity, color: "text-emerald-400" },
  { label: "Power Consumption", value: "1.2 kW", icon: Zap, color: "text-amber-400" },
  {
    label: "Inverter Status",
    value: "98%",
    sub: "450W · On Solar",
    icon: Battery,
    color: "text-primary",
  },
];

function ZoneCard({ zone }: { zone: Zone }) {
  const [isActive, setIsActive] = useState(false);
  const Icon = ICON_MAP[zone.icon] || Lightbulb;
  const zoneDevices = mockDevices.filter(d => d.zoneId === zone.id);
  const onlineCount = zoneDevices.filter(d => d.status === "online").length;

  return (
    <div className="glass group rounded-3xl p-6 hover:border-primary/40 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-start mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 grid place-items-center group-hover:scale-110 transition-transform duration-500">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`h-10 w-10 rounded-full grid place-items-center transition-all duration-300 ${
            isActive
              ? "bg-primary text-primary-foreground glow-primary scale-110"
              : "bg-surface/60 text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <Lightbulb className={`h-5 w-5 ${isActive ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="font-display text-xl font-semibold tracking-tight">{zone.name}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
          <span>{zoneDevices.length} Devices</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-emerald-400 font-medium">{onlineCount} Online</span>
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
  const totalOnline = mockDevices.filter(d => d.status === "online").length;
  const totalActive = mockDevices.filter(d => d.powerState === "on").length;

  const dynamicOverviewCards = [
    { label: "Devices Online", value: totalOnline.toString(), icon: Cpu, color: "text-blue-400" },
    { label: "Active Devices", value: totalActive.toString(), icon: Activity, color: "text-emerald-400" },
    { label: "Power Consumption", value: "1.2 kW", icon: Zap, color: "text-amber-400" },
    {
      label: "Inverter Status",
      value: "92%",
      sub: "450W · On Battery",
      icon: Battery,
      color: "text-primary",
    },
  ];

  return (
    <AppShell title="Dashboard" subtitle="Nosky HomeOS Luxury Edition">
      <div className="max-w-[1600px] mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Greeting />

          <div className="flex items-center gap-3 px-4 py-2 bg-success/10 border border-success/20 rounded-full animate-in fade-in slide-in-from-right-4 duration-700">
            <span className="h-2.5 w-2.5 rounded-full bg-success pulse-ring" />
            <span className="text-sm font-medium text-success tracking-wide">
              All Systems Operational
            </span>
          </div>
        </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-success/10 border border-success/20 rounded-full animate-in fade-in slide-in-from-right-4 duration-700">
            <span className="h-2.5 w-2.5 rounded-full bg-success pulse-ring" />
            <span className="text-sm font-medium text-success tracking-wide">
              All Systems Operational
            </span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dynamicOverviewCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="glass rounded-3xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="relative flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                      {card.label}
                    </span>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <div className="mt-auto">
                    <div className="font-display text-3xl font-bold tracking-tight">
                      {card.value}
                    </div>
                    {card.sub && (
                      <div className="text-xs text-muted-foreground mt-1 font-medium">
                        {card.sub}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Zones Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold tracking-tight">Smart Zones</h2>
            <div className="text-sm text-muted-foreground">{mockZones.length} total areas</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockZones.map((zone) => (
              <ZoneCard key={zone.id} zone={zone} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
