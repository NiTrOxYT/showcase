import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string; fileId: string }> }

// GET /api/delivery-projects/[id]/files/[fileId]/download — returns signed URL
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { fileId } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await import("@/lib/supabase/server")).createAdminClient() as any;
    const { data: file } = await supabase
      .from("project_files")
      .select("bucket, path, filename")
      .eq("id", fileId)
      .single();

    if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });

    const signedUrl = await ClientPortalRepository.getSignedDownloadUrl(file.bucket, file.path);
    return NextResponse.json({ signedUrl, filename: file.filename });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }
}
