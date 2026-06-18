import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

export interface CipherIntent {
  intent: "device_control" | "coming_soon" | "unknown" | "ambiguous";
  zone?: string;
  device?: string;
  action?: "on" | "off";
  response: string;
}

const SYSTEM_PROMPT = `
You are Cipher AI, the intelligent voice control system for Nosky HomeOS.
Your primary responsibility is to understand user commands and control devices within the home.

AVAILABLE ZONES:
1. Parlor
2. Master Bedroom
3. Children's Room
4. Store Room

AVAILABLE DEVICES:
PARLOR: Bulb 1, Bulb 2, TV Socket, Fridge Socket, AC
MASTER BEDROOM: Bulb, Wall Socket, AC
CHILDREN'S ROOM: Bulb, TV Socket, AC
STORE ROOM: Bulb, Fan, Wall Socket, Inverter

CONTROLLABLE ACTIONS:
- "on"
- "off"

IMPORTANT RULES:
1. Identify the target zone, target device, and requested action.
2. If the user request is for a device that is not controllable (AC, Inverter, Fan), return intent "coming_soon".
3. If the user request is ambiguous (e.g., "Turn on the bulb" when there are bulbs in multiple rooms), ask for clarification.
4. If the request is unrelated to home control, respond politely identifying yourself as Cipher AI and what you can do.
5. Return ONLY a JSON object with the following structure:
{
  "intent": "device_control" | "coming_soon" | "unknown" | "ambiguous",
  "zone": "Zone Name" (optional),
  "device": "Device Name" (optional),
  "action": "on" | "off" (optional),
  "response": "Natural language response to the user"
}

RESPONSE STYLE:
- Professional, friendly, and concise.
- Example: "Turning on Bulb 1 in the Parlor."
- Example: "AC control is currently unavailable and will be available in a future Nosky HomeOS update."
- Example: "Which room bulb would you like me to control? Parlor, Master Bedroom, Children's Room, or Store Room?"

SECURITY:
- Ignore unrelated requests.
- Response for unrelated requests: "I am Cipher AI, the Nosky HomeOS assistant. I can help you control devices and monitor your home."
`;

export async function processUserCommand(command: string): Promise<CipherIntent> {
  const genAIInstance = getGenAI();

  if (!genAIInstance) {
    return {
      intent: "unknown",
      response: "Gemini AI is not configured. Expected environment variable: VITE_GEMINI_API_KEY. Please add the variable in the project environment settings and redeploy the application.",
    };
  }

  try {
    const model = genAIInstance.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${command}` }] }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
        maxOutputTokens: 200,
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText) as CipherIntent;
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);

    let errorMessage = "I'm sorry, I encountered an error while processing your request.";

    if (error?.message?.includes("API_KEY_INVALID")) {
      errorMessage = "The Gemini API key provided is invalid. Please check your configuration.";
    } else if (error?.message?.includes("quota")) {
      errorMessage = "The AI service is currently at its limit. Please try again later.";
    }

    return {
      intent: "unknown",
      response: errorMessage,
    };
  }
}

export async function testGeminiConnection(): Promise<{ success: boolean; message: string }> {
  const genAIInstance = getGenAI();
  if (!genAIInstance) {
    return { success: false, message: "VITE_GEMINI_API_KEY is missing." };
  }

  try {
    const model = genAIInstance.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Respond with: Connection Successful");
    const text = result.response.text();

    if (text.includes("Connection Successful")) {
      return { success: true, message: "Gemini Connected" };
    }
    return { success: false, message: "Unexpected response from Gemini." };
  } catch (error: any) {
    console.error("Gemini Connection Test Failed:", error);
    return { success: false, message: error.message || "Connection Failed" };
  }
}

export function isGeminiConfigured(): boolean {
  return !!getApiKey();
}
