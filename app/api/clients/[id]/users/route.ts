import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string }> }

// GET /api/clients/[id]/users — list client portal users directly from application DB
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id: clientId } = await params;
    const users = await ClientPortalRepository.getClientUsers(clientId);
    return NextResponse.json(users);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch portal users";
    console.error("GET /api/clients/[id]/users error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/clients/[id]/users — create portal user profile and register with Supabase Auth
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: clientId } = await params;
    const { name, email, role, password } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const tempPassword = password || (Math.random().toString(36).substring(2, 12) + "A1!");
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { name, role },
    });

    if (authErr) {
      // If user already exists in auth, try to find them and link them, or return error
      if (authErr.message.includes("already registered")) {
        const { data: userList } = await supabase.auth.admin.listUsers();
        const existingUser = (userList?.users ?? []).find(
          (u: { email?: string }) => u.email?.toLowerCase() === email.toLowerCase()
        );
        
        if (existingUser) {
          const record = await ClientPortalRepository.createClientUser({
            client_id: clientId,
            auth_user_id: existingUser.id,
            name,
            email,
            role,
            status: "active",
          });
          return NextResponse.json(record, { status: 201 });
        }
      }
      throw authErr;
    }

    const authUser = authData.user;
    if (!authUser) throw new Error("Auth user creation returned empty");

    // Create profile in database
    const record = await ClientPortalRepository.createClientUser({
      client_id: clientId,
      auth_user_id: authUser.id,
      name,
      email,
      role,
      status: "active",
    });

    return NextResponse.json({
      ...record,
      temp_password: tempPassword,
    }, { status: 201 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create portal user";
    console.error("POST /api/clients/[id]/users error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
