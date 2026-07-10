import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";
import { createAdminClient } from "@/lib/supabase/server";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const files = await ClientPortalRepository.getFiles(id);
    return NextResponse.json(files);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: projectId } = await params;
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const uploadedBy = formData.get("uploaded_by") as string | null;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const path = `${projectId}/${Date.now()}-${file.name}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { error: uploadErr } = await supabase.storage
      .from("project_files")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadErr) throw uploadErr;

    const record = await ClientPortalRepository.createFileRecord({
      project_id: projectId,
      filename: file.name,
      bucket: "project_files",
      path,
      mime: file.type,
      size_bytes: file.size,
      uploaded_by: uploadedBy ?? "admin",
      version: 1,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    await ClientPortalRepository.deleteFileRecord(body.fileId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
