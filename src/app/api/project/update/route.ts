"use server";
import { updateProjectFiles } from "@/modules/updates";

export async function POST(req: Request) {
  const { projectId, files } = await req.json();
  const res = await updateProjectFiles(projectId, files);

  return Response.json(res);
}
