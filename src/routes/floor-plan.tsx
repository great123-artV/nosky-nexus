import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import {
  Lightbulb,
  Power,
  Wind,
  Fan,
  Battery,
  Info,
  ChevronRight,
  Plus
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/floor-plan")({
  head: () => ({
    meta: [
      { title: "Floor Plan — Nosky HomeOS" },
      {
        name: "description",
        content: "Interactive 2D floor plan of your smart home.",
      },
    ],
  }),
  component: FloorPlanPage,
});

type DeviceType = "bulb" | "socket" | "ac" | "fan" | "inverter";

interface Device {
  id: string;
  name: string;
  type: DeviceType;
  isOn: boolean;
  room: string;
  battery?: number;
  lastActivity: string;
}

const INITIAL_DEVICES: Device[] = [
  // Parlor
  { id: "p1", name: "Parlor Main Light", type: "bulb", isOn: true, room: "Parlor", lastActivity: "2 mins ago" },
  { id: "p2", name: "Parlor AC", type: "ac", isOn: false, room: "Parlor", lastActivity: "1 hour ago" },
  { id: "p3", name: "Parlor Socket", type: "socket", isOn: true, room: "Parlor", lastActivity: "Just now" },
  { id: "p4", name: "Ceiling Fan", type: "fan", isOn: true, room: "Parlor", lastActivity: "10 mins ago" },

  // Master Bedroom
  { id: "m1", name: "Bedroom Light", type: "bulb", isOn: false, room: "Master Bedroom", lastActivity: "4 hours ago" },
  { id: "m2", name: "Bedroom AC", type: "ac", isOn: true, room: "Master Bedroom", lastActivity: "30 mins ago" },

  // Children's Room
  { id: "c1", name: "Kids Light", type: "bulb", isOn: true, room: "Children's Room", lastActivity: "5 mins ago" },
  { id: "c2", name: "Kids Fan", type: "fan", isOn: false, room: "Children's Room", lastActivity: "2 hours ago" },

  // Store Room
  { id: "s1", name: "Store Light", type: "bulb", isOn: false, room: "Store Room", lastActivity: "Yesterday" },
  { id: "s2", name: "Main Inverter", type: "inverter", isOn: true, room: "Store Room", battery: 92, lastActivity: "Always On" },

  // Passage
  { id: "pass1", name: "Passage Light", type: "bulb", isOn: true, room: "Passage", lastActivity: "15 mins ago" },
];

const DEVICE_ICONS: Record<DeviceType, any> = {
  bulb: Lightbulb,
  socket: Power,
  ac: Wind,
  fan: Fan,
  inverter: Battery,
};

