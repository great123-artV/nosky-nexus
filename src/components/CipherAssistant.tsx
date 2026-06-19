import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, X, Send, Volume2, Sparkles, Loader2, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useDeviceStore } from "@/hooks/useDeviceStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { processUserCommand, CipherIntent } from "@/lib/gemini.service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function CipherAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { cipherVolume, cipherSpeed, cipherVoiceId, cipherEnabled } = useSettingsStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const voiceModeRef = useRef(false);
  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  const { speak, cancel: cancelSpeak } = useSpeechSynthesis();
  const { devices, zones, setPowerState } = useDeviceStore();

  // Forward ref for handleCommand so the speech callback can call it.
  const handleCommandRef = useRef<(text: string) => Promise<void>>(async () => {});

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    continuous: voiceMode,
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
      speak(text, {
        volume: cipherVolume,
        rate: cipherSpeed,
        voiceId: cipherVoiceId || undefined,
        onEnd,
      });
    },
    [cipherEnabled, cipherVolume, cipherSpeed, cipherVoiceId, speak],
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  


  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("cipher-chat-history");
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("cipher-chat-history", JSON.stringify(messages.slice(-20)));
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

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
            finalResponse = `I found multiple devices named ${result.device}. Which room — Parlor, Master Bedroom, Children's Room, or Store Room?`;
          }
        }

        if (targetDevice) {
          const isComingSoon = ["AC", "Fan", "Inverter"].includes(targetDevice.type);
          if (isComingSoon) {
            finalResponse = `${targetDevice.type} control is coming soon to Nosky HomeOS.`;
          } else {
            setPowerState(targetDevice.id, result.action);
            toast.success(finalResponse);
          }
        } else if (!finalResponse.includes("Which room")) {
          finalResponse = `I couldn't find ${result.device}${result.zone ? ` in the ${result.zone}` : ""}. Please specify the room and device.`;
        }
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: finalResponse,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      handleSpeak(finalResponse, () => {
        // In voice mode, resume listening after Cipher finishes speaking.
        if (voiceModeRef.current) {
          // Small delay so the mic doesn't catch the tail of the TTS audio.
          setTimeout(() => {
            if (voiceModeRef.current) {
              try {
                startListening();
              } catch {
                /* noop */
              }
            }
          }, 250);
        }
      });
    },
    [devices, zones, setPowerState, handleSpeak, startListening],
  );

  const handleCommand = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMessage: Message = {
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const result = await processUserCommand(trimmed);
        handleIntent(result);
      } catch (error) {
        console.error("Command processing failed", error);
        const errorMessage: Message = {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        handleSpeak(errorMessage.content);
      } finally {
        setIsLoading(false);
      }
    },
    [handleIntent, handleSpeak],
  );

  useEffect(() => {
    handleCommandRef.current = handleCommand;
  }, [handleCommand]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleVoiceMode = () => {
    if (voiceMode) {
      setVoiceMode(false);
      stopListening();
      cancelSpeak();
    } else {
      setVoiceMode(true);
      // Start listening on next tick so the continuous flag is applied.
      setTimeout(() => startListening(), 50);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputValue);
  };



  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Assistant Panel */}
      {isOpen && (
        <div className="w-[350px] md:w-[400px] h-[500px] glass-strong rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center glow-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                  Cipher AI
                  {voiceMode && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                      Live
                    </span>
                  )}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-primary/80">
                  HomeOS Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleVoiceMode}
                disabled={!browserSupportsSpeechRecognition}
                title={voiceMode ? "End voice conversation" : "Start voice conversation"}
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30",
                  voiceMode
                    ? "bg-emerald-500/20 text-emerald-300 animate-pulse"
                    : "hover:bg-white/10 text-muted-foreground",
                )}
              >
                <Radio className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>



          {/* Chat Content */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="py-8 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/5 mx-auto flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary/40" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">Hello, I'm Cipher</p>
                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                      Try saying "Turn on the parlor lights" or "Switch off the TV socket"
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[85%] space-y-1 animate-in fade-in slide-in-from-bottom-2",
                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start",
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "glass text-white rounded-tl-none border-white/5",
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-muted-foreground/50 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex mr-auto items-start animate-in fade-in">
                  <div className="glass px-4 py-2.5 rounded-2xl rounded-tl-none border-white/5 flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground tracking-tight">
                      Cipher is thinking...
                    </span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Voice Feedback */}
          {isListening && (
            <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center gap-3 animate-pulse">
              <div className="flex gap-0.5 items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-0.5 bg-primary rounded-full animate-bounce",
                      i % 2 === 0 ? "h-3" : "h-2",
                    )}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <p className="text-xs text-primary font-medium truncate">
                {transcript || "Listening..."}
              </p>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/5">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex-1 glass rounded-xl px-3 py-1.5 flex items-center gap-2 transition-colors focus-within:border-primary/40",
                )}
              >
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Cipher..."
                  className="bg-transparent outline-none text-sm w-full py-1 text-white placeholder:text-muted-foreground/50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                />
                {inputValue.trim() ? (
                  <button
                    type="submit"
                    className="text-primary hover:scale-110 transition-transform"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                ) : (
                  <Volume2 className="h-4 w-4 text-muted-foreground/40" />
                )}
              </div>

              <button
                type="button"
                onClick={handleMicClick}
                disabled={!browserSupportsSpeechRecognition || isLoading}
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                  isListening
                    ? "bg-destructive text-destructive-foreground animate-pulse"
                    : "bg-primary text-primary-foreground glow-primary hover:scale-105",
                )}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 px-6 rounded-2xl flex items-center gap-3 font-display font-bold text-sm tracking-tight transition-all duration-300 shadow-2xl group",
          isOpen
            ? "bg-white/10 text-white border border-white/20"
            : "bg-primary text-primary-foreground glow-primary hover:scale-105",
        )}
      >
        <div className="relative">
          <Sparkles className={cn("h-5 w-5", !isOpen && "group-hover:animate-pulse")} />
          {!isOpen && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-white rounded-full pulse-ring" />
          )}
        </div>
        Cipher AI
      </button>
    </div>
  );
}
