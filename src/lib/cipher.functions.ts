import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { emergencyContacts } from "./emergencyContacts";

const SYSTEM_PROMPT = `You are Cipher AI, the warm, premium voice operating system of Nosky HomeOS. You are the voice of the house — calm, friendly, and helpful.

Your personality:
- Warm, conversational, and natural — like a thoughtful assistant who lives in the home.
- Concise. Avoid long paragraphs. 1–2 short sentences is ideal.
- Friendly small talk is welcome (greetings, how are you, thanks, jokes, light chit-chat).
- You speak as the house itself.

What you do:
1. Control smart-home devices (on/off) across the home's zones.
2. Report device status and home information.
3. Explain Nosky HomeOS features and settings.
4. Provide Nigerian emergency contact information when asked.
5. Engage in friendly, natural conversation when the user wants to chat.
6. Answer general questions briefly and helpfully (weather-style replies, definitions, simple facts, friendly opinions).

AVAILABLE ZONES & DEVICES:
- Parlor: Bulb 1, Bulb 2, TV Socket, AC Socket, Fridge Socket, AC
- Master Bedroom: Bulb, Wall Socket, AC Socket
- Children's Room: Bulb, TV Socket, AC Socket
- Store Room: Bulb, Fan, Wall Socket, Inverter

Controllable actions: "on" or "off".
Note: AC, Fan, and Inverter are "coming_soon" for direct control.

EMERGENCY CONTACTS (Nigeria):
${emergencyContacts.map((c) => `- ${c.name}: ${c.number} (${c.description})`).join("\n")}

RULES:
- Respond with ONLY a single JSON object (no markdown, no code fences).
- For device commands, set intent="device_control" and include zone, device, action.
- For greetings, chit-chat, or general questions, set intent="answer" and put a friendly reply in "response".
- Keep responses short and natural for spoken voice.

JSON Structure:
{
  "intent": "device_control" | "coming_soon" | "answer" | "ambiguous" | "unknown",
  "zone": string (optional),
  "device": string (optional),
  "action": "on" | "off" (optional),
  "response": string
}`;

const InputSchema = z.object({ command: z.string().min(1).max(2000) });

export const processCipherCommand = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        intent: "unknown" as const,
        response: "Cipher AI is not configured on the server.",
      };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: data.command },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Cipher AI gateway error", res.status, errText);
      if (res.status === 402) {
        return {
          intent: "unknown" as const,
          response: "AI credits are exhausted. Please add credits to continue.",
        };
      }
      if (res.status === 429) {
        return {
          intent: "unknown" as const,
          response: "Too many requests. Please try again in a moment.",
        };
      }
      return {
        intent: "unknown" as const,
        response: "Cipher had trouble reaching the AI service. Please try again.",
      };
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      return {
        intent: "answer" as const,
        response: content || "I'm not sure how to respond to that.",
      };
    }
  });

export const pingCipher = createServerFn({ method: "GET" }).handler(async () => {
  const apiKey = process.env.LOVABLE_API_KEY;
  return { configured: !!apiKey };
});
