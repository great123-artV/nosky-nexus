import { Device } from "./types";
import { Wifi, Activity, Wind, Battery } from "lucide-react";

interface DeviceSummaryProps {
  devices: Device[];
}

export function DeviceSummary({ devices }: DeviceSummaryProps) {
  const onlineCount = devices.filter((d) => d.online).length;
  const activeCount = devices.filter((d) => d.active).length;
  const climateCount = devices.filter((d) => d.type === "AC" && d.active).length;

  // For mock, take the first inverter's health or a default
  const inverter = devices.find((d) => d.type === "Inverter") as any;
  const batteryHealth = inverter?.batteryHealth || 92;

  const summaries = [
    {
      label: "Devices Online",
      value: `${onlineCount} Devices`,
      icon: Wifi,
      color: "text-primary",
      glow: "glow-primary",
    },
    {
      label: "Currently Active",
      value: `${activeCount} Active`,
      icon: Activity,
      color: "text-success",
      glow: "glow-emerald",
    },
    {
      label: "Climate Systems",
      value: `${climateCount} Running`,
      icon: Wind,
      color: "text-blue-400",
      glow: "shadow-[0_0_20px_-5px_rgba(96,165,250,0.5)]",
    },
    {
      label: "Battery Health",
      value: `${batteryHealth}% Health`,
      icon: Battery,
      color: "text-emerald-400",
      glow: "glow-emerald",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {summaries.map((s, i) => (
        <div
          key={i}
          className={`glass rounded-2xl p-5 border border-white/5 flex items-center gap-4 transition-all hover:scale-[1.02] ${s.glow}`}
        >
          <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}>
            <s.icon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {s.label}
            </div>
            <div className="text-lg font-bold text-white">{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
