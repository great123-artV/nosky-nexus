import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Power, Loader2, Eye, EyeOff, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { getPasswordStrength, cn } from "@/lib/utils";

const SITE_URL =
  import.meta.env.MODE === "production"
    ? "https://noskyhomeos.vercel.app"
    : window.location.origin;

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Nosky HomeOS" },
      { name: "description", content: "Access your Nosky HomeOS smart home." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.08),transparent_50%)]" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center glow-primary mb-4">
            <Power className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-gradient">Nosky HomeOS</h1>
          <p className="text-xs text-muted-foreground mt-1">Smart Living. Seamlessly Connected.</p>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="flex gap-1 p-1 bg-surface/40 rounded-xl mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === m
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <GoogleButton mode={mode} />
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {mode === "signin" ? <SignInForm /> : <SignUpForm />}
        </div>

        <p className="text-center text-[11px] text-muted-foreground/70 mt-6">
          Powered by <span className="text-foreground font-medium">Nosky Tech</span>
        </p>
      </div>
    </div>
  );
}

function GoogleButton({ mode }: { mode: "signin" | "signup" }) {
  const [busy, setBusy] = useState(false);
  const onClick = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: SITE_URL,
    });
    if (result.error) {
      setBusy(false);
      toast.error(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    // Session established
    toast.success("Welcome");
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="w-full h-11 rounded-xl glass border border-border hover:bg-accent/60 transition-all flex items-center justify-center gap-3 text-sm font-medium disabled:opacity-50"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c6.9 0 9.5-4.8 9.5-7.3 0-.5 0-.9-.1-1.3H12z" />
        </svg>
      )}
      {mode === "signup" ? "Sign up with Google" : "Continue with Google"}
    </button>
  );
}

function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back");
      navigate({ to: "/" });
    }
  };

  const forgotPassword = async () => {
    if (!email.includes("@")) {
      toast.error("Enter your email above first");
      return;
    }
    setResetBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/reset-password`,
    });
    setResetBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Reset link sent. Check your email.");
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Password">
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input pr-10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>
      <div className="flex justify-end -mt-2">
        <button
          type="button"
          onClick={forgotPassword}
          disabled={resetBusy}
          className="text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
        >
          {resetBusy && <Loader2 className="h-3 w-3 animate-spin" />}
          Forgot password?
        </button>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow-primary"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign In
      </button>
    </form>
  );
}

function SignUpForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);

  const strength = getPasswordStrength(password);
  const isPasswordValid = strength !== "invalid";
  const passwordsMatch = isPasswordValid && password === confirm;

  const canSubmit =
    fullName.trim().length > 1 && email.includes("@") && passwordsMatch && accepted && !busy;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${SITE_URL}/`,
        data: {
          full_name: fullName.trim(),
          accepted_terms: true,
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created. Welcome to Nosky HomeOS.");
      navigate({ to: "/" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Full Name">
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="auth-input"
          placeholder="Emmanuel Adeyemi"
          autoComplete="name"
        />
      </Field>
      <Field label="Email Address">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Field>
      <Field label="Password">
        <div className="relative">
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
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {password.length > 0 && (
          <div className="mt-2 space-y-1.5">
            <div className="flex gap-1 h-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-full transition-all duration-500",
                    i === 1 && strength !== "invalid"
                      ? "bg-red-500"
                      : i === 2 &&
                          (strength === "medium" ||
                            strength === "strong" ||
                            strength === "excellent")
                        ? "bg-orange-500"
                        : i === 3 && (strength === "strong" || strength === "excellent")
                          ? "bg-emerald-500"
                          : i === 4 && strength === "excellent"
                            ? "bg-primary glow-primary"
                            : "bg-white/10",
                  )}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
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
                {strength === "invalid" ? "Too Short" : strength}
              </span>
              {strength === "excellent" && <ShieldCheck className="h-3 w-3 text-primary" />}
            </div>
          </div>
        )}
        {password.length > 0 && password.length < 8 && (
          <p className="text-xs text-destructive mt-1">
            Password must be at least 8 characters long.
          </p>
        )}
      </Field>

      <Field label="Confirm Password">
        <div className="relative">
          <input
            type={showConfirmPw ? "text" : "password"}
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="auth-input pr-10"
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPw((v) => !v)}
            aria-label={showConfirmPw ? "Hide confirm password" : "Show confirm password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {confirm.length > 0 && !passwordsMatch && (
          <p className="text-xs text-destructive mt-1">
            {password.length < 8 ? "Password too short" : "Passwords don't match"}
          </p>
        )}
      </Field>

      <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span>
          I agree to the Nosky HomeOS{" "}
          <Link to="/legal/privacy" className="text-primary hover:underline" target="_blank">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/legal/terms" className="text-primary hover:underline" target="_blank">
            Terms
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow-primary"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Create Account
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
