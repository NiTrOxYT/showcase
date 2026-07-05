import React from "react";
import { ProjectRepository } from "@/services/repositories/ProjectRepository";
import { ProjectListClient } from "./ProjectListClient";

// Next.js App Router dynamic route config to force database reads on navigation
export const dynamic = "force-dynamic";

export default function ProjectsAdminPage() {
  const initialProjects = ProjectRepository.getAll();
  return <ProjectListClient initialProjects={initialProjects} />;
}
