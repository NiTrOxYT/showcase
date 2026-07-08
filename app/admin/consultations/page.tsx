import React from "react";
import { ConsultationRepository } from "@/services/repositories/ConsultationRepository";
import { ConsultationListClient } from "./ConsultationListClient";

export const dynamic = "force-dynamic";

export default async function ConsultationsAdminPage() {
  const consultations = await ConsultationRepository.getAll();
  return <ConsultationListClient initialConsultations={consultations} />;
}
