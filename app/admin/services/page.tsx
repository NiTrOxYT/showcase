import React from "react";
import { ServiceRepository } from "@/services/repositories/ServiceRepository";
import { ServiceListClient } from "./ServiceListClient";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const initialServices = await ServiceRepository.getAll();
  return <ServiceListClient initialServices={initialServices} />;
}
