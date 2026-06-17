import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Lightbulb,
  Thermometer,
  Lock,
  Camera,
  Music,
  Wind,
  Tv,
  Wifi,
  Plug,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/devices")({
  head: () => ({
    meta: [
      { title: "Devices — Nosky HomeOS" },
      { name: "description", content: "All connected devices in one place." },
    ],
  }),
  component: Devices,
});

const devices = [
  { name: "Philips Hue Strip", room: "Living Room", type: "Light", on: true, icon: Lightbulb, sig: 98 },
  { name: "Nest Thermostat", room: "Hallway", type: "Climate", on: true, icon: Thermometer, sig: 96 },
  { name: "August Smart Lock", room: "Entrance", type: "Security", on: true, icon: Lock, sig: 92 },
  { name: "Arlo Pro 4", room: "Outdoor", type: "Camera", on: true, icon: Camera, sig: 88 },
  { name: "Sonos Beam", room: "Media Room", type: "Audio", on: false, icon: Music, sig: 85 },
  { name: "Dyson Purifier", room: "Bedroom", type: "Air", on: true, icon: Wind, sig: 94 },
  { name: "LG OLED C3", room: "Living Room", type: "Display", on: false, icon: Tv, sig: 99 },
  { name: "Eero Pro 6E", room: "Office", type: "Network", on: true, icon: Wifi, sig: 100 },
  { name: "Smart Plug Kitchen", room: "Kitchen", type: "Power", on: true, icon: Plug, sig: 90 },
];

const categories = ["All", "Lights", "Climate", "Security", "Media", "Network"];

function Devices() {
  return (
    <AppShell title="Devices" subtitle="9 connected · 7 active · 2 standby">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Filters */}
        <div className="glass rounded-2xl p-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              placeholder="Search devices…"
              className="bg-transparent outline-none text-sm placeholder:text-muted-foreground/70 w-full"
            />
          </div>
          <div className="hidden md:flex shrink-0 gap-1">
            {categories.map((c, i) => (
              <button
                key={c}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  i === 0
                    ? "bg-primary/20 text-foreground border border-primary/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.name}
                className="glass rounded-2xl p-5 hover:border-primary/30 transition-all"
              >
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                  <div
                    className={`h-11 w-11 shrink-0 rounded-xl grid place-items-center ${
                      d.on
                        ? "bg-primary/15 text-primary"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{d.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {d.room} · {d.type}
                    </div>
                  </div>
                  <label className="shrink-0 relative inline-flex items-center cursor-pointer mt-1">
                    <input type="checkbox" defaultChecked={d.on} className="sr-only peer" />
                    <div className="w-9 h-5 bg-muted/60 rounded-full peer peer-checked:bg-primary transition-colors relative">
                      <div className="absolute top-0.5 left-0.5 h-4 w-4 bg-foreground rounded-full transition-transform peer-checked:translate-x-4" />
                    </div>
                  </label>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        d.on ? "bg-success" : "bg-muted-foreground/50"
                      }`}
                    />
                    {d.on ? "Online" : "Standby"}
                  </span>
                  <span>Signal {d.sig}%</span>
                </div>
                <div className="mt-2 h-1 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full"
                    style={{ width: `${d.sig}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
