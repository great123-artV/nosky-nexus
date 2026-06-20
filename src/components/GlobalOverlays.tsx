import { useState, useEffect } from "react";
import { Download, WifiOff } from "lucide-react";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useAuth } from "@/hooks/useAuth";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function GlobalOverlays() {
  const { user } = useAuth();
  const { pwaDismissed, setPwaDismissed, isPwaInstalled, setPwaInstallable } = useSettingsStore();

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

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // If the event was already captured globally
    const win = window as any;
    if (win.deferredPrompt) {
      setDeferredPrompt(win.deferredPrompt);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    if (deferredPrompt && !pwaDismissed && !showInstallBanner && !isPwaInstalled) {
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [user, deferredPrompt, pwaDismissed, showInstallBanner, isPwaInstalled]);


  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      setPwaInstallable(false);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    setPwaDismissed(true);
  };

  return (
    <>
      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed top-0 inset-x-0 bg-destructive text-destructive-foreground py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 z-[200]">
          <WifiOff className="h-3 w-3" />⚠ Offline Mode — Some features may be unavailable.
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-80 glass-strong rounded-2xl p-4 shadow-2xl border border-primary/20 z-[200] animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-bold text-sm text-foreground">Install Nosky HomeOS</h4>
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
                  className="px-3 py-2 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors text-foreground"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
