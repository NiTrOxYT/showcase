"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileSpreadsheet } from "lucide-react";

interface ProposalItem {
  id?: string;
  project_summary: string;
  preferred_budget?: string | null;
  estimated_duration?: string | null;
  project_priority?: string | null;
  status?: string;
  lead_id: string;
  lead?: {
    full_name: string;
    company?: string | null;
  };
}

interface Props {
  initialProposals: ProposalItem[];
}

export function ProposalsClient({ initialProposals }: Props) {
  const router = useRouter();
  const [proposals, setProposals] = useState<ProposalItem[]>(initialProposals);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (proposalId: string, nextStatus: string) => {
    setLoadingId(proposalId);
    try {
      const res = await fetch("/api/proposals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: proposalId,
          status: nextStatus,
        }),
      });

      if (res.ok) {
        setProposals((prev) =>
          prev.map((p) => (p.id === proposalId ? { ...p, status: nextStatus } : p))
        );
        router.refresh();
      } else {
        alert("Failed to update proposal status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error logging proposal status change.");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Accepted") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (status === "Rejected") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (status === "Reviewing") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20"; // Pending
  };

  return (
    <div className="border border-border/20 bg-surface/5 rounded-lg overflow-hidden select-none">
      {proposals.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-border/20 bg-surface/10 font-mono text-[9px] uppercase tracking-widest text-muted/50">
                <th className="py-3 px-4 font-bold">Client / Company</th>
                <th className="py-3 px-4 font-bold">Scope Summary</th>
                <th className="py-3 px-4 font-bold">Budget range</th>
                <th className="py-3 px-4 font-bold">Timeline / Priority</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10 text-foreground/80">
              {proposals.map((p) => (
                <tr key={p.id} className="hover:bg-surface/5 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-foreground">{p.lead?.full_name}</div>
                    {p.lead?.company && <div className="text-[10px] text-muted/50 mt-0.5">{p.lead?.company}</div>}
                  </td>
                  <td className="py-3.5 px-4 max-w-[280px]">
                    <p className="truncate font-sans text-xs text-foreground/90">{p.project_summary}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-primary">
                    {p.preferred_budget || "N/A"}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[11px] text-foreground/95">{p.estimated_duration || "N/A"}</div>
                    <div className="text-[10px] text-muted/50 mt-0.5 uppercase tracking-wide">Priority: {p.project_priority || "Medium"}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide border ${getStatusColor(p.status || "")}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id || "", e.target.value)}
                        disabled={loadingId === p.id}
                        className="px-2.5 py-1 bg-surface border border-border/20 rounded text-[10px] font-mono text-foreground focus:outline-none focus:border-primary/45 disabled:opacity-50 appearance-none uppercase pr-6 relative"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Accepted">Accept</option>
                        <option value="Rejected">Reject</option>
                      </select>
                      
                      <Link
                        href={`/admin/leads/${p.lead_id}`}
                        className="font-mono text-[9px] text-muted hover:text-foreground border border-border/20 bg-surface/30 px-2.5 py-1 rounded"
                      >
                        Details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
          <FileSpreadsheet className="w-8 h-8 text-muted/30" />
          <span className="font-mono text-xs text-muted/50">No RFP proposals requested.</span>
        </div>
      )}
    </div>
  );
}
