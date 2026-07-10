import React from "react";
import { notFound } from "next/navigation";
import { ProjectRepository } from "@/services/repositories/ProjectRepository";
import { CaseStudyEditClient } from "./CaseStudyEditClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCaseStudyEditPage({ params }: PageProps) {
  const { id } = await params;
  const project = await ProjectRepository.getById(id);

  if (!project) {
    notFound();
  }

  return <CaseStudyEditClient project={project} />;
}
