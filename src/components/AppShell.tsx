import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import {
  LayoutDashboard,
  Home,
  Settings,
  Search,
  Power,
  User,
  LogOut,
  X,
  LucideIcon,
  WifiOff,
  Download,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { CipherAssistant } from "./CipherAssistant";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/zones", label: "Zones", icon: Home },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

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
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();
  const { pwaDismissed, setPwaDismissed } = useSettingsStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If the event was already captured (e.g. in a global variable), use it
    const win = window as any;
    if (win.deferredPrompt) {
      setDeferredPrompt(win.deferredPrompt);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (deferredPrompt && user && !pwaDismissed && !showInstallBanner && pathname === "/") {
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 5000); // Reduced delay for better discoverability
      return () => clearTimeout(timer);
    }
  }, [deferredPrompt, user, pwaDismissed, showInstallBanner, pathname]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    setPwaDismissed(true);
  };

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "NT";

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = nav.find((n) => n.label.toLowerCase().includes(q));
    if (match) {
      navigate({ to: match.to });
      setSearchOpen(false);
      setQuery("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen flex w-full flex-col">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-destructive text-destructive-foreground py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 z-[100]">
          <WifiOff className="h-3 w-3" />⚠ Offline Mode — Some features may be unavailable.
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-80 glass-strong rounded-2xl p-4 shadow-2xl border border-primary/20 z-[60] animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-bold text-sm">Install Nosky HomeOS</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Experience smart living as a native app on your device.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors glow-primary"
                >
                  Install App
                </button>
                <button
                  onClick={handleDismissInstall}
                  className="px-3 py-2 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 w-full overflow-hidden">
        <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl">
          <Link
            to="/"
            className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border hover:bg-sidebar-accent/30 transition-colors"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center glow-primary">
              <Power className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="font-display font-semibold text-sm tracking-tight truncate">
                Nosky HomeOS
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                v1.0 · Online
              </div>
            </div>
          </Link>

          <nav className="flex-1 p-3 space-y-1">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon: LucideIcon = item.icon;
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

        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <header className="h-16 shrink-0 border-b border-border bg-background/40 backdrop-blur-xl sticky top-0 z-30">
            <div className="h-full px-4 md:px-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  to="/"
                  className="md:hidden h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center shrink-0"
                  aria-label="Home"
                >
                  <Power className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
                </Link>
                <div className="min-w-0">
                  <h1 className="font-display text-lg md:text-xl font-semibold truncate text-gradient">
                    {title}
                  </h1>
                  {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <form
                  onSubmit={runSearch}
                  className="hidden lg:flex items-center gap-2 glass rounded-lg px-3 py-1.5 w-64 focus-within:border-primary/40"
                >
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search pages…"
                    className="bg-transparent outline-none text-sm placeholder:text-muted-foreground/70 w-full"
                  />
                  <kbd className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                    ↵
                  </kbd>
                </form>

                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="lg:hidden glass h-9 w-9 rounded-lg grid place-items-center hover:bg-accent transition-colors"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>

                <Link
                  to="/settings"
                  aria-label="Settings"
                  className="glass h-9 w-9 rounded-lg grid place-items-center hover:bg-accent transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-label="Open profile menu"
                    className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-primary/30 grid place-items-center text-xs font-semibold border border-border hover:scale-105 transition-transform"
                  >
                    {initials}
                  </button>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-11 z-50 w-60 glass rounded-2xl p-2 shadow-xl border border-border animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-3 py-3 border-b border-border">
                          <div className="font-display font-semibold text-sm truncate">
                            {profile?.full_name || "Guest"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {profile?.email || ""}
                          </div>
                        </div>
                        <Link
                          to="/settings/profile"
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent/50"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          View Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent/50"
                        >
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/15 text-destructive"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Mobile bottom nav */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/80 backdrop-blur-xl">
            <div className="grid grid-cols-3">
              {nav.map((item) => {
                const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                const Icon: LucideIcon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex flex-col items-center gap-1 py-2 text-[10px] ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 animate-fade-in">{children}</main>

          <footer className="px-4 md:px-8 py-4 text-[11px] text-muted-foreground/70 flex items-center justify-between border-t border-border/50">
            <span>Smart Living. Seamlessly Connected.</span>
            <span>© 2026 Nosky Tech</span>
          </footer>

          <CipherAssistant />
        </div>
      </div>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm grid place-items-start pt-24 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <form
            onSubmit={runSearch}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass rounded-2xl p-2 flex items-center gap-2"
          >
            <Search className="h-4 w-4 text-muted-foreground ml-2" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages…"
              className="bg-transparent outline-none text-sm w-full py-2"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="h-8 w-8 grid place-items-center text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
