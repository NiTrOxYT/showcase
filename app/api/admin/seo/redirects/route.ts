import { NextResponse } from "next/server";
import { RedirectRepository } from "@/services/repositories/RedirectRepository";

export const dynamic = "force-dynamic";

function slugifyPath(path: string): string {
  if (!path.startsWith("/")) return path;
  return "/" + path
    .split("/")
    .filter(Boolean)
    .map((seg) =>
      seg
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "") // no special characters
        .replace(/-+/g, "-")        // no duplicate hyphens
    )
    .join("/");
}

export async function GET() {
  try {
    const rules = await RedirectRepository.getAll();
    return NextResponse.json({ rules });
  } catch (error) {
    console.error("GET redirects failed:", error);
    return NextResponse.json({ error: "Failed to load redirects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sourcePath, destinationPath, redirectType, reason } = body;

    if (!sourcePath || !destinationPath) {
      return NextResponse.json({ error: "Source and destination paths are required" }, { status: 400 });
    }

    // Dynamic slugify source path to prevent formatting mistakes
    const cleanSource = slugifyPath(sourcePath.trim());
    let cleanDest = destinationPath.trim();
    if (!cleanDest.startsWith("http")) {
      cleanDest = slugifyPath(cleanDest);
    }

    if (cleanSource === cleanDest) {
      return NextResponse.json({ error: "Source path and destination path cannot be identical" }, { status: 400 });
    }

    const success = await RedirectRepository.create({
      sourcePath: cleanSource,
      destinationPath: cleanDest,
      redirectType: Number(redirectType) || 301,
      reason: reason || "",
    });

    if (!success) {
      return NextResponse.json({ error: "Failed to create redirect. Path may already exist." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST redirects failed:", error);
    return NextResponse.json({ error: "Failed to save redirect" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const success = await RedirectRepository.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete redirect" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE redirect failed:", error);
    return NextResponse.json({ error: "Failed to delete redirect" }, { status: 500 });
  }
}
