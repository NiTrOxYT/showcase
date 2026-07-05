"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Technology } from "@/types/project";

export function ProjectCreateClient({ availableTechnologies }: { availableTechnologies: Technology[] }) {
  const router = useRouter();

  const handleSubmit = async (payload: any) => {
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    } else {
      throw new Error("Failed to create project");
    }
  };

  return (
    <ProjectForm
      availableTechnologies={availableTechnologies}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/admin/projects")}
    />
  );
}
