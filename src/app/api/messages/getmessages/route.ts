"use server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();

    const project = await db.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return Response.json({ messages: project?.messages }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to get messages" }, { status: 500 });
  }
}
