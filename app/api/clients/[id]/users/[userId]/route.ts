import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string; userId: string }> }

// PATCH /api/clients/[id]/users/[userId] — update details, reset password, or toggle status
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id: clientId, userId } = await params;
    const body = await req.json();
    const { action } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    // Fetch existing client user profile
    const clientUsers = await ClientPortalRepository.getClientUsers(clientId);
    const clientUser = clientUsers.find((u) => u.id === userId);

    if (!clientUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "toggle_status") {
      const nextStatus = clientUser.status === "active" ? "disabled" : "active";
      const updated = await ClientPortalRepository.updateClientUser(userId, { status: nextStatus });
      return NextResponse.json(updated);
    }

    if (action === "reset_password") {
      if (!clientUser.auth_user_id) {
        return NextResponse.json({ error: "User is not activated in Auth system yet" }, { status: 400 });
      }

      const newPassword = Math.random().toString(36).substring(2, 12) + "A1!";
      const { error: authErr } = await supabase.auth.admin.updateUserById(clientUser.auth_user_id, {
        password: newPassword,
      });

      if (authErr) throw authErr;

      return NextResponse.json({ temp_password: newPassword });
    }

    // Default: Edit user details (Name, Email, Role)
    const { name, email, role } = body;
    if (!name || !email) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    // Update in database first
    const updated = await ClientPortalRepository.updateClientUser(userId, { name, email, role });

    // Sync with Supabase Auth if linked
    if (clientUser.auth_user_id) {
      const { error: authErr } = await supabase.auth.admin.updateUserById(clientUser.auth_user_id, {
        email,
        user_metadata: { name, role },
      });

      if (authErr) {
        return NextResponse.json({ error: authErr.message }, { status: 400 });
      }
    }

    return NextResponse.json(updated);

  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update portal user";
    console.error("PATCH /api/clients/[id]/users/[userId] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/clients/[id]/users/[userId] — delete portal user and de-provision from Supabase Auth
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id: clientId, userId } = await params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const clientUsers = await ClientPortalRepository.getClientUsers(clientId);
    const clientUser = clientUsers.find((u) => u.id === userId);

    if (!clientUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Delete from Supabase Auth using service role
    if (clientUser.auth_user_id) {
      const { error: authErr } = await supabase.auth.admin.deleteUser(clientUser.auth_user_id);
      if (authErr) {
        console.error("Warning: Failed to delete auth user:", authErr);
      }
    }

    // 2. Delete from database client_users table
    const { error: dbErr } = await supabase
      .from("client_users")
      .delete()
      .eq("id", userId);

    if (dbErr) throw dbErr;

    return NextResponse.json({ success: true });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete portal user";
    console.error("DELETE /api/clients/[id]/users/[userId] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
