import React from "react";
import Link from "next/link";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { ConversionRepository } from "@/services/repositories/ConversionRepository";
import { Users, Search, Filter, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: {
    search?: string;
    status?: string;
    qualification?: string;
  };
}

export default async function LeadsAdminPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams || {};
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : "";
  const qualification = typeof resolvedParams.qualification === "string" ? resolvedParams.qualification : "";

  const leads = await ConversionRepository.getLeads({
    search: search || undefined,
    status: status || undefined,
    qualification: qualification || undefined,
  });

  const getQualificationColor = (q: string) => {
    if (q === "Hot") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (q === "Warm") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  const getStatusColor = (s: string) => {
    if (s === "Won") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (s === "Lost") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (s === "New") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
  };

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Sales Control ]
          </span>
          <Heading level={1} className="text-3xl font-black mt-2 tracking-tightest uppercase font-mono flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" /> Lead Registry
          </Heading>
          <Text className="text-muted/60 text-xs">
            Review incoming inquiries, qualifications, budgets, and manage individual lead profiles.
          </Text>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <form method="GET" className="p-4 border border-border/30 bg-surface/5 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono uppercase tracking-wider text-muted/60 font-bold">Search Keywords</label>
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-muted/40" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Name, email, company..."
              className="w-full pl-9 pr-3 py-2 bg-surface/20 border border-border/20 rounded text-xs text-foreground focus:outline-none focus:border-primary/40"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono uppercase tracking-wider text-muted/60 font-bold">Filter Status</label>
          <select
            name="status"
            defaultValue={status}
            className="w-full px-3 py-2 bg-surface/20 border border-border/20 rounded text-xs text-foreground focus:outline-none focus:border-primary/40 appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Contacted">Contacted</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Meeting Scheduled">Meeting Scheduled</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono uppercase tracking-wider text-muted/60 font-bold">Filter Qualification</label>
          <select
            name="qualification"
            defaultValue={qualification}
            className="w-full px-3 py-2 bg-surface/20 border border-border/20 rounded text-xs text-foreground focus:outline-none focus:border-primary/40 appearance-none"
          >
            <option value="">All Qualifications</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </select>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-widest py-2.5 px-4 bg-primary text-background hover:bg-primary/95 transition-all font-bold rounded shadow"
        >
          <Filter className="w-3.5 h-3.5" /> Filter Results
        </button>
      </form>

      {/* Table Container */}
      <div className="border border-border/20 bg-surface/5 rounded-lg overflow-hidden">
        {leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-border/20 bg-surface/10 font-mono text-[9px] uppercase tracking-widest text-muted/50">
                  <th className="py-3 px-4 font-bold">Name & Company</th>
                  <th className="py-3 px-4 font-bold">Email</th>
                  <th className="py-3 px-4 font-bold">Score</th>
                  <th className="py-3 px-4 font-bold">Qualification</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Budget / Timeline</th>
                  <th className="py-3 px-4 font-bold">Created At</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10 text-foreground/80">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{lead.full_name}</div>
                      {lead.company && <div className="text-[10px] text-muted/50 mt-0.5">{lead.company}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">{lead.email}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{lead.lead_score}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide border ${getQualificationColor(lead.qualification || "")}`}>
                        {lead.qualification}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide border ${getStatusColor(lead.status || "")}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] text-foreground/90">{lead.budget || "N/A"}</div>
                      <div className="text-[10px] text-muted/50 mt-0.5">{lead.timeline || "N/A"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-muted/50 font-mono text-[10px]">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-mono text-[10px] text-primary uppercase tracking-widest hover:underline border border-primary/20 bg-primary/5 px-3 py-1 rounded"
                      >
                        Workspace
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <Shield className="w-8 h-8 text-muted/30" />
            <span className="font-mono text-xs text-muted/50">No lead files found.</span>
          </div>
        )}
      </div>
    </div>
  );
}
