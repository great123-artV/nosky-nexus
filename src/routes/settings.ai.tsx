import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Terminal,
  Play,
  Loader2,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { useState } from "react";
import { isGeminiConfigured, testGeminiConnection } from "@/lib/gemini.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/ai")({
  head: () => ({ meta: [{ title: "AI Configuration — Nosky HomeOS" }] }),
  component: AIConfiguration,
});

function AIConfiguration() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const configured = isGeminiConfigured();

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testGeminiConnection();
      setTestResult(result);
      if (result.success) {
        toast.success("Gemini Connected Successfully");
      } else {
        toast.error(`Connection Failed: ${result.message}`);
      }
    } catch (error) {
      setTestResult({ success: false, message: "An unexpected error occurred." });
      toast.error("An unexpected error occurred during testing.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <AppShell title="AI Configuration" subtitle="Manage your Cipher AI assistant settings">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Status Overview */}
        <div className="glass rounded-2xl p-6 flex items-start gap-4">
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
            configured ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
          )}>
            {configured ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-lg">Gemini Status</h3>
            <p className="text-sm text-muted-foreground">
              {configured
                ? "Your Gemini AI service is configured and ready to use."
                : "Gemini AI is not configured. Please check your environment variables."}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                configured ? "bg-emerald-500/20 text-emerald-400" : "bg-destructive/20 text-destructive"
              )}>
                {configured ? "Connected" : "Not Configured"}
              </span>
            </div>
          </div>
        </div>

        {/* Configuration Details */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-white/5">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              Environment Configuration
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Environment Variable
              </label>
              <div className="bg-black/40 rounded-lg p-3 font-mono text-sm border border-white/5 text-white/70">
                VITE_GEMINI_API_KEY
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Status
              </label>
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", configured ? "bg-emerald-500" : "bg-destructive")} />
                <span className="text-sm font-medium">
                  Loaded: {configured ? "YES" : "NO"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assistant Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Assistant Name</div>
              <div className="font-display font-bold">Cipher AI</div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Provider</div>
              <div className="font-display font-bold">Google Gemini</div>
            </div>
          </div>
        </div>

        {/* Diagnostic Action */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Diagnostic System</h3>
              <p className="text-xs text-muted-foreground">Verify the connection to Gemini AI</p>
            </div>
            <button
              onClick={handleTestConnection}
              disabled={!configured || isTesting}
              className={cn(
                "px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all",
                !configured || isTesting
                  ? "bg-white/5 text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:scale-105 active:scale-95 glow-primary"
              )}
            >
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Test Connection
            </button>
          </div>

          {testResult && (
            <div className={cn(
              "p-4 rounded-xl border animate-in fade-in slide-in-from-top-2",
              testResult.success
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                : "bg-destructive/5 border-destructive/20 text-destructive"
            )}>
              <div className="flex items-center gap-2 font-medium text-sm">
                {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {testResult.success ? "✓ Gemini Connected" : "✗ Connection Failed"}
              </div>
              <p className="mt-1 text-xs opacity-70 ml-6">
                {testResult.message}
              </p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-3 px-2 text-muted-foreground/60">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <p className="text-[10px] leading-relaxed uppercase tracking-wider font-medium">
            Your API key is stored securely in your environment variables and is never exposed in the client-side diagnostic tools.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
