import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Save, KeyRound, User as UserIcon, Mail, Calendar } from "lucide-react";

export const Route = createFileRoute("/settings/profile")({
  head: () => ({ meta: [{ title: "Profile — Nosky HomeOS" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setFullName(profile.full_name);
  }, [profile]);

  const saveProfile = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", user.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated");
      await refreshProfile();
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      setNewPassword("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/auth" });
  };

  return (
    <AppShell title="Profile" subtitle="Manage your Nosky HomeOS account">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="glass rounded-3xl p-8 flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/80 to-primary/30 grid place-items-center text-2xl font-display font-bold border border-border">
            {(profile?.full_name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-semibold truncate">
              {profile?.full_name || "Loading…"}
            </h2>
            <p className="text-sm text-muted-foreground truncate flex items-center gap-2 mt-1">
              <Mail className="h-3.5 w-3.5" /> {profile?.email}
            </p>
            <p className="text-xs text-muted-foreground/80 flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" /> Member since{" "}
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>

        <Card title="Edit Profile" icon={UserIcon}>
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              Full Name
            </span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="auth-input mt-1.5"
            />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              Email
            </span>
            <input value={profile?.email || ""} disabled className="auth-input mt-1.5 opacity-60" />
          </label>
          <button
            onClick={saveProfile}
            disabled={busy}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Save changes
          </button>
        </Card>

        <Card title="Change Password" icon={KeyRound}>
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              New Password
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="auth-input mt-1.5"
            />
          </label>
          <button
            onClick={changePassword}
            disabled={busy || newPassword.length < 6}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <KeyRound className="h-4 w-4" /> Update password
          </button>
        </Card>

        <button
          onClick={handleSignOut}
          className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl glass border border-destructive/30 text-destructive hover:bg-destructive/10 font-medium transition-all"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </AppShell>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary grid place-items-center">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-display font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
