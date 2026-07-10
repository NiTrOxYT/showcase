import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";
import { ProjectWorkspaceClient } from "./ProjectWorkspaceClient";
import { Heading } from "@/components/typography/Heading";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DeliveryProjectWorkspacePage({ params }: PageProps) {
  const { id } = await params;
  const project = await ClientPortalRepository.getProjectById(id);

  if (!project) {
    return notFound();
  }

  // Fetch comments and activity log for the project
  const [comments, activity] = await Promise.all([
    ClientPortalRepository.getComments("delivery_project", id),
    ClientPortalRepository.getActivity(id),
  ]);

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Breadcrumbs */}
      <div>
        <Link
          href="/admin/delivery-projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Project Workspace ]
          </span>
          <Heading level={1} className="mt-2">{project.title}</Heading>
          <p className="text-xs text-muted font-mono mt-1">Client: {project.client?.company_name}</p>
        </div>
      </div>

      {/* Client workspace */}
      <ProjectWorkspaceClient 
        project={project} 
        initialComments={comments} 
        initialActivity={activity} 
      />
    </div>
  );
}
