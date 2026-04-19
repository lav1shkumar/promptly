import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { globalRateLimiter } from "@/lib/rate-limit";
import db from "@/lib/db";
import { flattenTree } from "@/modules/helpers/normalize-tree";
import { streamText } from "ai";
import { vertex, DEFAULT_MODEL, VALID_MODEL_IDS, getModelTokenCost } from "@/lib/ai";
import { SYSTEM_PROMPT } from "@/prompt";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor
      ? (forwardedFor.split(",")[0] ?? "127.0.0.1")
      : "127.0.0.1";

    try {
      await globalRateLimiter.check(5, ip);
    } catch {
      return NextResponse.json(
        { error: "Too Many Requests", code: "TOO_MANY_REQUESTS" },
        { status: 429 },
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found", code: "USER_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (dbUser.tokens <= 0) {
      return NextResponse.json(
        { error: "Insufficient tokens", code: "OUT_OF_TOKENS" },
        { status: 402 },
      );
    }

    const {
      prompt: userPrompt,
      files,
      model: requestedModel,
    } = await req.json();

    const selectedModel =
      requestedModel && VALID_MODEL_IDS.includes(requestedModel)
        ? requestedModel
        : DEFAULT_MODEL;

    const flatFiles = flattenTree(files);

    const messages = `USER REQUEST: ${userPrompt}\n\nCURRENT CODEBASE:\n${JSON.stringify(flatFiles)}`;

    const tokenCost = getModelTokenCost(selectedModel);

    if (dbUser.tokens < tokenCost) {
      return NextResponse.json(
        { error: "Insufficient tokens", code: "OUT_OF_TOKENS" },
        { status: 402 },
      );
    }

    const result = streamText({
      model: vertex(selectedModel),
      system: SYSTEM_PROMPT,
      prompt: messages,

      onFinish: async ({ finishReason }) => {
        if (finishReason === "stop") {
          try {
            await db.user.update({
              where: { clerkId: userId },
              data: { tokens: dbUser.tokens - tokenCost },
            });
            console.log(`Deducted ${tokenCost} tokens (${selectedModel}) from user ${userId}`);
          } catch (dbError) {
            console.error("Failed to deduct tokens after stream:", dbError);
          }
        }
      },
    });

    const response = result.toTextStreamResponse();
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        "X-Accel-Buffering": "no",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
