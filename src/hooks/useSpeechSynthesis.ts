import { useCallback } from "react";

interface SpeakOptions {
  volume?: number;
  rate?: number;
  voiceId?: string;
  onEnd?: () => void;
}

export function useSpeechSynthesis() {
  const speak = useCallback((text: string, options?: SpeakOptions) => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser.");
      options?.onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (options?.voiceId) {
      const selectedVoice = voices.find((v) => v.voiceURI === options.voiceId);
      if (selectedVoice) utterance.voice = selectedVoice;
    } else {
      const preferredVoice =
        voices.find(
          (v) =>
            (v.name.includes("Google") ||
              v.name.includes("Enhanced") ||
              v.name.includes("Premium")) &&
            v.lang.startsWith("en"),
        ) || voices.find((v) => v.lang.startsWith("en"));
      if (preferredVoice) utterance.voice = preferredVoice;
    }

    utterance.pitch = 1.0;
    utterance.rate = options?.rate ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;
    if (options?.onEnd) {
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = () => options.onEnd?.();
    }
    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  return { speak, cancel };
}
