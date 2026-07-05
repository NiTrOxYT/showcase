import React from "react";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { SettingsFormClient } from "./SettingsFormClient";

export const dynamic = "force-dynamic";

export default function SettingsAdminPage() {
  const initialSettings = SettingsRepository.getAll();
  return <SettingsFormClient initialSettings={initialSettings} />;
}
