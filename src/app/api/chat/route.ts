import { google } from '@ai-sdk/google';
import { streamText, tool, stepCountIs, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { PROMPT } from '@/prompt';
import { listFiles, readFile, runCommand, startDevServer, writeFile } from '@/modules/webcontainers/container';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log("YES");

  const result = streamText({
    model: google('gemini-3.1-flash-lite-preview'),
    system: PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(10),
    tools: {
      terminal: tool({
        description: "Use the terminal to run commands (e.g., 'npm install <package>')",
        inputSchema: z.object({
          command: z.string(),
        }),
      }),
      createOrUpdateFiles: tool({
        description: "Create or update files in the WebContainer",
        inputSchema: z.object({
          files: z.array(
            z.object({
              path: z.string(),
              content: z.string(),
            })
          ),
        }),
      }),
      readFile: tool({
        description: "Read the contents of one or more files",
        inputSchema: z.object({
          file: z.string(),
        }),
      }),
      listFiles: tool({
        description: "List files in a given directory path",
        inputSchema: z.object({
          path: z.string(),
        }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
