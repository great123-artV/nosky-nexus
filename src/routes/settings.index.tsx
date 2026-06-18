import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  User,
  Info,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/settings/")({
  head: () => ({ meta: [{ title: "Settings — Nosky HomeOS" }] }),
  component: SettingsHub,
});

const groups = [
  {
    title: "Account",
    items: [
      { to: "/settings/profile", icon: User, label: "Profile", desc: "Name, email, password" },
    ],
  },
  {
    title: "Nosky HomeOS",
    items: [
      { to: "/settings/about", icon: Info, label: "About", desc: "Version, features, company" },
      {
        to: "/settings/ai",
        icon: Sparkles,
        label: "AI Configuration",
        desc: "Gemini status & diagnostics",
      },
    ],
  },
  {
    title: "Legal",
    items: [
      {
        to: "/settings/privacy",
        icon: ShieldCheck,
        label: "Privacy Policy",
        desc: "How we handle your data",
      },
      {
        to: "/settings/terms",
        icon: FileText,
        label: "Terms of Service",
        desc: "Using Nosky HomeOS",
      },
      {
        to: "/settings/disclaimer",
        icon: AlertTriangle,
        label: "Disclaimer",
        desc: "Hardware & service notice",
      },
    ],
  },
] as const;

function SettingsHub() {
  const { profile } = useAuth();
  return (
    <AppShell title="Settings" subtitle="Personalize your Nosky HomeOS experience">
      <div className="max-w-3xl mx-auto space-y-6">
        {profile && (
          <Link
            to="/settings/profile"
            className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 transition-all group"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/80 to-primary/30 grid place-items-center font-display font-bold border border-border">
              {profile.full_name.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold truncate">{profile.full_name}</div>
              <div className="text-xs text-muted-foreground truncate">{profile.email}</div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        {groups.map((g) => (
          <div key={g.title} className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              {g.title}
            </div>
            <div className="divide-y divide-border">
              {g.items.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    className="px-5 py-4 flex items-center gap-4 hover:bg-accent/30 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary grid place-items-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{it.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{it.desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <p className="text-center text-[11px] text-muted-foreground/70 pt-4">
          Nosky HomeOS v1.0 · Powered by{" "}
          <span className="text-foreground font-medium">Nosky Tech</span>
        </p>
      </div>
    </AppShell>
  );
}
