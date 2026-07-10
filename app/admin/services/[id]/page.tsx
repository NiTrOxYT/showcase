import React from "react";
import { ServiceRepository } from "@/services/repositories/ServiceRepository";
import { notFound } from "next/navigation";
import { ServiceEditClient } from "./ServiceEditClient";

export const dynamic = "force-dynamic";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function ServiceEditPage({ params }: PageParams) {
  const { id } = await params;
  const service = await ServiceRepository.getById(id);

  if (!service) {
    notFound();
  }

  return <ServiceEditClient service={service} />;
}
