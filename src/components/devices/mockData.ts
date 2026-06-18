import { Device, Zone } from "./types";

export const mockZones: Zone[] = [
  {
    id: "parlor",
    name: "Parlor",
    description: "Main living area",
    icon: "sofa",
    floor: "Ground Floor",
    devices: ["parlor-bulb-1", "parlor-bulb-2", "parlor-tv-socket", "parlor-ac-socket", "parlor-fridge-socket", "parlor-ac"],
    position: { x: 0, y: 0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "master-bedroom",
    name: "Master Bedroom",
    description: "Primary bedroom",
    icon: "bed",
    floor: "Ground Floor",
    devices: ["master-wall-socket", "master-ac-socket", "master-bulb"],
    position: { x: 1, y: 0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "childrens-room",
    name: "Children's Room",
    description: "Kids' bedroom",
    icon: "baby",
    floor: "Ground Floor",
    devices: ["kids-bulb", "kids-tv-socket", "kids-ac-socket"],
    position: { x: 0, y: 1 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "store-room",
    name: "Store Room",
    description: "Storage area",
    icon: "box",
    floor: "Ground Floor",
    devices: ["store-bulb", "store-fan", "store-wall-socket", "store-inverter"],
    position: { x: 1, y: 1 },
    createdAt: new Date().toISOString(),
  },
];

export const mockDevices: Device[] = [
  // Parlor
  { id: "parlor-bulb-1", name: "Bulb 1", zoneId: "parlor", type: "Light", status: "online", powerState: "on", lastActivity: "Just now" },
  { id: "parlor-bulb-2", name: "Bulb 2", zoneId: "parlor", type: "Light", status: "online", powerState: "off", lastActivity: "5m ago" },
  { id: "parlor-tv-socket", name: "TV Socket", zoneId: "parlor", type: "Socket", status: "online", powerState: "on", lastActivity: "Just now" },
  { id: "parlor-ac-socket", name: "AC Socket", zoneId: "parlor", type: "Socket", status: "online", powerState: "on", lastActivity: "Just now" },
  { id: "parlor-fridge-socket", name: "Fridge Socket", zoneId: "parlor", type: "Socket", status: "online", powerState: "on", lastActivity: "Just now" },
  { id: "parlor-ac", name: "AC", zoneId: "parlor", type: "AC", status: "online", powerState: "off", lastActivity: "10m ago" },

  // Master Bedroom
  { id: "master-wall-socket", name: "Wall Socket", zoneId: "master-bedroom", type: "Socket", status: "online", powerState: "on", lastActivity: "Just now" },
  { id: "master-ac-socket", name: "AC Socket", zoneId: "master-bedroom", type: "Socket", status: "online", powerState: "on", lastActivity: "Just now" },
  { id: "master-bulb", name: "Bulb", zoneId: "master-bedroom", type: "Light", status: "online", powerState: "off", lastActivity: "2h ago" },

  // Children's Room
  { id: "kids-bulb", name: "Bulb", zoneId: "childrens-room", type: "Light", status: "online", powerState: "on", lastActivity: "Just now" },
  { id: "kids-tv-socket", name: "TV Socket", zoneId: "childrens-room", type: "Socket", status: "online", powerState: "off", lastActivity: "1h ago" },
  { id: "kids-ac-socket", name: "AC Socket", zoneId: "childrens-room", type: "Socket", status: "online", powerState: "off", lastActivity: "1h ago" },

  // Store Room
  { id: "store-bulb", name: "Bulb", zoneId: "store-room", type: "Light", status: "online", powerState: "off", lastActivity: "1d ago" },
  { id: "store-fan", name: "Fan", zoneId: "store-room", type: "Fan", status: "online", powerState: "on", lastActivity: "Just now" },
  { id: "store-wall-socket", name: "Wall Socket", zoneId: "store-room", type: "Socket", status: "online", powerState: "on", lastActivity: "Just now" },
  { id: "store-inverter", name: "Inverter", zoneId: "store-room", type: "Inverter", status: "online", powerState: "on", lastActivity: "Just now" },
];
