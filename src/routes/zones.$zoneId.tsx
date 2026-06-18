import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Settings, Power, Cpu } from "lucide-react";
import { DeviceCard } from "@/components/devices/DeviceCard";
import { useDeviceStore } from "@/hooks/useDeviceStore";

export const Route = createFileRoute("/zones/$zoneId")({
  component: ZoneDetail,
});

function ZoneDetail() {
  const { zoneId } = Route.useParams();
  const { zones, devices } = useDeviceStore();
  const zone = zones.find((z) => z.id === zoneId);
  const zoneDevices = devices.filter((d) => d.zoneId === zoneId);

  if (!zone) {
    return (
      <AppShell title="Zone Not Found">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Zone Not Found</h2>
          <Link to="/zones" className="text-primary hover:underline">
            Back to Zones
          </Link>
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

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              Devices
            </h3>
            <span className="text-sm text-muted-foreground">{zoneDevices.length} Connected</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {zoneDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
