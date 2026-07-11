/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { ConversionRepository } from "@/services/repositories/ConversionRepository";
import { createAdminClient } from "@/lib/supabase/server";
import { LeadWorkspaceClient, NotesWidget } from "./LeadWorkspaceClient";
import {
  ArrowLeft,
  User,
  Building2,
  FileSpreadsheet,
  CheckSquare,
  Paperclip,
  Activity,
  Calendar,
  Phone,
  Globe
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const lead = await ConversionRepository.getLeadById(id);
  if (!lead) {
    return notFound();
  }

  // Pre-generate secure signed URLs for attachments
  const supabase = createAdminClient() as any;
  const filesWithUrls = await Promise.all(
    (lead.files || []).map(async (file: { id: string; filename: string; storage_path: string; mime_type: string }) => {
      const { data } = await supabase.storage
        .from("lead_attachments")
        .createSignedUrl(file.storage_path, 3600); // 1 hour
      return { ...file, downloadUrl: data?.signedUrl || "#" };
    })
  );

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/10 gap-4">
        <div>
          <Link
            href="/admin/leads"
            className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted hover:text-foreground transition-all mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to registry
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Workspace file: {lead.id?.slice(0, 8)} ]
          </span>
          <Heading level={1} className="text-3xl font-black mt-1 tracking-tightest uppercase font-mono">
            {lead.full_name}
          </Heading>
          <Text className="text-muted/60 text-xs">
            Review detailed timeline profile, note logging triggers, and link bookings.
          </Text>
        </div>

        {/* Action controls client */}
        <LeadWorkspaceClient leadId={lead.id!} currentStatus={lead.status!} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: profile details & listings */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Bento Card: Core profile metadata */}
          <div className="p-6 border border-border/30 bg-surface/10 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" /> Contact Email
              </span>
              <a href={`mailto:${lead.email}`} className="font-mono text-xs text-foreground hover:underline">{lead.email}</a>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-primary" /> Company / Organization
              </span>
              <span className="text-xs text-foreground/90">{lead.company || "N/A"}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-primary" /> Phone Number
              </span>
              <span className="text-xs text-foreground/90">{lead.phone || "N/A"}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-primary" /> Website URL
              </span>
              {lead.website ? (
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline truncate">
                  {lead.website}
                </a>
              ) : (
                <span className="text-xs text-muted/50">N/A</span>
              )}
            </div>

            <div className="flex flex-col gap-1 border-t border-border/5 pt-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">Qualification details</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs font-bold text-foreground bg-surface/40 border border-border/20 px-3 py-1 rounded">
                  Score: {lead.lead_score}%
                </span>
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded">
                  {lead.qualification}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-border/5 pt-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">Parameters</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-muted bg-surface/30 px-2.5 py-1 rounded">Size: {lead.company_size || "N/A"}</span>
                <span className="text-[10px] font-mono text-muted bg-surface/30 px-2.5 py-1 rounded">Type: {lead.project_type || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Requested Services */}
          {lead.services && lead.services.length > 0 && (
            <div className="p-6 border border-border/30 bg-surface/10 rounded-xl flex flex-col gap-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary" /> Requested Services Interest
              </h2>
              <div className="flex flex-wrap gap-2 mt-1">
                {lead.services.map((srv: { id: string; title: string }) => (
                  <span key={srv.id} className="text-[10px] font-mono bg-surface/50 border border-border/15 px-3 py-1 rounded text-muted hover:text-foreground">
                    {srv.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Proposal Requests Section */}
          {lead.proposals && lead.proposals.length > 0 && (
            <div className="p-6 border border-border/30 bg-surface/10 rounded-xl flex flex-col gap-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2 border-b border-border/5 pb-3">
                <FileSpreadsheet className="w-4 h-4 text-primary" /> Active RFPs & Estimations ({lead.proposals.length})
              </h2>
              <div className="flex flex-col gap-4 divide-y divide-border/10">
                {lead.proposals.map((prp: { id: string; status: string; project_summary: string; preferred_budget: string | null; expected_start_date: string | null; estimated_duration: string | null; project_priority: string | null }) => (
                  <div key={prp.id} className="flex flex-col gap-3 pt-4 first:pt-0">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-foreground">RFP ID: {prp.id.slice(0, 8)}</span>
                      <span className="text-[10px] font-mono uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded">
                        {prp.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted/75 leading-relaxed bg-background/50 p-3 border border-border/10 rounded">
                      {prp.project_summary}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono text-muted/60">
                      <div>
                        <span className="block text-muted/30">BUDGET PREF</span>
                        <span className="text-foreground">{prp.preferred_budget || "N/A"}</span>
                      </div>
                      <div>
                        <span className="block text-muted/30">START DATE</span>
                        <span className="text-foreground">{prp.expected_start_date || "N/A"}</span>
                      </div>
                      <div>
                        <span className="block text-muted/30">DURATION</span>
                        <span className="text-foreground">{prp.estimated_duration || "N/A"}</span>
                      </div>
                      <div>
                        <span className="block text-muted/30">PRIORITY</span>
                        <span className="text-foreground">{prp.project_priority || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Section */}
          {lead.bookings && lead.bookings.length > 0 && (
            <div className="p-6 border border-border/30 bg-surface/10 rounded-xl flex flex-col gap-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2 border-b border-border/5 pb-3">
                <Calendar className="w-4 h-4 text-primary" /> Scheduled Meetings & Consultations ({lead.bookings.length})
              </h2>
              <div className="flex flex-col gap-3 divide-y divide-border/10">
                {lead.bookings.map((b: { id: string; booking_type: string; requested_date: string; requested_time: string; timezone: string; status: string }) => (
                  <div key={b.id} className="flex justify-between items-center pt-3 first:pt-0">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-foreground">{b.booking_type}</span>
                      <span className="text-[10px] font-mono text-muted/50 uppercase">
                        {b.requested_date} @ {b.requested_time} ({b.timezone})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest bg-surface border border-border/20 px-2.5 py-0.5 rounded text-muted">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Attachments */}
          <div className="p-6 border border-border/30 bg-surface/10 rounded-xl flex flex-col gap-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2 border-b border-border/5 pb-3">
              <Paperclip className="w-4 h-4 text-primary" /> Proposal Attachments ({filesWithUrls.length})
            </h2>
            {filesWithUrls.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filesWithUrls.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-background/50 border border-border/15 rounded text-xs">
                    <div className="flex items-center gap-2 text-muted">
                      <FileSpreadsheet className="w-4 h-4 text-primary" />
                      <span className="truncate max-w-[240px] font-mono">{file.filename}</span>
                      <span className="text-[9px] text-muted/30">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[9px] uppercase tracking-widest text-primary hover:underline border border-primary/20 bg-primary/5 px-3 py-1 rounded"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <span className="font-mono text-xs text-muted/40 py-2">No documents attached.</span>
            )}
          </div>
        </div>

        {/* Right column: internal notes & timelines */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Notes Log widget */}
          <NotesWidget leadId={lead.id!} initialNotes={lead.notes || []} />

          {/* Timeline tracker */}
          <div className="p-6 border border-border/30 bg-surface/10 rounded-xl flex flex-col gap-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2 border-b border-border/5 pb-3">
              <Activity className="w-4 h-4 text-primary animate-pulse" /> Timeline Events
            </h2>
            <div className="relative pl-4 border-l border-border/10 flex flex-col gap-6">
              {lead.timeline && lead.timeline.length > 0 ? (
                lead.timeline.map((item: { id: string; event_type: string; created_at: string; details?: Record<string, unknown> }) => (
                  <div key={item.id} className="relative flex flex-col gap-1">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-primary bg-background block" />
                    <span className="text-xs font-bold text-foreground/90">{item.event_type}</span>
                    <span className="text-[9px] font-mono text-muted/40 uppercase">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                    {item.details && Object.keys(item.details).length > 0 && (
                      <pre className="text-[9px] font-mono bg-background/50 border border-border/10 rounded p-2 overflow-x-auto text-muted/65 max-w-full">
                        {JSON.stringify(item.details, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              ) : (
                <span className="font-mono text-xs text-muted/40">No log triggers cataloged.</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
