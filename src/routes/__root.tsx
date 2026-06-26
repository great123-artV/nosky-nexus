import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SplashScreen } from "@/components/SplashScreen";
import { GlobalOverlays } from "@/components/GlobalOverlays";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useSettingsStore } from "@/hooks/useSettingsStore";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient font-display">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Signal lost</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That room isn't on the network. Let's get you home.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-primary"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center glass rounded-2xl p-8">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nosky HomeOS — Smart Living. Seamlessly Connected." },
      {
        name: "description",
        content:
          "Nosky HomeOS is a premium smart-home operating system by Nosky Tech — control zones, devices, energy and automations in one elegant interface.",
      },
      { name: "author", content: "Nosky Tech" },
      { name: "theme-color", content: "#0F172A" },
      { rel: "manifest", href: "/manifest.json" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "HomeOS" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },


      { property: "og:title", content: "Nosky HomeOS — Smart Living. Seamlessly Connected." },
      {
        property: "og:description",
        content: "Smart Living. Seamlessly Connected. Powered by Nosky Tech.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nosky HomeOS — Smart Living. Seamlessly Connected." },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f1e1666f-a3a2-44a4-9b08-055d8ede9829/id-preview-5c5ba5e1--f7fd0ad8-5cf6-4956-949b-22deaeea91c3.lovable.app-1781735595395.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f1e1666f-a3a2-44a4-9b08-055d8ede9829/id-preview-5c5ba5e1--f7fd0ad8-5cf6-4956-949b-22deaeea91c3.lovable.app-1781735595395.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const PUBLIC_PATHS = ["/auth", "/reset-password", "/legal/privacy", "/legal/terms"];

function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) navigate({ to: "/auth", replace: true });
  }, [user, loading, isPublic, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
          Connecting to Nosky HomeOS…
        </div>
      </div>
    );
  }
  if (!user && !isPublic) return null;
  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [showSplash, setShowSplash] = useState(true);
  const { setPwaInstallable, setIsPwaInstalled } = useSettingsStore();

  useEffect(() => {
    // Check if app is already installed/running in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setIsPwaInstalled(true);
    }

    // Guarded SW registration (production only, never in Lovable preview/dev)
    import("@/lib/registerSW").then((m) => m.registerServiceWorker());

    const handleBeforeInstallPrompt = (e: any) => {
      console.log("beforeinstallprompt fired");
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setPwaInstallable(true);
      setIsPwaInstalled(false);
    };

    const handleAppInstalled = () => {
      console.log("appinstalled fired");
      (window as any).deferredPrompt = null;
      setPwaInstallable(false);
      setIsPwaInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [setPwaInstallable, setIsPwaInstalled]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {showSplash ? (
          <SplashScreen onDone={() => setShowSplash(false)} />
        ) : (
          <>
            <GlobalOverlays />
            <AuthGate>
              <Outlet />
            </AuthGate>
          </>
        )}
        <Toaster theme="dark" position="top-right" richColors closeButton />
      </AuthProvider>
    </QueryClientProvider>
  );
}
