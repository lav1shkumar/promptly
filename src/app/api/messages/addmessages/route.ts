"use server"
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { projectId, message, role } = await req.json();

    const project = await db.project.update({
      where: {
        id: projectId,
      },
      data: {
        messages: {
          create: {
            content: message,
            role: role,
          },
        },
      },
    });

    if (!project) {
      return Response.json({ error: "Failed to add message" }, { status: 500 });
    }

    return Response.json(
      { success: true, message: "Message added successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to add message" }, { status: 500 });
  }
}
