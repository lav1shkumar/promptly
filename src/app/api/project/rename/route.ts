import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { projectId, name } = await req.json();

    if (!projectId || !name) {
      return NextResponse.json(
        { success: false, error: "Missing projectId or name" },
        { status: 400 }
      );
    }

    await db.project.update({
      where: {
        id: projectId,
        userId: dbUser.id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json({ success: true, message: "Project renamed successfully" });
  } catch (error) {
    console.error("Rename project error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
