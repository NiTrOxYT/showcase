"use client";

import React from "react";
import type { Project } from "@/types/project";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";

interface CaseStudyEditClientProps {
  project: Project;
}

export function CaseStudyEditClient({ project }: CaseStudyEditClientProps) {
  return (
    <div className="w-full">
      <CaseStudyForm initialProject={project} />
    </div>
  );
}
export default CaseStudyEditClient;
