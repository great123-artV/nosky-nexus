import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Power, Loader2, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn, getPasswordStrength } from "@/lib/utils";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — Nosky HomeOS" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  // Supabase puts a recovery token in the URL hash. The client picks it up via
  // detectSessionInUrl. We just wait until a session exists.
  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.data.subscription.unsubscribe();
  }, []);

  const strength = getPasswordStrength(password);
  const valid = strength !== "invalid" && password === confirm;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated. You're signed in.");
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center glow-primary mb-4">
            <Power className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-gradient">Set a new password</h1>
          <p className="text-xs text-muted-foreground mt-1">Choose a strong password for your account.</p>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8">
          {!ready ? (
            <div className="flex flex-col items-center gap-3 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifying recovery link…
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                  New Password
                </span>
                <div className="relative mt-1.5">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input pr-10"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        strength === "invalid"
                          ? "text-destructive"
                          : strength === "weak"
                            ? "text-red-500"
                            : strength === "medium"
                              ? "text-orange-500"
                              : strength === "strong"
                                ? "text-emerald-500"
                                : "text-primary",
                      )}
                    >
                      {strength === "invalid" ? "Too short" : strength}
                    </span>
                    {strength === "excellent" && <ShieldCheck className="h-3 w-3 text-primary" />}
                  </div>
                )}
              </label>

              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Confirm Password
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="auth-input mt-1.5"
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
                {confirm.length > 0 && password !== confirm && (
                  <p className="text-xs text-destructive mt-1">Passwords don't match</p>
                )}
              </label>

              <button
                type="submit"
                disabled={!valid || busy}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 glow-primary"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                Update password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
