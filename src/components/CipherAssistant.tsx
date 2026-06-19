import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Mic, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useDeviceStore } from "@/hooks/useDeviceStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { processUserCommand, CipherIntent } from "@/lib/gemini.service";
import { toast } from "sonner";

type CipherStatus = "idle" | "ready" | "listening" | "processing" | "speaking";

export function CipherAssistant() {
  const [status, setStatus] = useState<CipherStatus>("idle");
  const [showStatusCard, setShowStatusCard] = useState(false);
  const { cipherVolume, cipherSpeed, cipherVoiceId, cipherEnabled } = useSettingsStore();
  const [voiceMode, setVoiceMode] = useState(false);
  const voiceModeRef = useRef(false);

  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  const { speak, cancel: cancelSpeak, isSpeaking } = useSpeechSynthesis();
  const { devices, zones, setPowerState } = useDeviceStore();

  const handleCommandRef = useRef<(text: string) => Promise<void>>(async () => {});

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    continuous: true,
    onFinalTranscript: (text) => {
      handleCommandRef.current(text);
    },
  });

  const handleSpeak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!cipherEnabled) {
        onEnd?.();
        return;
      }
      setStatus("speaking");
      speak(text, {
        volume: cipherVolume,
        rate: cipherSpeed,
        voiceId: cipherVoiceId || undefined,
        onEnd: () => {
          onEnd?.();
        },
      });
    },
    [cipherEnabled, cipherVolume, cipherSpeed, cipherVoiceId, speak],
  );

  const endSession = useCallback(() => {
    setVoiceMode(false);
    stopListening();
    cancelSpeak();
    setStatus("idle");
    setShowStatusCard(false);
    toast.info("Voice session ended.");
  }, [stopListening, cancelSpeak]);

  const handleIntent = useCallback(
    (result: CipherIntent) => {
      let finalResponse = result.response;

      if (result.intent === "device_control" && result.device && result.action) {
        const targetZone = zones.find(
          (z) => z.name.toLowerCase() === result.zone?.toLowerCase(),
        );

        let targetDevice;
        if (targetZone) {
          targetDevice = devices.find(
            (d) =>
              d.zoneId === targetZone.id &&
              d.name.toLowerCase() === result.device?.toLowerCase(),
          );
        } else {
          const matchingDevices = devices.filter(
            (d) => d.name.toLowerCase() === result.device?.toLowerCase(),
          );
          if (matchingDevices.length === 1) {
            targetDevice = matchingDevices[0];
          } else if (matchingDevices.length > 1) {
            finalResponse = `I found multiple devices named ${result.device}. Which room?`;
          }
        }

        if (targetDevice) {
          const isComingSoon = ["AC", "Fan", "Inverter"].includes(targetDevice.type);
          if (isComingSoon) {
            finalResponse = `${targetDevice.type} control is coming soon.`;
          } else {
            setPowerState(targetDevice.id, result.action);
          }
        }
      }

      handleSpeak(finalResponse, () => {
        if (voiceModeRef.current) {
          setStatus("listening");
          setTimeout(() => {
            if (voiceModeRef.current) {
              try {
                startListening();
              } catch {
                /* noop */
              }
            }
          }, 300);
        } else {
          setStatus("idle");
        }
      });
    },
    [devices, zones, setPowerState, handleSpeak, startListening],
  );

  const handleCommand = useCallback(
    async (text: string) => {
      const trimmed = text.toLowerCase().trim();
      if (!trimmed) return;

      // Check for session exit commands
      const exitCommands = ["stop listening", "exit voice mode", "goodbye cipher", "goodbye"];
      if (exitCommands.some((cmd) => trimmed.includes(cmd))) {
        handleSpeak("Voice session ended.", () => {
          endSession();
        });
        return;
      }

      if (voiceModeRef.current) {
        stopListening();
      }

      setStatus("processing");

      try {
        const result = await processUserCommand(trimmed);
        handleIntent(result);
      } catch (error) {
        console.error("Command processing failed", error);
        handleSpeak("I encountered an error. Please try again.", () => {
          if (voiceModeRef.current) {
            setStatus("listening");
            setTimeout(() => {
              if (voiceModeRef.current) {
                try {
                  startListening();
                } catch {
                  /* noop */
                }
              }
            }, 300);
          } else {
            setStatus("idle");
          }
        });
      }
    },
    [handleIntent, handleSpeak, stopListening, startListening, endSession],
  );

  useEffect(() => {
    handleCommandRef.current = handleCommand;
  }, [handleCommand]);

  const toggleVoiceMode = () => {
    if (voiceMode) {
      endSession();
    } else {
      setVoiceMode(true);
      setShowStatusCard(true);
      setStatus("ready");
      handleSpeak("Listening.", () => {
        setStatus("listening");
        setTimeout(() => startListening(), 50);
      });
    }
  };

  // Sync status with listening/speaking state
  useEffect(() => {
    if (voiceMode) {
      if (isSpeaking) {
        setStatus("speaking");
      } else if (isListening) {
        setStatus("listening");
      }
    }
  }, [isSpeaking, isListening, voiceMode]);

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-4">
        {/* Floating AI Button */}
        <button
          onClick={toggleVoiceMode}
          disabled={!browserSupportsSpeechRecognition}
          className={cn(
            "h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl relative overflow-hidden group",
            voiceMode
              ? "bg-white/10 text-white border border-white/20"
              : "bg-primary text-primary-foreground glow-primary hover:scale-105",
          )}
        >
          {/* Visual Feedback Animations */}
          {voiceMode && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Soft pulse / Blue glow */}
              <div className={cn(
                "absolute inset-0 bg-primary/20 animate-pulse",
                status === "listening" && "opacity-100",
                status !== "listening" && "opacity-0"
              )} />

              {/* Audio wave ring */}
              {status === "listening" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full border-2 border-primary/40 rounded-2xl animate-ping" />
                </div>
              )}

              {/* Rotating intelligence animation */}
              {status === "processing" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
              )}
            </div>
          )}

          <div className="relative z-10">
            {status === "processing" ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : status === "listening" ? (
              <Mic className="h-6 w-6 text-primary animate-bounce" />
            ) : (
              <Sparkles className={cn("h-6 w-6", !voiceMode && "group-hover:animate-pulse")} />
            )}
          </div>

          {/* Speaking animation waves */}
          {status === "speaking" && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-0.5 bg-primary rounded-full animate-bounce"
                  style={{
                    height: `${Math.random() * 8 + 4}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </button>

        {/* Status Card */}
        {showStatusCard && (
          <div className="glass-strong p-4 rounded-2xl border border-white/10 shadow-2xl min-w-[180px] animate-in fade-in slide-in-from-left-4 duration-300 relative group">
            <button
              onClick={() => setShowStatusCard(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-sm text-white">Cipher AI</h3>
              <p className="text-[10px] uppercase tracking-widest text-primary/80">Voice Assistant</p>
              <div className="flex items-center gap-2 pt-2">
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  status === "listening" ? "bg-emerald-500 pulse-ring" :
                  status === "processing" ? "bg-amber-500 animate-pulse" :
                  status === "speaking" ? "bg-primary animate-pulse" : "bg-white/40"
                )} />
                <span className="text-[11px] font-medium text-white/90 capitalize">
                  Status: {status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Indicator */}
      {isListening && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] glass-strong px-4 py-1.5 rounded-full border border-primary/20 flex items-center gap-2 animate-in slide-in-from-top-4 duration-500">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
            🎙 Listening
          </span>
        </div>
      )}
    </>
  );
}
