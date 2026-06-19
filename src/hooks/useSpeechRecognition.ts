import { useState, useEffect, useCallback, useRef } from "react";

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  onFinalTranscript?: (text: string) => void;
  lang?: string;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {},
): UseSpeechRecognitionReturn {
  const { continuous = false, onFinalTranscript, lang = "en-US" } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any | null>(null);
  const finalTextRef = useRef("");
  const shouldKeepListeningRef = useRef(false);
  const callbackRef = useRef(onFinalTranscript);

  useEffect(() => {
    callbackRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    const GlobalWindow = window as any;
    const SpeechRecognition = GlobalWindow.SpeechRecognition || GlobalWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalChunk += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalChunk) {
        finalTextRef.current = (finalTextRef.current + " " + finalChunk).trim();

        // If in continuous mode, we might want to emit chunks early?
        // No, usually in continuous mode we wait for a pause.
        // But for "unobstructed" feel, we want it to respond as soon as a thought is finished.
      }

      setTranscript((finalTextRef.current + " " + interimTranscript).trim());
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        console.error("Speech recognition permission denied");
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      const finalText = finalTextRef.current.trim();

      if (finalText && callbackRef.current) {
        callbackRef.current(finalText);
      }

      finalTextRef.current = "";

      if (shouldKeepListeningRef.current) {
        try {
          recognition.start();
          setIsListening(true);
        } catch (e) {
          console.error("Failed to restart speech recognition:", e);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldKeepListeningRef.current = false;
      try {
        recognition.abort();
      } catch (e) {
        // ignore
      }
    };
  }, [continuous, lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    finalTextRef.current = "";
    setTranscript("");
    shouldKeepListeningRef.current = continuous;

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      // If already started, this might throw, we can ignore
      console.warn("Recognition already started or failed to start:", e);
    }
  }, [continuous]);

  const stopListening = useCallback(() => {
    shouldKeepListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    finalTextRef.current = "";
    setTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition: !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition,
  };
}
