import { updateProjectFiles } from '@/modules/auth/actions';

export async function POST(req: Request) {
  const { projectId, files } = await req.json();
  const res = await updateProjectFiles(projectId, files);
  
  return Response.json(res);
}