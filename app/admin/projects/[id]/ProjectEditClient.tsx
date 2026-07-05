"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Project, Technology } from "@/types/project";

interface ProjectEditClientProps {
  project: Project;
  availableTechnologies: Technology[];
}

export function ProjectEditClient({ project, availableTechnologies }: ProjectEditClientProps) {
  const router = useRouter();

  const handleSubmit = async (payload: any) => {
    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    } else {
      throw new Error("Failed to update project");
    }
  };

  return (
    <ProjectForm
      initialData={project}
      availableTechnologies={availableTechnologies}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/admin/projects")}
    />
  );
}
