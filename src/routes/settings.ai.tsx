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
  Cpu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { isGeminiConfigured, testGeminiConnection } from "@/lib/gemini.service";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Volume2,
  Gauge,
  UserRound,
  MessageSquareText,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export const Route = createFileRoute("/settings/ai")({
  head: () => ({ meta: [{ title: "AI Configuration — Nosky HomeOS" }] }),
  component: AIConfiguration,
});

function AIConfiguration() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const {
    cipherEnabled,
    cipherVoiceGreeting,
    cipherVolume,
    cipherSpeed,
    cipherVoiceId,
    setCipherEnabled,
    setCipherVoiceGreeting,
    setCipherVolume,
    setCipherSpeed,
    setCipherVoiceId,
  } = useSettingsStore();

  const configured = isGeminiConfigured();

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

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
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        {/* Voice & Greeting Settings */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-primary" />
              Voice & Interaction
            </h3>
            <button
              onClick={() => setCipherEnabled(!cipherEnabled)}
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                cipherEnabled ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground",
              )}
            >
              {cipherEnabled ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
              {cipherEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Toggle Greeting */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Automatic Voice Greeting</label>
                <p className="text-xs text-muted-foreground">
                  Cipher will greet you when you enter the dashboard.
                </p>
              </div>
              <button
                onClick={() => setCipherVoiceGreeting(!cipherVoiceGreeting)}
                className={cn(
                  "h-6 w-11 rounded-full transition-colors relative",
                  cipherVoiceGreeting ? "bg-primary" : "bg-white/10",
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform",
                    cipherVoiceGreeting ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>

            {/* Volume */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Voice Volume</label>
                </div>
                <span className="text-xs font-mono text-primary">
                  {Math.round(cipherVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={cipherVolume}
                onChange={(e) => setCipherVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Speed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Voice Speed</label>
                </div>
                <span className="text-xs font-mono text-primary">{cipherSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={cipherSpeed}
                onChange={(e) => setCipherSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Voice Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Voice Selection</label>
              </div>
              <select
                value={cipherVoiceId || ""}
                onChange={(e) => setCipherVoiceId(e.target.value || null)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors appearance-none"
              >
                <option value="" className="bg-slate-900">
                  System Default
                </option>
                {availableVoices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI} className="bg-slate-900">
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="glass rounded-2xl p-6 flex items-start gap-4">
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
              configured
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-destructive/10 text-destructive",
            )}
          >
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
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  configured
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-destructive/20 text-destructive",
                )}
              >
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
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    configured ? "bg-emerald-500" : "bg-destructive",
                  )}
                />
                <span className="text-sm font-medium">Loaded: {configured ? "YES" : "NO"}</span>
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
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Assistant Name
              </div>
              <div className="font-display font-bold">Cipher AI</div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Provider
              </div>
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
                  : "bg-primary text-primary-foreground hover:scale-105 active:scale-95 glow-primary",
              )}
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Test Connection
            </button>
          </div>

          {testResult && (
            <div
              className={cn(
                "p-4 rounded-xl border animate-in fade-in slide-in-from-top-2",
                testResult.success
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                  : "bg-destructive/5 border-destructive/20 text-destructive",
              )}
            >
              <div className="flex items-center gap-2 font-medium text-sm">
                {testResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {testResult.success ? "✓ Gemini Connected" : "✗ Connection Failed"}
              </div>
              <p className="mt-1 text-xs opacity-70 ml-6">{testResult.message}</p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-3 px-2 text-muted-foreground/60">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <p className="text-[10px] leading-relaxed uppercase tracking-wider font-medium">
            Your API key is stored securely in your environment variables and is never exposed in
            the client-side diagnostic tools.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
