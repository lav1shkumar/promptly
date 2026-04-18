import { createVertex } from "@ai-sdk/google-vertex";

export const vertex = createVertex({
  apiKey: process.env.GOOGLE_VERTEX_API_KEY,
});

export {
  DEFAULT_MODEL,
  LIGHT_MODEL,
  AI_MODELS,
  VALID_MODEL_IDS,
} from "./ai-models";
export type { AIModelId } from "./ai-models";
