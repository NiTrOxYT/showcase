import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";
import { ClientWorkspace } from "./ClientWorkspace";
import { Heading } from "@/components/typography/Heading";
import { ChevronLeft } from "lucide-react";
import type { ProjectActivity, DeliveryProject } from "@/types/portal";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClientWorkspacePage({ params }: PageProps) {
  const { id } = await params;
  const client = await ClientPortalRepository.getClientById(id);

  if (!client) {
    return notFound();
  }

  // Fetch lifecycle timeline using client project IDs
  const projectIds = client.delivery_projects?.map((p: DeliveryProject) => p.id) ?? [];
  let timeline: ProjectActivity[] = [];
  if (projectIds.length > 0) {
    // Collect activity for projects
    const activities = await Promise.all(
      projectIds.map((pid: string) => ClientPortalRepository.getActivity(pid))
    );
    timeline = activities.flat().sort((a: ProjectActivity, b: ProjectActivity) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Breadcrumbs */}
      <div>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Clients
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Client Workspace ]
          </span>
          <Heading level={1} className="mt-2">{client.company_name}</Heading>
        </div>
      </div>

      {/* Main Workspace Workspace Tabs client side */}
      <ClientWorkspace client={client} timeline={timeline} />
    </div>
  );
}
