"use client";

import React from "react";
import type { Service } from "@/types/service";
import { ServiceForm } from "@/components/admin/ServiceForm";

interface ServiceEditClientProps {
  service: Service;
}

export function ServiceEditClient({ service }: ServiceEditClientProps) {
  return (
    <div className="py-6 select-none">
      <ServiceForm initialService={service} isEdit={true} />
    </div>
  );
}
export default ServiceEditClient;
