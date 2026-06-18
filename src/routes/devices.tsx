import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState, useMemo } from "react";
import { Search, Filter, LayoutGrid, List } from "lucide-react";
import { mockDevices } from "@/components/devices/mockData";
import { DeviceSummary } from "@/components/devices/DeviceSummary";
import { DeviceCard } from "@/components/devices/DeviceCard";
import { DeviceType } from "@/components/devices/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/devices")({
  head: () => ({
    meta: [
      { title: "Device Center — Nosky HomeOS" },
      { name: "description", content: "Advanced control center for all your Nosky Tech devices." },
    ],
  }),
  component: DevicesPage,
});

const categories: { id: string; label: string; types?: DeviceType[] }[] = [
  { id: "all", label: "All Devices" },
  { id: "lights", label: "Lights", types: ["Light"] },
  { id: "sockets", label: "Sockets", types: ["Socket"] },
  { id: "climate", label: "Climate", types: ["AC", "Fan"] },
  { id: "power", label: "Power", types: ["Inverter"] },
];

function DevicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredDevices = useMemo(() => {
    return mockDevices.filter((device) => {
      const matchesSearch =
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.type.toLowerCase().includes(searchQuery.toLowerCase());

      const category = categories.find(c => c.id === activeCategory);
      const matchesCategory = activeCategory === "all" || (category?.types?.includes(device.type));

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const activeCount = mockDevices.filter(d => d.active).length;
  const onlineCount = mockDevices.filter(d => d.online).length;
  const climateRunning = mockDevices.filter(d => d.type === "AC" && d.active).length;

  return (
    <AppShell
      title="Device Center"
      subtitle={`${onlineCount} online · ${activeCount} active · ${climateRunning} climate running`}
    >
      <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
        {/* Top Summary Section */}
        <DeviceSummary devices={mockDevices} />

        {/* Controls and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="glass w-full md:w-96 rounded-2xl p-2 pl-4 flex items-center gap-3 border border-white/5 focus-within:border-primary/40 transition-colors">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, room, or type..."
              className="bg-transparent outline-none text-sm placeholder:text-muted-foreground/60 w-full text-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all border",
                  activeCategory === c.id
                    ? "bg-primary text-primary-foreground border-primary glow-primary"
                    : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:text-white"
                )}
              >
                {c.label}
              </button>
            ))}
            <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />
            <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-white transition-all hidden md:block">
              <Filter className="h-4 w-4" />
            </button>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
              <button className="p-1.5 rounded-lg bg-primary/20 text-primary transition-all">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-white transition-all">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Device Grid */}
        {filteredDevices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-20 flex flex-col items-center justify-center text-center border border-white/5">
            <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No devices found</h3>
            <p className="text-muted-foreground max-w-xs">
              We couldn't find any devices matching "{searchQuery}" in {categories.find(c => c.id === activeCategory)?.label}.
            </p>
            <button
              onClick={() => {setSearchQuery(""); setActiveCategory("all");}}
              className="mt-8 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
