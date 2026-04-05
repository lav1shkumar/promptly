import { PROMPT } from '@/prompt';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import Anthropic from "@anthropic-ai/sdk";

const ai = new GoogleGenAI({});
const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { userPrompt, files } = await req.json();
    const messages = userPrompt + " Current file structure - " + JSON.stringify(files)


    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: messages,
      config: {
        systemInstruction: PROMPT,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    const text = response.text;

    return new Response(text, {
      headers: { "Content-Type": "text/plain" },
    });


  // const response = await client.messages.create({
  //   model: "claude-sonnet-4-6",
  //   max_tokens: 5000,

  //   system: PROMPT,
  //   messages: [
  //     {
  //       role: "user",
  //       content: messages,
  //     },
  //   ],
  // });

  // const text = response.content
  //   .filter(block => block.type === "text")
  //   .map(block => block.text)
  //   .join("\n");

  // console.log(text);

  // return new Response(text, {
  //   headers: { "Content-Type": "text/plain" },
  // });

  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}