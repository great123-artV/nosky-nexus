export type DeviceType = "Light" | "Socket" | "AC" | "Fan" | "Inverter";

export interface Device {
  id: string;
  name: string;
  zoneId: string;
  type: DeviceType;
  status: "online" | "offline";
  powerState: "on" | "off";
  lastActivity: string;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  icon: string;
  floor: string;
  devices: string[]; // IDs of devices in this zone
  position: { x: number; y: number };
  createdAt: string;
}
