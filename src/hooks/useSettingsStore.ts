import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  cipherEnabled: boolean;
  cipherVoiceGreeting: boolean;
  cipherVolume: number;
  cipherSpeed: number;
  cipherVoiceId: string | null;
  pwaDismissed: boolean;
  pwaInstallable: boolean;

  setCipherEnabled: (enabled: boolean) => void;
  setCipherVoiceGreeting: (enabled: boolean) => void;
  setCipherVolume: (volume: number) => void;
  setCipherSpeed: (speed: number) => void;
  setCipherVoiceId: (voiceId: string | null) => void;
  setPwaDismissed: (dismissed: boolean) => void;
  setPwaInstallable: (installable: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      cipherEnabled: true,
      cipherVoiceGreeting: true,
      cipherVolume: 1,
      cipherSpeed: 1,
      cipherVoiceId: null,
      pwaDismissed: false,
      pwaInstallable: false,

      setCipherEnabled: (cipherEnabled) => set({ cipherEnabled }),
      setCipherVoiceGreeting: (cipherVoiceGreeting) => set({ cipherVoiceGreeting }),
      setCipherVolume: (cipherVolume) => set({ cipherVolume }),
      setCipherSpeed: (cipherSpeed) => set({ cipherSpeed }),
      setCipherVoiceId: (cipherVoiceId) => set({ cipherVoiceId }),
      setPwaDismissed: (pwaDismissed) => set({ pwaDismissed }),
      setPwaInstallable: (pwaInstallable) => set({ pwaInstallable }),
    }),
    {
      name: "nosky-settings-storage",
    },
  ),
);
