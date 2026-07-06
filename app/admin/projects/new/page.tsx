import React from "react";
import { TechnologyRepository } from "@/services/repositories/TechnologyRepository";
import { ProjectCreateClient } from "./ProjectCreateClient";

export const dynamic = "force-dynamic";

export default async function NewProjectAdminPage() {
  const availableTechnologies = await TechnologyRepository.getAll();
  return <ProjectCreateClient availableTechnologies={availableTechnologies} />;
}
