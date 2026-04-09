import { runChat } from '@/lib/ai/chat';

export async function POST(req: Request) {
  try {
    const { userPrompt, files } = await req.json();

    const result = await runChat(userPrompt, files);

    return result;

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}