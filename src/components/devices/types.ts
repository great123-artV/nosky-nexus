import { LucideIcon } from "lucide-react";

export type DeviceType = "Light" | "Socket" | "AC" | "Fan" | "Inverter";

export interface DeviceBase {
  id: string;
  name: string;
  room: string;
  type: DeviceType;
  online: boolean;
  active: boolean;
  lastActivity: string;
}

export interface LightDevice extends DeviceBase {
  type: "Light";
  brightness?: number;
}

export interface SocketDevice extends DeviceBase {
  type: "Socket";
  consumption?: number; // in Watts
}

export interface ACDevice extends DeviceBase {
  type: "AC";
  temperature: number;
  mode: "Cool" | "Fan" | "Dry" | "Eco" | "Auto";
  fanSpeed: "Auto" | "Low" | "Medium" | "High" | "Turbo";
  energyHistory: { time: string; usage: number }[];
  todayUsage: number;
}

export interface FanDevice extends DeviceBase {
  type: "Fan";
  fanSpeed: "Low" | "Medium" | "High";
}

export interface InverterDevice extends DeviceBase {
  type: "Inverter";
  batteryPercentage: number;
  batteryHealth: number; // 0-100
  inputVoltage: number;
  outputVoltage: number;
  loadPercentage: number;
  backupTime: string;
  chargingStatus: "Charging" | "Discharging" | "Full" | "Idle";
}

export type Device = LightDevice | SocketDevice | ACDevice | FanDevice | InverterDevice;

export interface DeviceCategory {
  id: string;
  label: string;
  icon?: LucideIcon;
}
