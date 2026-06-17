import { createFileRoute } from "@tanstack/react-router";
import {
  Thermometer,
  Droplets,
  Zap,
  Shield,
  Lightbulb,
  Wind,
  Lock,
  Camera,
  Music,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nosky HomeOS" },
      {
        name: "description",
        content: "Real-time overview of your home — climate, energy, security and devices.",
      },
    ],
  }),
  component: Dashboard,
});

const energyData = [
  { t: "00", kWh: 1.2 },
  { t: "04", kWh: 0.8 },
  { t: "08", kWh: 2.4 },
  { t: "12", kWh: 3.1 },
  { t: "14", kWh: 2.7 },
  { t: "18", kWh: 4.2 },
  { t: "20", kWh: 3.8 },
  { t: "23", kWh: 2.1 },
];

const stats = [
  {
    label: "Indoor Climate",
    value: "21.5°",
    sub: "Humidity 44%",
    icon: Thermometer,
    accent: "from-primary/30 to-primary/5",
  },
  {
    label: "Energy Today",
    value: "18.4 kWh",
    sub: "−12% vs. yesterday",
    icon: Zap,
    accent: "from-warning/30 to-warning/5",
  },
  {
    label: "Water Usage",
    value: "126 L",
    sub: "Within daily goal",
    icon: Droplets,
    accent: "from-chart-5/30 to-chart-5/5",
  },
  {
    label: "Security",
    value: "Armed",
    sub: "All 8 sensors online",
    icon: Shield,
    accent: "from-success/30 to-success/5",
  },
];

const scenes = [
  { name: "Good Morning", desc: "Lights · Blinds · Coffee", icon: Lightbulb },
  { name: "Cinema", desc: "Dim · TV · 5.1 audio", icon: Music },
  { name: "Away", desc: "Lock · Arm · Eco", icon: Lock },
  { name: "Sleep", desc: "Cool · Lock · Dim", icon: Wind },
];

const devices = [
  { name: "Living Room Lights", room: "Living Room", state: "78%", on: true, icon: Lightbulb },
  { name: "Climate Control", room: "Bedroom", state: "21.5°", on: true, icon: Thermometer },
  { name: "Front Door", room: "Entrance", state: "Locked", on: true, icon: Lock },
  { name: "Patio Camera", room: "Outdoor", state: "Streaming", on: true, icon: Camera },
  { name: "Kitchen Speaker", room: "Kitchen", state: "Idle", on: false, icon: Music },
  { name: "Bedroom AC", room: "Bedroom", state: "Auto", on: true, icon: Wind },
];

function Dashboard() {
  return (
    <AppShell title="Good Evening, Noor" subtitle="Tuesday · June 17 · 19:42 · 22°C outdoors">
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="glass rounded-2xl p-5 relative overflow-hidden group hover:border-primary/30 transition-all"
              >
                <div
                  className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${s.accent} blur-2xl opacity-70 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </span>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-3 font-display text-3xl font-semibold tracking-tight">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Energy + scenes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" />
                  Energy Consumption · Today
                </div>
                <div className="mt-2 font-display text-2xl font-semibold">18.4 kWh</div>
              </div>
              <div className="shrink-0 flex gap-1 text-xs">
                {["Day", "Week", "Month"].map((p, i) => (
                  <button
                    key={p}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      i === 0
                        ? "bg-primary/20 text-foreground border border-primary/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.66 0.18 255)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.66 0.18 255)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                  <XAxis
                    dataKey="t"
                    stroke="oklch(0.72 0.025 255)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="oklch(0.72 0.025 255)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.22 0.03 260 / 0.95)",
                      border: "1px solid oklch(1 0 0 / 0.1)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="kWh"
                    stroke="oklch(0.66 0.18 255)"
                    strokeWidth={2}
                    fill="url(#g1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Quick Scenes
                </div>
                <div className="mt-1 font-display text-lg font-semibold">One-tap moods</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {scenes.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.name}
                    className="text-left p-4 rounded-xl bg-surface/60 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/30 to-primary/5 grid place-items-center mb-3 group-hover:glow-primary transition-all">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Devices */}
        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 mb-5">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Active Devices
              </div>
              <div className="mt-1 font-display text-lg font-semibold">
                12 connected · 8 active
              </div>
            </div>
            <button className="shrink-0 text-xs text-primary hover:text-primary/80 inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {devices.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.name}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 rounded-xl bg-surface/40 border border-border hover:border-primary/30 transition-all"
                >
                  <div
                    className={`h-10 w-10 shrink-0 rounded-lg grid place-items-center ${
                      d.on
                        ? "bg-primary/15 text-primary"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{d.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {d.room} · {d.state}
                    </div>
                  </div>
                  <label className="shrink-0 relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={d.on} className="sr-only peer" />
                    <div className="w-9 h-5 bg-muted/60 rounded-full peer peer-checked:bg-primary transition-colors relative">
                      <div className="absolute top-0.5 left-0.5 h-4 w-4 bg-foreground rounded-full transition-transform peer-checked:translate-x-4" />
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
