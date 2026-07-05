import React from "react";
import { notFound } from "next/navigation";
import { ProjectRepository } from "@/services/repositories/ProjectRepository";
import { TechnologyRepository } from "@/services/repositories/TechnologyRepository";
import { ProjectEditClient } from "./ProjectEditClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = ProjectRepository.getById(id);
  
  if (!project) {
    notFound();
  }

  const availableTechnologies = TechnologyRepository.getAll();

  return (
    <ProjectEditClient
      project={project}
      availableTechnologies={availableTechnologies}
    />
  );
}
