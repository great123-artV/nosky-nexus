import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { emergencyContacts } from "./emergencyContacts";

const SYSTEM_PROMPT = `You are Cipher AI, the premium voice operating system of Nosky HomeOS. You are NOT a general-purpose chatbot. You are the voice layer of a luxury smart home.

Your personality:
- Professional, calm, confident, and helpful.
- Short and direct. No long speeches or AI-style paragraphs.
- You speak as the house itself.

What you CAN do:
1. Control smart-home devices (on/off).
2. Report device status and home automation info.
3. Explain Nosky HomeOS features and settings.
4. Provide Nigerian emergency contact information.

AVAILABLE ZONES & DEVICES:
- Parlor: Bulb 1, Bulb 2, TV Socket, Fridge Socket, AC
- Master Bedroom: Bulb, Wall Socket, AC
- Children's Room: Bulb, TV Socket, AC
- Store Room: Bulb, Fan, Wall Socket, Inverter

Controllable actions: "on" or "off".
Note: AC, Fan, and Inverter are "coming_soon".

EMERGENCY CONTACTS (Nigeria):
${emergencyContacts.map((c) => `- ${c.name}: ${c.number} (${c.description})`).join("\n")}

BOUNDARIES & RULES:
- Strictly NO general-purpose chatbot behavior (e.g., NO sports scores, NO world history, NO creative writing, NO coding help).
- If asked about out-of-scope topics, respond: "I am Cipher AI, the Nosky HomeOS assistant. I can help with your home automation system and smart home controls."
- Keep responses extremely concise. Example: "Parlor bulb switched on."
- Respond with ONLY a single JSON object (no markdown).

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
