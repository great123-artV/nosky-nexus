import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPT = `You are Cipher AI, the intelligent voice assistant for Nosky HomeOS, a luxury smart home operating system.

You can:
1. Control smart-home devices (turn devices on/off)
2. Answer general questions like a helpful assistant (weather logic, math, definitions, casual chat, Google-style knowledge questions, etc.)
3. Execute commands the user gives you in natural language

AVAILABLE ZONES & DEVICES (only these can be controlled):
- Parlor: Bulb 1, Bulb 2, TV Socket, Fridge Socket, AC
- Master Bedroom: Bulb, Wall Socket, AC
- Children's Room: Bulb, TV Socket, AC
- Store Room: Bulb, Fan, Wall Socket, Inverter

Controllable actions are "on" or "off". Devices of type AC, Fan, or Inverter are "coming_soon".

You MUST reply with ONLY a single JSON object (no markdown fences) with this shape:
{
  "intent": "device_control" | "coming_soon" | "answer" | "ambiguous" | "unknown",
  "zone": string (optional, exact zone name),
  "device": string (optional, exact device name),
  "action": "on" | "off" (optional),
  "response": string  // natural-language reply spoken back to the user
}

Rules:
- "device_control": user clearly wants to switch a controllable device on/off; include zone, device, action.
- "coming_soon": user wants to control AC, Fan, or Inverter.
- "ambiguous": device name matches multiple zones and user didn't specify which.
- "answer": user asked a general question or made small-talk — put the full answer in "response".
- "unknown": you genuinely cannot help.

Keep "response" concise, friendly, and natural for speech (1-2 sentences for control, up to 4 for answers).`;

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
