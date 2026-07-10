"use client";

import React from "react";
import { ServiceForm } from "@/components/admin/ServiceForm";

export function ServiceCreateClient() {
  return (
    <div className="py-6 select-none">
      <ServiceForm isEdit={false} />
    </div>
  );
}
export default ServiceCreateClient;
