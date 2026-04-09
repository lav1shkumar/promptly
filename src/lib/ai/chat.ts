import { flattenTree } from '@/modules/webcontainers/normalize-tree';
import { PROMPT } from '@/prompt';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';


const ai = new GoogleGenAI({
  // vertexai: true,
  // project: process.env.GOOGLE_CLOUD_PROJECT,
  // location: process.env.GOOGLE_CLOUD_LOCATION,
});

const filePatchSchema = {
  type: Type.ARRAY,
  description: "An array of file operations (write or delete) to apply to the codebase.",
  items: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        enum: ["write", "delete"],
        description: "The type of operation to perform."
      },
      path: {
        type: Type.STRING,
        description: "The full file path, e.g., 'app/page.tsx' or 'components/ui/button.tsx'"
      },
      content: {
        type: Type.STRING,
        description: "The complete file content. Required if type is 'write'."
      }
    },
    required: ["type", "path"]
  }
};

export async function runChat(userPrompt: string, files: any) {
  try {
    files = flattenTree(files);

    const messages =
      userPrompt + " Current file structure - " + JSON.stringify(files);

    console.log("Gemini Invoked");

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: messages,
      config: {
        systemInstruction: PROMPT,
        maxOutputTokens: 65000,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MEDIUM,
        },
      },
    });

    const text = response.text || "";

    const separator = "### JSON";
    const idx = text.indexOf(separator);

    if (idx === -1) {
      throw new Error("JSON separator not found in model response");
    }

    const summary = text.slice(0, idx).trim();
    const jsonText = text
      .slice(idx + separator.length)
      .trim()
      .replace(/```json/g, "")
      .replace(/```/g, "");

    const filesPatch = JSON.parse(jsonText);

    return Response.json({
      summary,
      files: filesPatch,
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}