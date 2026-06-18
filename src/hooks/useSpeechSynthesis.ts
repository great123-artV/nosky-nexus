import { useCallback } from "react";

export function useSpeechSynthesis() {
  const speak = useCallback(
    (text: string, options?: { volume?: number; rate?: number; voiceId?: string }) => {
      if (!window.speechSynthesis) {
        console.warn("Speech synthesis not supported in this browser.");
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();

      if (options?.voiceId) {
        const selectedVoice = voices.find((v) => v.voiceURI === options.voiceId);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      } else {
        // Try to find a premium English voice
        const preferredVoice =
          voices.find(
            (v) =>
              (v.name.includes("Google") ||
                v.name.includes("Enhanced") ||
                v.name.includes("Premium")) &&
              v.lang.startsWith("en"),
          ) || voices.find((v) => v.lang.startsWith("en"));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.pitch = 1.0;
      utterance.rate = options?.rate ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;

      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  return { speak };
}
