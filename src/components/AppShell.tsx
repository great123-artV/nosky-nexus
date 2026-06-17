import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Layout,
  Home,
  Cpu,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
  Search,
  Sun,
  Power,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/floor-plan", label: "Floor Plan", icon: Layout },
  { to: "/rooms", label: "Rooms", icon: Home },
  { to: "/devices", label: "Devices", icon: Cpu },
  { to: "/scenes", label: "Scenes", icon: Sparkles },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center glow-primary">
            <Power className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="font-display font-semibold text-sm tracking-tight truncate">
              Nosky HomeOS
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              v2.4 · Online
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_var(--color-border)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                <span>{item.label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary glow-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="h-2 w-2 rounded-full bg-success pulse-ring" />
              All systems normal
            </div>
            <div className="text-[11px] text-muted-foreground/80 leading-relaxed">
              Powered by <span className="text-foreground font-medium">Nosky Tech</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 shrink-0 border-b border-border bg-background/40 backdrop-blur-xl sticky top-0 z-30">
          <div className="h-full px-4 md:px-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="md:hidden h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center shrink-0">
                <Power className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-lg md:text-xl font-semibold truncate text-gradient">
                  {title}
                </h1>
                {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <div className="hidden lg:flex items-center gap-2 glass rounded-lg px-3 py-1.5 w-64">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  placeholder="Search devices, rooms…"
                  className="bg-transparent outline-none text-sm placeholder:text-muted-foreground/70 w-full"
                />
                <kbd className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                  ⌘K
                </kbd>
              </div>
              <button className="glass h-9 w-9 rounded-lg grid place-items-center hover:bg-accent transition-colors">
                <Sun className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="glass h-9 w-9 rounded-lg grid place-items-center hover:bg-accent transition-colors relative">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-primary/30 grid place-items-center text-xs font-semibold border border-border">
                NT
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 animate-fade-in">{children}</main>

        <footer className="px-4 md:px-8 py-4 text-[11px] text-muted-foreground/70 flex items-center justify-between border-t border-border/50">
          <span>Smart Living. Seamlessly Connected.</span>
          <span>© 2026 Nosky Tech</span>
        </footer>
      </div>
    </div>
  );
}
