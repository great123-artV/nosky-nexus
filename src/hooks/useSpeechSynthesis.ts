import { useCallback } from "react";

export function useSpeechSynthesis() {
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Optional: refine the voice settings for a more premium feel
    const voices = window.speechSynthesis.getVoices();
    // Try to find a premium English voice
    const preferredVoice = voices.find(v =>
      (v.name.includes("Google") || v.name.includes("Enhanced") || v.name.includes("Premium")) &&
      v.lang.startsWith("en")
    ) || voices.find(v => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.pitch = 1.0;
    utterance.rate = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}
