import React, { useState } from "react";
import { Device, ACDevice, InverterDevice, FanDevice, SocketDevice, LightDevice } from "./types";
import {
  Lightbulb,
  Plug,
  Wind,
  Battery,
  Thermometer,
  ChevronDown,
  Zap,
  Clock,
  Settings2,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { mockZones } from "./mockData";

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [powerState, setPowerState] = useState(device.powerState);
  const isActive = powerState === "on";
  const isOnline = device.status === "online";
  const zoneName = mockZones.find(z => z.id === device.zoneId)?.name || "Unknown Zone";

  const Icon = {
    Light: Lightbulb,
    Socket: Plug,
    AC: Thermometer,
    Fan: Wind,
    Inverter: Battery,
  }[device.type];

  return (
    <div className={cn(
      "glass rounded-3xl border border-white/5 transition-all duration-300 overflow-hidden",
      isOpen ? "ring-1 ring-primary/20 shadow-2xl" : "hover:border-primary/20 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/5"
    )}>
      <div className="p-5">
        {/* Collapsed State / Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
              isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
            )}>
              <Icon className={cn("h-6 w-6", isActive && "pulse-primary")} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white truncate">{device.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{zoneName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end gap-1 mr-2">
              <span className={cn(
                "flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full",
                isOnline ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                <span className={cn("h-1.5 w-1.5 rounded-full", isOnline ? "bg-success" : "bg-destructive")} />
                {device.status.toUpperCase()}
              </span>
              {isActive && (
                <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  <Zap className="h-2.5 w-2.5" /> ACTIVE
                </span>
              )}
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setPowerState(checked ? "on" : "off")}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {device.lastActivity}
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all",
              isOpen && "rotate-180 bg-primary/10 text-primary"
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Expanded State */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="space-y-6 pt-6 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {device.type === "AC" && <ACControls device={device} />}
            {device.type === "Inverter" && <InverterControls device={device} />}
            {device.type === "Fan" && <FanControls device={device} />}
            {device.type === "Socket" && <SocketControls device={device} />}
            {device.type === "Light" && <LightControls device={device} />}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Signal Strength</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">98%</span>
                  <Activity className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Firmware</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">v2.4.1</span>
                  <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

function ACControls({ device }: { device: ACDevice }) {
  const [temp, setTemp] = useState(device.temperature);

  const getTempColor = (t: number) => {
    if (t <= 20) return "bg-blue-600";
    if (t <= 24) return "bg-blue-400";
    if (t <= 27) return "bg-cyan-400";
    return "bg-slate-400";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white">Temperature</label>
          <span className={cn("text-2xl font-bold px-3 py-1 rounded-xl text-white transition-colors", getTempColor(temp))}>
            {temp}°C
          </span>
        </div>
        <Slider
          value={[temp]}
          min={16}
          max={30}
          step={1}
          onValueChange={([val]) => setTemp(val)}
          className="py-4"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-1">
          <span>16°C</span>
          <span>22°C</span>
          <span>30°C</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-white">Fan Speed</label>
        <ToggleGroup type="single" defaultValue={device.fanSpeed} className="justify-start gap-2">
          {["Auto", "Low", "Med", "High", "Turbo"].map((speed) => (
            <ToggleGroupItem
              key={speed}
              value={speed}
              className="flex-1 text-xs rounded-xl border-white/5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {speed}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-white">Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {["Cool", "Fan", "Dry", "Eco", "Auto"].map((mode) => (
            <button
              key={mode}
              className={cn(
                "py-2 text-xs font-medium rounded-xl border border-white/5 transition-all",
                mode === device.mode ? "bg-white/10 text-white border-white/20" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white">Energy Consumption</label>
          <span className="text-xs font-semibold text-primary">{device.todayUsage} kWh today</span>
        </div>
        <div className="h-20 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={device.energyHistory}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="usage"
                stroke="var(--color-primary)"
                fillOpacity={1}
                fill="url(#colorUsage)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function InverterControls({ device }: { device: InverterDevice }) {
  const getHealthColor = (h: number) => {
    if (h >= 90) return "bg-success/20 text-success border-success/20";
    if (h >= 70) return "bg-warning/20 text-warning border-warning/20";
    return "bg-destructive/20 text-destructive border-destructive/20";
  };

  const getHealthLabel = (h: number) => {
    if (h >= 90) return "Excellent";
    if (h >= 70) return "Good";
    if (h >= 50) return "Fair";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Battery Charge</p>
          <p className="text-3xl font-bold text-white">{device.batteryPercentage}%</p>
          <div className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block",
            getHealthColor(device.batteryHealth)
          )}>
            HEALTH: {getHealthLabel(device.batteryHealth)}
          </div>
        </div>

        <div className="relative h-16 w-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-xl blur-xl" />
          <div className="h-10 w-16 border-2 border-white/20 rounded-lg relative p-0.5 flex items-center">
             <div
               className={cn(
                 "h-full rounded-sm transition-all duration-1000",
                 device.batteryPercentage > 20 ? "bg-primary" : "bg-destructive animate-pulse"
               )}
               style={{ width: `${device.batteryPercentage}%` }}
             />
             <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-white/20 rounded-r-sm" />
             {device.chargingStatus === "Charging" && (
               <Zap className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-white drop-shadow-lg animate-charging" />
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Input Voltage", value: `${device.inputVoltage}V` },
          { label: "Output Voltage", value: `${device.outputVoltage}V` },
          { label: "Current Load", value: `${device.loadPercentage}%` },
          { label: "Est. Backup", value: device.backupTime },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-sm font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/10 p-3 rounded-2xl flex items-center gap-3">
        <Info className="h-4 w-4 text-primary" />
        <p className="text-[11px] text-primary/80">Inverter is currently {device.chargingStatus.toLowerCase()} from grid.</p>
      </div>
    </div>
  );
}

function FanControls({ device }: { device: FanDevice }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="text-sm font-medium text-white">Fan Speed</label>
        <ToggleGroup type="single" defaultValue={device.fanSpeed} className="justify-start gap-2">
          {["Low", "Medium", "High"].map((speed) => (
            <ToggleGroupItem
              key={speed}
              value={speed}
              className="flex-1 text-xs rounded-xl border-white/5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {speed}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">Auto-Oscillation</span>
        <Switch className="scale-75" />
      </div>
    </div>
  );
}

function SocketControls({ device }: { device: SocketDevice }) {
  return (
    <div className="space-y-4">
       <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
         <div>
           <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Power</p>
           <p className="text-xl font-bold text-white">{device.consumption || 0}W</p>
         </div>
         <Zap className="h-8 w-8 text-primary/40" />
       </div>
       <div className="grid grid-cols-2 gap-3">
         <div className="p-3 rounded-xl bg-white/5 border border-white/5">
           <p className="text-[10px] text-muted-foreground uppercase mb-1">Voltage</p>
           <p className="text-sm font-semibold text-white">224V</p>
         </div>
         <div className="p-3 rounded-xl bg-white/5 border border-white/5">
           <p className="text-[10px] text-muted-foreground uppercase mb-1">Current</p>
           <p className="text-sm font-semibold text-white">0.2A</p>
         </div>
       </div>
    </div>
  );
}

function LightControls({ device }: { device: LightDevice }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white">Brightness</label>
          <span className="text-xs font-bold text-primary">{device.brightness || 85}%</span>
        </div>
        <Slider defaultValue={[device.brightness || 85]} max={100} step={1} className="py-4" />
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium text-white">Color Temperature</label>
        <div className="h-4 w-full rounded-full bg-gradient-to-r from-blue-300 via-white to-orange-300" />
        <Slider defaultValue={[50]} max={100} step={1} className="py-2" />
      </div>
    </div>
  );
}