function DeviceIcon({ device, onClick }: { device: Device; onClick: () => void }) {
  const Icon = DEVICE_ICONS[device.type];
  const isOn = device.isOn;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative p-2.5 rounded-xl transition-all duration-500 group ${
        isOn
          ? "bg-primary/20 text-primary glow-primary scale-110 shadow-lg shadow-primary/20 pulse-primary"
          : "bg-surface/40 text-muted-foreground hover:text-foreground border border-border/50"
      }`}
    >
      <Icon className={`h-5 w-5 ${isOn ? "animate-in fade-in zoom-in duration-500" : ""}`} />
      {isOn && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary glow-primary" />
      )}

      {/* Tooltip-like label on hover */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-[10px] rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {device.name}
      </div>
    </button>
  );
}

function RoomCard({
  name,
  devices,
  onDeviceClick,
  className = ""
}: {
  name: string;
  devices: Device[];
  onDeviceClick: (d: Device) => void;
  className?: string;
}) {
  const onlineCount = devices.filter(d => d.isOn).length;

  return (
    <div className={`glass group rounded-[2rem] p-6 flex flex-col hover:border-primary/40 transition-all duration-700 relative overflow-hidden ${className}`}>
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              {devices.length} Devices
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
              All Online
            </span>
          </div>
        </div>
        {name === "Store Room" && devices.some(d => d.type === "inverter") && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 glass-strong rounded-full animate-in fade-in zoom-in duration-1000">
            <Battery className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">92%</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-wrap gap-3 items-center justify-center py-4 relative z-10">
        {devices.map((device) => (
          <DeviceIcon
            key={device.id}
            device={device}
            onClick={() => onDeviceClick(device)}
          />
        ))}
      </div>
    </div>
  );
}

function FloorPlanPage() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d =>
      d.id === id ? { ...d, isOn: !d.isOn } : d
    ));
    if (selectedDevice?.id === id) {
      setSelectedDevice(prev => prev ? { ...prev, isOn: !prev.isOn } : null);
    }
  };

  const getRoomDevices = (roomName: string) => {
    return devices.filter(d => d.room === roomName);
  };

  return (
    <AppShell title="Floor Plan" subtitle="Nosky HomeOS Interactive Layout">
      <div className="max-w-[1400px] mx-auto space-y-8 h-full">
        {/* Header & Legend */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="font-display text-3xl font-bold tracking-tight text-gradient">Interactive Home</h2>
            <p className="text-muted-foreground">Monitor and control your smart home from a single view.</p>
          </div>

          <div className="flex items-center gap-6 glass px-6 py-3 rounded-2xl border-border/40">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-muted-foreground">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full border border-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary pulse-ring" />
              <span className="text-xs font-medium text-muted-foreground">Active</span>
            </div>
          </div>
        </div>

        {/* Floor Plan Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 min-h-[600px]">
          {/* Top Row: Parlor (Full Width) */}
          <div className="md:col-span-2">
            <RoomCard
              name="Parlor"
              devices={getRoomDevices("Parlor")}
              onDeviceClick={setSelectedDevice}
              className="h-64"
            />
          </div>

          {/* Second Row: Master Bedroom & Children Room */}
          <RoomCard
            name="Master Bedroom"
            devices={getRoomDevices("Master Bedroom")}
            onDeviceClick={setSelectedDevice}
            className="h-56"
          />
          <RoomCard
            name="Children's Room"
            devices={getRoomDevices("Children's Room")}
            onDeviceClick={setSelectedDevice}
            className="h-56"
          />

          {/* Third Row: Store Room & Passage */}
          <RoomCard
            name="Store Room"
            devices={getRoomDevices("Store Room")}
            onDeviceClick={setSelectedDevice}
            className="h-56"
          />
          <RoomCard
            name="Passage"
            devices={getRoomDevices("Passage")}
            onDeviceClick={setSelectedDevice}
            className="h-56 border-primary/20 bg-primary/[0.02]"
          />
        </div>

        {/* Device Control Drawer */}
        <Sheet open={!!selectedDevice} onOpenChange={(open) => !open && setSelectedDevice(null)}>
          <SheetContent className="w-full sm:max-w-md glass-strong border-l border-white/10 p-0">
            {selectedDevice && (
              <div className="h-full flex flex-col">
                <SheetHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Device Control</div>
                      <SheetTitle className="font-display text-3xl font-bold tracking-tight">
                        {selectedDevice.name}
                      </SheetTitle>
                      <SheetDescription className="text-muted-foreground">
                        {selectedDevice.room} • {selectedDevice.type.toUpperCase()}
                      </SheetDescription>
                    </div>
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      selectedDevice.isOn
                        ? "bg-primary/20 text-primary glow-primary"
                        : "bg-surface text-muted-foreground border border-border"
                    }`}>
                      {(() => {
                        const Icon = DEVICE_ICONS[selectedDevice.type];
                        return <Icon className="h-7 w-7" />;
                      })()}
                    </div>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8">
                  {/* Status Toggle */}
                  <div className="glass rounded-3xl p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-semibold">Power Status</div>
                      <div className="text-sm text-muted-foreground">
                        Current: <span className={selectedDevice.isOn ? "text-primary font-bold" : "text-muted-foreground"}>
                          {selectedDevice.isOn ? "ON" : "OFF"}
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={selectedDevice.isOn}
                      onCheckedChange={() => toggleDevice(selectedDevice.id)}
                      className="scale-125 data-[state=checked]:bg-primary"
                    />
                  </div>

                  {/* Device Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-2xl p-4 space-y-1">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Signal Strength</div>
                      <div className="font-bold flex items-center gap-2">
                        Excellent
                        <div className="flex gap-0.5 items-end h-3">
                          <div className="w-1 h-1.5 bg-primary rounded-full" />
                          <div className="w-1 h-2 bg-primary rounded-full" />
                          <div className="w-1 h-3 bg-primary rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="glass rounded-2xl p-4 space-y-1">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Last Activity</div>
                      <div className="font-bold">{selectedDevice.lastActivity}</div>
                    </div>
                  </div>

                  {/* Battery for Inverter */}
                  {selectedDevice.type === "inverter" && (
                    <div className="glass rounded-3xl p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold flex items-center gap-2">
                          <Battery className="h-5 w-5 text-emerald-400" />
                          Battery Status
                        </div>
                        <span className="text-2xl font-display font-bold text-emerald-400">92%</span>
                      </div>
                      <div className="h-3 w-full bg-surface rounded-full overflow-hidden border border-border/30">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 glow-emerald rounded-full"
                          style={{ width: "92%" }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Input</div>
                          <div className="font-bold text-sm">234V · Charging</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Output</div>
                          <div className="font-bold text-sm">220V · 450W</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Advanced Settings */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold px-1">Settings</h4>
                    <div className="space-y-2">
                      <button className="w-full h-14 glass rounded-2xl flex items-center justify-between px-6 hover:bg-white/5 transition-colors group">
                        <span className="font-medium">Schedules</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button className="w-full h-14 glass rounded-2xl flex items-center justify-between px-6 hover:bg-white/5 transition-colors group">
                        <span className="font-medium">Automation Rules</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button className="w-full h-14 glass rounded-2xl flex items-center justify-between px-6 hover:bg-white/5 transition-colors group">
                        <span className="font-medium">Device Info</span>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                <SheetFooter className="p-8 pt-4">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all">
                    Remove Device
                  </Button>
                </SheetFooter>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppShell>
  );
}
