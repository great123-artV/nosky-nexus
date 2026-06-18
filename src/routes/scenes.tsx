import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Home,
  Moon,
  Plane,
  Zap,
  Sparkles,
  Plus,
  ChevronRight,
  ShieldCheck,
  Clock
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/scenes")({
  component: ScenesPage,
});

type SceneId = "home" | "night" | "away" | "power-saving";

interface Scene {
  id: SceneId;
  name: string;
  description: string;
  icon: typeof Home;
  color: string;
  glowColor: string;
  actions: string[];
  devicesAffected: number;
}

const SCENES: Scene[] = [
  {
    id: "home",
    name: "Home Mode",
    description: "Normal Daily Living",
    icon: Home,
    color: "text-blue-400",
    glowColor: "shadow-blue-500/20",
    devicesAffected: 12,
    actions: ["Enable commonly used sockets", "Normal lighting", "Comfortable environment"],
  },
  {
    id: "night",
    name: "Night Mode",
    description: "Sleep Preparation",
    icon: Moon,
    color: "text-indigo-400",
    glowColor: "shadow-indigo-500/20",
    devicesAffected: 7,
    actions: ["Turn off parlor devices", "Dim room lighting", "Reduce unnecessary power usage"],
  },
  {
    id: "away",
    name: "Away Mode",
    description: "Leaving Home",
    icon: Plane,
    color: "text-slate-400",
    glowColor: "shadow-slate-500/20",
    devicesAffected: 18,
    actions: ["Turn off lights & fans", "Disable AC units", "Security-critical devices active"],
  },
  {
    id: "power-saving",
    name: "Power Saving",
    description: "Energy Optimization",
    icon: Zap,
    color: "text-emerald-400",
    glowColor: "shadow-emerald-500/20",
    devicesAffected: 9,
    actions: ["Disable unused sockets", "Reduce AC usage", "Optimize inverter runtime"],
  },
];

function ScenesPage() {
  const [activeSceneId, setActiveSceneId] = useState<SceneId | null>(null);
  const [lastActivated, setLastActivated] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeScene = SCENES.find(s => s.id === activeSceneId);

  const handleActivate = (scene: Scene) => {
    setActiveSceneId(scene.id);
    setLastActivated(new Date());
    toast.success(`${scene.name} Activated`, {
      description: `${scene.devicesAffected} devices adjusted successfully`,
    });
  };

  return (
    <AppShell title="Smart Scenes" subtitle="Home Behavior Control Center">
      <div className="max-w-[1200px] mx-auto space-y-12">

        {/* Top Header with Create Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="font-display text-3xl font-bold tracking-tight text-gradient">
              Automation Scenes
            </h2>
            <p className="text-muted-foreground">
              Select an operating mode to adjust your entire home.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 glass hover:bg-primary/10 hover:border-primary/30 transition-all rounded-2xl text-sm font-medium group"
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Create Scene
          </button>
        </div>

        {/* Current Active Scene Summary */}
        <div className="glass-strong rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group border border-primary/10 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="h-32 w-32 text-primary" />
          </div>

          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className={`h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 grid place-items-center ${activeSceneId ? 'pulse-primary' : ''}`}>
              {activeScene ? (
                <activeScene.icon className={`h-12 w-12 ${activeScene.color}`} />
              ) : (
                <Sparkles className="h-12 w-12 text-muted-foreground/40" />
              )}
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                  Current Active Mode
                </span>
                {activeSceneId && (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold border border-primary/20 animate-in fade-in zoom-in duration-300">
                    <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                    ACTIVE
                  </span>
                )}
              </div>
              <h3 className="font-display text-4xl font-bold tracking-tight">
                {activeScene ? activeScene.name : "No Active Scene"}
              </h3>
              {lastActivated && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Last activated at {lastActivated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scene Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SCENES.map((scene, idx) => {
            const isActive = activeSceneId === scene.id;
            const Icon = scene.icon;

            return (
              <div
                key={scene.id}
                onClick={() => handleActivate(scene)}
                className={`group relative glass rounded-[2rem] p-8 cursor-pointer transition-all duration-500 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-8 ${
                  isActive
                    ? `border-primary/50 shadow-2xl ${scene.glowColor} ring-1 ring-primary/20 bg-primary/5 pulse-primary`
                    : "hover:border-primary/30 hover:shadow-xl"
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`h-16 w-16 rounded-2xl bg-surface-elevated grid place-items-center group-hover:scale-110 transition-transform duration-500 ${isActive ? 'glow-primary' : ''}`}>
                    <Icon className={`h-8 w-8 ${scene.color}`} />
                  </div>
                  {isActive && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold glow-primary">
                      ACTIVE
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-display text-2xl font-bold tracking-tight mb-1">{scene.name}</h4>
                    <p className="text-muted-foreground text-sm">{scene.description}</p>
                  </div>

                  <div className="pt-4 border-t border-border/50 space-y-3">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Actions for {scene.devicesAffected} Devices
                    </div>
                    <ul className="space-y-2">
                      {scene.actions.map((action, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground/80">
                          <div className="h-1 w-1 rounded-full bg-primary/40" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground glow-primary"
                        : "glass-strong hover:bg-primary/10 hover:border-primary/30"
                    }`}
                  >
                    {isActive ? "Currently Active" : "Activate Scene"}
                    {!isActive && <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Coming Soon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="glass-strong rounded-[2rem] p-8 md:p-12 max-w-lg w-full relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 shadow-2xl border-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center mb-6 mx-auto">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>

            <div className="text-center space-y-4">
              <h3 className="font-display text-3xl font-bold tracking-tight">Coming Soon</h3>
              <p className="text-muted-foreground leading-relaxed">
                Custom Scenes will allow users to automate multiple devices with a single action.
                Our engineering team is perfecting the orchestration engine.
              </p>

              <div className="pt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Got it
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-6 w-6 rotate-45" />
            </button>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)} />
        </div>
      )}
    </AppShell>
  );
}
