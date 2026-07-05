import { NextResponse } from "next/server";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";

export async function GET() {
  try {
    const settings = SettingsRepository.getAll();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to read settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { moduleName, updates } = await request.json();
    if (!moduleName) {
      return NextResponse.json({ error: "moduleName parameter is required" }, { status: 400 });
    }
    const updated = SettingsRepository.updateModule(moduleName, updates);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update settings module" }, { status: 500 });
  }
}
