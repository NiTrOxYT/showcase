import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";
import { getPortalSession } from "@/lib/supabase/middleware";

export async function GET(req: NextRequest) {
  try {
    const session = await getPortalSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const unreadOnly = new URL(req.url).searchParams.get("unread") === "true";
    const notifications = await ClientPortalRepository.getNotifications(session.clientUserId, unreadOnly);
    return NextResponse.json(notifications);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getPortalSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (body.markAll) {
      await ClientPortalRepository.markAllRead(session.clientUserId);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
