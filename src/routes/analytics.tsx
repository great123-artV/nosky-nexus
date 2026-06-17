import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingDown, TrendingUp, Zap, Droplets, Thermometer } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Nosky HomeOS" },
      { name: "description", content: "Deep insights into your home's performance." },
    ],
  }),
  component: Analytics,
});

const weekly = [
  { d: "Mon", energy: 22, water: 140 },
  { d: "Tue", energy: 18, water: 126 },
  { d: "Wed", energy: 24, water: 155 },
  { d: "Thu", energy: 19, water: 132 },
  { d: "Fri", energy: 27, water: 168 },
  { d: "Sat", energy: 31, water: 192 },
  { d: "Sun", energy: 28, water: 178 },
];

const temp = [
  { t: "00", living: 21, bedroom: 20 },
  { t: "04", living: 20, bedroom: 19 },
  { t: "08", living: 22, bedroom: 21 },
  { t: "12", living: 23, bedroom: 22 },
  { t: "16", living: 24, bedroom: 22 },
  { t: "20", living: 22, bedroom: 21 },
];

const kpis = [
  { label: "Energy Saved", value: "−18%", trend: "down", icon: Zap, sub: "vs. last month" },
  { label: "Water Efficiency", value: "+12%", trend: "up", icon: Droplets, sub: "above target" },
  { label: "Avg. Comfort", value: "21.8°", trend: "up", icon: Thermometer, sub: "ideal range" },
];

function Analytics() {
  return (
    <AppShell title="Analytics" subtitle="Performance insights across your home">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            const Trend = k.trend === "up" ? TrendingUp : TrendingDown;
            return (
              <div key={k.label} className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {k.label}
                  </span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3 flex items-end gap-2">
                  <span className="font-display text-3xl font-semibold">{k.value}</span>
                  <Trend
                    className={`h-4 w-4 mb-1 ${
                      k.trend === "down" ? "text-success" : "text-primary"
                    }`}
                  />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{k.sub}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-6">
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Weekly Usage
              </div>
              <div className="mt-1 font-display text-lg font-semibold">
                Energy & Water · last 7 days
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly}>
                  <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                  <XAxis
                    dataKey="d"
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
                  <Bar dataKey="energy" fill="oklch(0.66 0.18 255)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="water" fill="oklch(0.72 0.19 145)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Temperature
              </div>
              <div className="mt-1 font-display text-lg font-semibold">
                Living Room vs Bedroom · today
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temp}>
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
                  <Line
                    type="monotone"
                    dataKey="living"
                    stroke="oklch(0.66 0.18 255)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bedroom"
                    stroke="oklch(0.78 0.16 75)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
