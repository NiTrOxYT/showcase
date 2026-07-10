import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getPortalSession } from "@/lib/supabase/middleware";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";
import { PortalProjectWorkspaceClient } from "./PortalProjectWorkspaceClient";
import { Heading } from "@/components/typography/Heading";
import { ChevronLeft } from "lucide-react";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PortalProjectWorkspacePage({ params }: PageProps) {
  const { id } = await params;
  const headersList = await headers();
  const cookiesHeader = headersList.get("cookie") || "";
  
  const mockReq = {
    cookies: {
      getAll: () => cookiesHeader.split(";").map((c) => {
        const [name, ...val] = c.trim().split("=");
        return { name, value: val.join("=") };
      })
    }
  } as unknown as NextRequest;

  const session = await getPortalSession(mockReq);
  if (!session) return redirect("/portal/login");

  const project = await ClientPortalRepository.getProjectById(id);

  // Security Gate: Ensure project belongs to this client session!
  if (!project || project.client_id !== session.clientId) {
    return notFound();
  }

  // Fetch comments and activity
  const [comments, activity] = await Promise.all([
    ClientPortalRepository.getComments("delivery_project", id),
    ClientPortalRepository.getActivity(id),
  ]);

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Breadcrumbs */}
      <div>
        <Link
          href="/portal/projects"
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
            [ Project Delivery Details ]
          </span>
          <Heading level={1} className="mt-2">{project.title}</Heading>
          <p className="text-xs text-muted font-mono mt-1">Status: {project.status}</p>
        </div>
      </div>

      {/* Client workspace component */}
      <PortalProjectWorkspaceClient 
        project={project} 
        initialComments={comments} 
        initialActivity={activity}
        session={session}
      />
    </div>
  );
}
