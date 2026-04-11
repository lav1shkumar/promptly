"use server";

import { flattenTree } from "@/modules/helpers/normalize-tree";
import { PROMPT } from "@/prompt";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({});

function extractAndParseJson(text: string) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("No valid JSON found");
    }

    let jsonString = text.substring(start, end + 1);

    try {
      return JSON.parse(jsonString);
    } catch (e) {
      if (!jsonString.endsWith("}")) jsonString += "}";
      if (!jsonString.endsWith("]}")) {
        if (jsonString.includes('"files": [')) {
          jsonString = jsonString.replace(/\]?\}?$/, "]}");
        }
      }
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.error("Parse error:", error);
    return { summary: "Error parsing response", files: [] };
  }
}

export async function runChat(userPrompt: string, files: any) {
  try {
    files = flattenTree(files);
    const messages =
      userPrompt + " Current file structure - " + JSON.stringify(files);

    console.log("Gemini Invoked");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    const data = extractAndParseJson(text);
    const { summary, files: filesPatch } = data;

    return Response.json({
      summary: summary || "Changes applied.",
      files: filesPatch || [],
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
