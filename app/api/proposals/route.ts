/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ConversionRepository } from "@/services/repositories/ConversionRepository";
import { createAdminClient } from "@/lib/supabase/server";
import { supabaseMiddleware } from "@/lib/supabase/middleware";

export const dynamic = "force-dynamic";

// POST /api/proposals - Public: Submit project request and upload documents
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Parse Lead fields
    const full_name = formData.get("full_name") as string;
    const company = formData.get("company") as string || null;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string || null;
    const website = formData.get("website") as string || null;
    const company_size = (formData.get("company_size") as "Solo" | "2-10" | "11-50" | "51-200" | "200+") || null;
    const project_type = (formData.get("project_type") as "Business Website" | "SaaS" | "AI Automation" | "Mobile App" | "Internal Tool" | "UI/UX Design") || null;
    const message = formData.get("message") as string || null;
    const lead_source = formData.get("lead_source") as string || "Website RFP";
    
    // Parse Service IDs
    const serviceIdsRaw = formData.get("serviceIds") as string || "";
    const serviceIds = serviceIdsRaw ? serviceIdsRaw.split(",").map(id => id.trim()) : [];

    if (!full_name || !email) {
      return NextResponse.json({ error: "Missing required contact details" }, { status: 400 });
    }

    // 1. Create Lead
    const lead = await ConversionRepository.createLead({
      full_name,
      company,
      email,
      phone,
      website,
      company_size,
      budget: formData.get("preferred_budget") as string || null,
      timeline: formData.get("estimated_duration") as string || null,
      project_type,
      message,
      lead_source,
    }, serviceIds);

    if (!lead || !lead.id) {
      return NextResponse.json({ error: "Failed to initialize lead file" }, { status: 500 });
    }

    // 2. Upload attachments and log them
    const files = formData.getAll("files");
    const supabase = createAdminClient() as any;

    for (const fileObject of files) {
      if (fileObject && typeof fileObject === "object" && "name" in fileObject) {
        const file = fileObject as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "bin";
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${fileExt}`;
        const storagePath = `proposals/${lead.id}/${uniqueFilename}`;

        // Upload to lead_attachments bucket
        const { error: uploadError } = await supabase.storage
          .from("lead_attachments")
          .upload(storagePath, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error(`[API Proposals Upload] Failed to upload ${file.name}:`, uploadError);
          continue;
        }

        // Log file link in lead_files
        await ConversionRepository.createLeadFile({
          lead_id: lead.id,
          filename: file.name,
          storage_path: storagePath,
          mime_type: file.type,
          size: file.size,
        });
      }
    }

    // 3. Create Proposal Request
    const project_summary = formData.get("project_summary") as string || message || "No summary provided";
    const preferred_budget = formData.get("preferred_budget") as string || null;
    const expected_start_date = formData.get("expected_start_date") as string || null;
    const project_scope_summary = formData.get("project_scope_summary") as string || null;
    const estimated_duration = formData.get("estimated_duration") as string || null;
    const project_priority = formData.get("project_priority") as string || null;

    const proposal = await ConversionRepository.createProposalRequest({
      lead_id: lead.id,
      project_summary,
      preferred_budget,
      expected_start_date,
      project_scope_summary,
      estimated_duration,
      project_priority,
    });

    return NextResponse.json({ success: true, leadId: lead.id, proposalId: proposal?.id });
  } catch (error) {
    console.error("[API proposals POST] Failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/proposals - Admin only: update proposal status
export async function PUT(req: Request) {
  try {
    const { isAuthenticated } = await supabaseMiddleware(req as unknown as NextRequest);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing proposal ID or status" }, { status: 400 });
    }

    const success = await ConversionRepository.updateProposalStatus(id, status);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("[API proposals PUT] Failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
