import { processCipherCommand, pingCipher } from "./cipher.functions";

export interface CipherIntent {
  intent: "device_control" | "coming_soon" | "answer" | "ambiguous" | "unknown";
  zone?: string;
  device?: string;
  action?: "on" | "off";
  response: string;
}

export async function processUserCommand(command: string): Promise<CipherIntent> {
  try {
    const result = (await processCipherCommand({ data: { command } })) as CipherIntent;
    if (!result || typeof result.response !== "string") {
      return { intent: "unknown", response: "I didn't catch that. Could you say it again?" };
    }
    return result;
  } catch (error) {
    console.error("Cipher AI error:", error);
    return {
      intent: "unknown",
      response: "I ran into a problem reaching the AI service. Please try again.",
    };
  }
}

export async function testGeminiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await pingCipher();
    if (res.configured) return { success: true, message: "Cipher AI Connected" };
    return { success: false, message: "LOVABLE_API_KEY missing on server." };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Connection failed" };
  }
}

export function isGeminiConfigured(): boolean {
  // AI is provided by the Lovable AI Gateway server-side. Always available client-side.
  return true;
}
