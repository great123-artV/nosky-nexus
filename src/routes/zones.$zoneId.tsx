import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Settings, Power, Thermometer, Lightbulb, Shield, Cpu } from "lucide-react";
import { mockZones, mockDevices } from "@/components/devices/mockData";
import { DeviceCard } from "@/components/devices/DeviceCard";

export const Route = createFileRoute("/zones/$zoneId")({
  component: ZoneDetail,
});

function ZoneDetail() {
  const { zoneId } = Route.useParams();
  const zone = mockZones.find(z => z.id === zoneId);
  const zoneDevices = mockDevices.filter(d => d.zoneId === zoneId);

  if (!zone) {
    return (
      <AppShell title="Zone Not Found">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Zone Not Found</h2>
          <Link to="/zones" className="text-primary hover:underline">Back to Zones</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={zone.name} subtitle={`${zone.floor} • ${zoneDevices.length} devices`}>
      <div className="max-w-[1400px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/zones"
              className="glass h-10 w-10 rounded-xl grid place-items-center hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h2 className="text-3xl font-display font-bold tracking-tight">{zone.name}</h2>
              <p className="text-muted-foreground">{zone.description || "Zone Control Center"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button className="glass h-12 px-6 rounded-2xl flex items-center gap-2 text-sm font-medium hover:bg-accent transition-colors">
                <Settings className="h-4 w-4" />
                Settings
             </button>
             <button className="glass-strong h-12 px-6 rounded-2xl flex items-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                <Power className="h-4 w-4" />
                Off
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls & Devices */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass rounded-3xl p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-success/20 grid place-items-center shrink-0">
                  <Thermometer className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Climate</div>
                  <div className="text-2xl font-display font-bold">22.5°C</div>
                </div>
              </div>
              <div className="glass rounded-3xl p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 grid place-items-center shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Security</div>
                  <div className="text-2xl font-display font-bold">Armed</div>
                </div>
              </div>
            </div>

            {/* Device Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  Devices
                </h3>
                <span className="text-sm text-muted-foreground">{zoneDevices.length} Connected</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {zoneDevices.map(device => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Insights */}
          <div className="space-y-6">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="font-display text-xl font-bold tracking-tight">Zone Insights</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-surface/40 border border-border">
                  <span className="text-sm text-muted-foreground">Power Usage</span>
                  <span className="font-bold">0.45 kW</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-surface/40 border border-border">
                  <span className="text-sm text-muted-foreground">Daily Uptime</span>
                  <span className="font-bold text-success">99.8%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">Quick Scenes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {["Relax", "Work", "Focus", "Sleep"].map((s) => (
                    <button key={s} className="px-4 py-3 rounded-xl bg-surface/40 border border-border hover:border-primary/40 transition-all text-xs font-medium">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
