import { useState, useEffect, useCallback, useRef } from "react";

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  onFinalTranscript?: (text: string) => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
}

interface SRResultAlt {
  transcript: string;
}
interface SRResult {
  0: SRResultAlt;
  isFinal: boolean;
}
interface SREvent {
  results: ArrayLike<SRResult> & Iterable<SRResult>;
  resultIndex: number;
}
interface SRErrorEvent {
  error: string;
}
interface SRInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SREvent) => void;
  onend: () => void;
  onerror: (event: SRErrorEvent) => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {},
): UseSpeechRecognitionReturn {
  const { continuous = false, onFinalTranscript } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SRInstance | null>(null);
  const finalTextRef = useRef("");
  const shouldKeepListeningRef = useRef(false);
  const callbackRef = useRef(onFinalTranscript);

  useEffect(() => {
    callbackRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    const GlobalWindow = window as unknown as {
      SpeechRecognition?: new () => SRInstance;
      webkitSpeechRecognition?: new () => SRInstance;
    };
    const Ctor = GlobalWindow.SpeechRecognition || GlobalWindow.webkitSpeechRecognition;
    if (!Ctor) return;

    const rec = new Ctor();
    rec.continuous = continuous;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      let interim = "";
      let finalChunk = "";
      for (let i = event.resultIndex; i < (event.results as unknown as { length: number }).length; i++) {
        const result = (event.results as unknown as SRResult[])[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalChunk += text;
        } else {
          interim += text;
        }
      }
      if (finalChunk) {
        finalTextRef.current = (finalTextRef.current + " " + finalChunk).trim();
      }
      setTranscript((finalTextRef.current + " " + interim).trim());
    };

    rec.onerror = (event) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("Speech recognition error", event.error);
      }
    };

    rec.onend = () => {
      const finalText = finalTextRef.current.trim();
      finalTextRef.current = "";
      if (finalText && callbackRef.current) {
        callbackRef.current(finalText);
      }
      if (shouldKeepListeningRef.current) {
        try {
          rec.start();
          setIsListening(true);
          return;
        } catch {
          /* ignore */
        }
      }
      setIsListening(false);
    };

    recognitionRef.current = rec;
    return () => {
      shouldKeepListeningRef.current = false;
      try {
        rec.abort();
      } catch {
        /* ignore */
      }
    };
  }, [continuous]);

  const startListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    finalTextRef.current = "";
    setTranscript("");
    shouldKeepListeningRef.current = continuous;
    try {
      rec.start();
      setIsListening(true);
    } catch (e) {
      console.error("Failed to start speech recognition", e);
    }
  }, [continuous]);

  const stopListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    shouldKeepListeningRef.current = false;
    try {
      rec.stop();
    } catch {
      /* ignore */
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
    browserSupportsSpeechRecognition: !!recognitionRef.current,
  };
}
