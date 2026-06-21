import { useState, useEffect } from "react";
import { Home, WifiOff, Share, Plus, X, Check } from "lucide-react";
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

function detectIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isIPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && "ontouchend" in document);
  return /iPhone|iPod/.test(ua) || isIPad;
}

function isInStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export function GlobalOverlays() {
  const { user } = useAuth();
  const { pwaDismissed, setPwaDismissed, isPwaInstalled, setPwaInstallable, setIsPwaInstalled } =
    useSettingsStore();

  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    setIsIos(detectIOS());
    if (isInStandaloneMode()) setIsPwaInstalled(true);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPwaInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      setIsPwaInstalled(true);
      setShowInstalledSuccess(true);
      setTimeout(() => setShowInstalledSuccess(false), 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    const win = window as any;
    if (win.deferredPrompt) setDeferredPrompt(win.deferredPrompt);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [setPwaInstallable, setIsPwaInstalled]);

  // Show install banner ~10s after sign-in when the app is installable
  useEffect(() => {
    if (!user || pwaDismissed || isPwaInstalled || isInStandaloneMode()) return;
    const installable = !!deferredPrompt || isIos;
    if (!installable) return;
    const timer = setTimeout(() => setShowInstallBanner(true), 10000);
    return () => clearTimeout(timer);
  }, [user, deferredPrompt, isIos, pwaDismissed, isPwaInstalled]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
          setShowInstallBanner(false);
          setPwaInstallable(false);
        }
      } catch (err) {
        console.error("Install prompt failed", err);
      }
      return;
    }
    if (isIos) {
      setShowIosInstructions(true);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    setPwaDismissed(true);
  };

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 inset-x-0 bg-destructive text-destructive-foreground py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 z-[200]">
          <WifiOff className="h-3 w-3" />⚠ Offline Mode — Some features may be unavailable.
        </div>
      )}

      {showInstallBanner && !showIosInstructions && (
        <div className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-80 glass-strong rounded-2xl p-4 shadow-2xl border border-primary/20 z-[200] animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-bold text-sm text-foreground">
                Install Nosky HomeOS
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                For a faster and better smart-home experience, install the app.
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
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showIosInstructions && (
        <div
          className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm grid place-items-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowIosInstructions(false)}
        >
          <div
            className="glass-strong rounded-3xl p-6 max-w-sm w-full border border-primary/20 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIosInstructions(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-white p-1 rounded-lg hover:bg-white/5"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-foreground">
                  Install on iPhone
                </h4>
                <p className="text-[10px] uppercase tracking-widest text-primary/80">
                  Add to Home Screen
                </p>
              </div>
            </div>
            <ol className="space-y-3 text-sm text-foreground">
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-white/5 text-xs flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <span className="flex-1 flex items-center gap-2">
                  Tap the <Share className="h-4 w-4 inline text-primary" /> Share button in Safari.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-white/5 text-xs flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <span className="flex-1 flex items-center gap-2">
                  Scroll and tap <Plus className="h-4 w-4 inline text-primary" />{" "}
                  <strong>Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-white/5 text-xs flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <span className="flex-1">
                  Tap <strong>Add</strong> in the top-right corner.
                </span>
              </li>
            </ol>
            <button
              onClick={() => {
                setShowIosInstructions(false);
                handleDismissInstall();
              }}
              className="mt-5 w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors glow-primary"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
