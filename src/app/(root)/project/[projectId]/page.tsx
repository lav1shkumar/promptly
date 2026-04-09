import { getProjectById, getUser } from '@/modules/auth/actions';
import { notFound } from 'next/navigation';
import ProjectView from '@/modules/project/components/ProjectView';
import { FileSystemTree } from '@webcontainer/api';

interface PageProps {
    params: Promise<{ projectId: string }>;
}

const ProjectPage = async ({ params }: PageProps) => {
    const { projectId } = await params;

    const userResponse = await getUser();
    if (!userResponse.success || !userResponse.user) {
        notFound();
    }

    const projectResponse = await getProjectById(projectId, userResponse.user.id);
    if (!projectResponse.success || !projectResponse.project) {
        notFound();
    }

    const initialFiles = projectResponse.project.files as unknown as FileSystemTree;

    return (
        <ProjectView 
            projectId={projectId} 
            initialFiles={initialFiles} 
        />
    );
}

export default ProjectPage;