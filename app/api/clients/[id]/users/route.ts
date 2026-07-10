import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: clientId } = await params;
    const { name, email, role } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    // Create the user in Supabase Auth using service role
    const tempPassword = Math.random().toString(36).substring(2, 12) + "A1!";
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { name, role },
    });

    if (authErr) {
      // If user already exists in auth, try to find them and link them, or return error
      if (authErr.message.includes("already registered")) {
        // Let's search auth users
        const { data: userList } = await supabase.auth.admin.listUsers();
        const existingUser = (userList?.users ?? []).find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          // Link existing auth user to client profile
          const record = await ClientPortalRepository.createClientUser({
            client_id: clientId,
            auth_user_id: existingUser.id,
            name,
            email,
            role,
          });
          return NextResponse.json(record, { status: 201 });
        }
      }
      throw authErr;
    }

    const authUser = authData.user;
    if (!authUser) throw new Error("Auth user creation returned empty");

    // Create profile
    const record = await ClientPortalRepository.createClientUser({
      client_id: clientId,
      auth_user_id: authUser.id,
      name,
      email,
      role,
    });

    return NextResponse.json({
      ...record,
      temp_password: tempPassword, // optionally show to admin or keep hidden
    }, { status: 201 });

  } catch (err: any) {
    console.error("POST /api/clients/[id]/users error:", err);
    return NextResponse.json({ error: err.message || "Failed to create portal user" }, { status: 500 });
  }
}
