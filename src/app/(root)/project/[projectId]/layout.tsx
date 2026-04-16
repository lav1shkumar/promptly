import { getUser } from "@/modules/auth/actions";
import { getProjectById } from "@/modules/updates";
import { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    projectId: string;
  }>;
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { projectId } = await params;

  const userResponse = await getUser();
  if (!userResponse.success || !userResponse.user) {
    return { title: "Project Not Found" };
  }

  const projectResponse = await getProjectById(projectId, userResponse.user.id);
  if (!projectResponse.success || !projectResponse.project) {
    return { title: "Project Not Found" };
  }

  return {
    title: projectResponse.project.name,
  };
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
