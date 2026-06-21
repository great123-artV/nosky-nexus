import React, { useState, useEffect, useRef } from "react";
import { Device } from "./types";
import { Lightbulb, Plug, Wind, Battery, Thermometer, ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useDeviceStore } from "@/hooks/useDeviceStore";

interface DeviceCardProps {
  device: Device;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Light: Lightbulb,
  Socket: Plug,
  AC: Thermometer,
  Fan: Wind,
  Inverter: Battery,
};

export function DeviceCard({ device }: DeviceCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [justChanged, setJustChanged] = useState(false);
  const prevStateRef = useRef(device.powerState);
  const { togglePowerState, setPowerState, zones } = useDeviceStore();
  const isActive = device.powerState === "on";
  const isOnline = device.status === "online";
  const zoneName = zones.find((z) => z.id === device.zoneId)?.name || "Unknown Zone";

  // Real-time sync flash — fires whenever powerState changes (voice, switch, or external update)
  useEffect(() => {
    if (prevStateRef.current !== device.powerState) {
      prevStateRef.current = device.powerState;
      setJustChanged(true);
      const t = setTimeout(() => setJustChanged(false), 1200);
      return () => clearTimeout(t);
    }
  }, [device.powerState]);

  const Icon = ICON_MAP[device.type] || Lightbulb;

  // Handle "Coming Soon" devices
  const isComingSoon = ["AC", "Fan", "Inverter"].includes(device.type);

  return (
    <div
      className={cn(
        "glass rounded-3xl border border-white/5 transition-all duration-300 overflow-hidden",
        isOpen ? "ring-1 ring-primary/20 shadow-2xl" : "hover:border-primary/20 hover:scale-[1.01]",
      )}
    >
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground",
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "animate-pulse")} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white truncate">{device.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{zoneName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isComingSoon ? (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-none uppercase text-[10px] tracking-wider"
              >
                Coming Soon
              </Badge>
            ) : (
              <>
                <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">
                  {isActive ? "ON" : "OFF"}
                </span>
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => setPowerState(device.id, checked ? "on" : "off")}
                  className="data-[state=checked]:bg-primary"
                />
              </>
            )}
          </div>
        </div>

        {/* Action/Expand Button */}
        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all",
              isOpen && "rotate-180 bg-primary/10 text-primary",
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="h-px bg-white/5" />

            {device.type === "AC" && (
              <div className="py-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">AC Coming Soon</p>
              </div>
            )}
            {device.type === "Inverter" && (
              <div className="py-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Inverter Monitoring Coming Soon
                </p>
              </div>
            )}
            {device.type === "Fan" && (
              <div className="py-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Fan Speed Regulation Coming Soon
                </p>
              </div>
            )}
            {!isComingSoon && (
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] uppercase",
                    isOnline
                      ? "text-emerald-400 border-emerald-400/20"
                      : "text-destructive border-destructive/20",
                  )}
                >
                  {device.status}
                </Badge>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
