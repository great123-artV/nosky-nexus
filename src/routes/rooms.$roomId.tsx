import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Settings, Power, Thermometer, Lightbulb, Shield } from "lucide-react";

export const Route = createFileRoute("/rooms/$roomId")({
  component: RoomDetail,
});

function RoomDetail() {
  const { roomId } = Route.useParams();
  const roomName = roomId.charAt(0).toUpperCase() + roomId.slice(1);

  return (
    <AppShell title={roomName} subtitle="Room Control Center">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="glass h-10 w-10 rounded-xl grid place-items-center hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-3xl font-display font-bold">{roomName}</h2>
            <p className="text-muted-foreground">All systems active</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Controls */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary/20 grid place-items-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Main Lighting</div>
                    <div className="text-sm text-muted-foreground">4 fixtures connected</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-14 h-7 bg-muted/60 rounded-full peer peer-checked:bg-primary transition-colors relative">
                    <div className="absolute top-1 left-1 h-5 w-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-7" />
                  </div>
                </label>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Brightness</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%] glow-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Color Temperature</span>
                    <span className="font-medium">2700K (Warm)</span>
                  </div>
                  <div className="h-2 bg-gradient-to-r from-orange-300 via-white to-blue-300 rounded-full" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Thermometer className="h-5 w-5 text-success" />
                  <span className="font-medium">Climate</span>
                </div>
                <div className="text-4xl font-display font-bold mb-1">22.5°C</div>
                <div className="text-sm text-muted-foreground">Target: 22.0°C</div>
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium">Security</span>
                </div>
                <div className="text-xl font-display font-bold mb-1">Secure</div>
                <div className="text-sm text-muted-foreground">Motion sensors armed</div>
              </div>
            </div>
          </div>

          {/* Sidebar controls */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Quick Scenes</h3>
              <div className="space-y-2">
                {["Relax", "Read", "Bright", "Off"].map((scene) => (
                  <button
                    key={scene}
                    className="w-full text-left px-4 py-3 rounded-xl bg-surface/40 border border-border hover:border-primary/40 transition-all text-sm font-medium"
                  >
                    {scene}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full glass-strong rounded-2xl p-4 flex items-center justify-center gap-2 text-destructive font-medium hover:bg-destructive/10 transition-colors">
              <Power className="h-4 w-4" />
              Power Off Room
            </button>

            <button className="w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 text-muted-foreground font-medium hover:bg-accent transition-colors">
              <Settings className="h-4 w-4" />
              Room Settings
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
