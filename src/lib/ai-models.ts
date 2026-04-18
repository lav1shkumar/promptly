export const DEFAULT_MODEL = "gemini-3.1-pro-preview";
export const LIGHT_MODEL = "gemini-3.1-flash-lite-preview";

export const AI_MODELS = [
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro",
    description: "Most capable model",
    badge: "Pro",
  },
  {
    id: "gemini-3.1-flash-lite-preview",
    name: "Gemini 3.1 Flash Lite",
    description: "Fast and lightweight",
    badge: "Lite",
  },
  {
    id: "gemini-3.0-flash",
    name: "Gemini 3 Flash",
    description: "Balanced performance",
    badge: "Flash",
  },
] as const;

export type AIModelId = (typeof AI_MODELS)[number]["id"];

export const VALID_MODEL_IDS = AI_MODELS.map(
  (m) => m.id,
) as unknown as string[];
