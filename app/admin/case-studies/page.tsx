import React from "react";
import { ProjectRepository } from "@/services/repositories/ProjectRepository";
import { CaseStudyListClient } from "./CaseStudyListClient";
import { Heading } from "@/components/typography/Heading";

export const dynamic = "force-dynamic";

export default async function AdminCaseStudiesPage() {
  const projects = await ProjectRepository.getAll();

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border/10 pb-6">
        <Heading level={1} className="text-3xl font-black tracking-tightest">
          Case Studies CMS
        </Heading>
        <p className="text-xs font-mono uppercase tracking-widest text-muted mt-1.5">
          Expand projects with rich narrative structure, comparisons, KPI dashboards, and SEO metrics.
        </p>
      </div>

      <CaseStudyListClient initialProjects={projects} />
    </div>
  );
}
