// Guarded service-worker registration. Only registers in production browser
// contexts that are NOT Lovable preview / iframe / dev. In all other cases,
// it actively unregisters any existing /sw.js so stale workers can't linger.

export async function registerServiceWorker(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const host = window.location.hostname;
  const inIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  const isPreviewHost =
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" ||
    host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" ||
    host.endsWith(".beta.lovable.dev");

  const killSwitch = new URLSearchParams(window.location.search).get("sw") === "off";

  const shouldRegister = import.meta.env.PROD && !inIframe && !isPreviewHost && !killSwitch;

  if (!shouldRegister) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        regs
          .filter((r) => (r.active?.scriptURL || "").endsWith("/sw.js"))
          .map((r) => r.unregister()),
      );
    } catch {
      // ignore
    }
    return;
  }

  try {
    const { Workbox } = await import("workbox-window");
    const wb = new Workbox("/sw.js");
    wb.addEventListener("waiting", () => {
      wb.messageSkipWaiting();
    });
    wb.addEventListener("controlling", () => {
      // New SW took control — refresh once to load fresh assets.
      window.location.reload();
    });
    await wb.register();
  } catch (err) {
    console.warn("[PWA] Service worker registration failed", err);
  }
}
