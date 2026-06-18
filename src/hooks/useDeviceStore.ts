import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Device, Zone } from "@/components/devices/types";
import { mockDevices, mockZones } from "@/components/devices/mockData";

interface DeviceState {
  devices: Device[];
  zones: Zone[];
  setPowerState: (deviceId: string, powerState: "on" | "off") => void;
  togglePowerState: (deviceId: string) => void;
  getDeviceById: (deviceId: string) => Device | undefined;
  getDevicesByZone: (zoneId: string) => Device[];
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set, get) => ({
      devices: mockDevices,
      zones: mockZones,
      setPowerState: (deviceId, powerState) =>
        set((state) => ({
          devices: state.devices.map((d) =>
            d.id === deviceId ? { ...d, powerState, lastActivity: "Just now" } : d,
          ),
        })),
      togglePowerState: (deviceId) =>
        set((state) => ({
          devices: state.devices.map((d) =>
            d.id === deviceId
              ? {
                  ...d,
                  powerState: d.powerState === "on" ? "off" : "on",
                  lastActivity: "Just now",
                }
              : d,
          ),
        })),
      getDeviceById: (deviceId) => get().devices.find((d) => d.id === deviceId),
      getDevicesByZone: (zoneId) => get().devices.filter((d) => d.zoneId === zoneId),
    }),
    {
      name: "nosky-device-storage",
    },
  ),
);
