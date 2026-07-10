import React from "react";
import Link from "next/link";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Users, Search, Plus, ArrowUpRight } from "lucide-react";
import type { Client } from "@/types/portal";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function ClientsAdminPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search ?? "";
  const status = resolvedParams.status ?? "";

  const clients = await ClientPortalRepository.getClients({
    search: search || undefined,
    status: status || undefined,
  });

  const getStatusColor = (s: string) => {
    if (s === "Active") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (s === "Inactive") return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    return "bg-red-500/10 text-red-400 border-red-500/20"; // Churned
  };

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Portal Accounts ]
          </span>
          <Heading level={1} className="mt-2">Clients Registry</Heading>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <form method="GET" className="flex flex-wrap items-center gap-4 bg-surface/30 p-4 rounded-xl border border-border/10">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search clients..."
            className="w-full bg-background border border-border/10 rounded-lg py-2 pl-10 pr-4 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-mono"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select
            name="status"
            defaultValue={status}
            className="bg-background border border-border/10 rounded-lg py-2 px-3 text-xs text-muted focus:outline-none focus:border-primary/50 transition-all font-mono"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Churned">Churned</option>
          </select>
          <button
            type="submit"
            className="bg-primary text-background px-4 py-2 rounded-lg text-xs font-mono font-bold hover:opacity-90 transition-all"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Grid List */}
      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/10 rounded-2xl bg-surface/10">
          <Users className="w-8 h-8 text-muted/40 mb-3" />
          <Text className="text-muted font-mono text-xs text-center">No clients registered matching criteria.</Text>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client: Client) => {
            const userCount = client.client_users?.length ?? 0;
            const projectCount = client.delivery_projects?.length ?? 0;
            
            return (
              <div
                key={client.id}
                className="group relative flex flex-col justify-between bg-surface/30 hover:bg-surface/50 border border-border/10 hover:border-primary/20 rounded-2xl p-6 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <h3 className="font-mono text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {client.company_name}
                  </h3>

                  <div className="mt-4 flex flex-col gap-2 border-t border-border/5 pt-4">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-muted">Contact:</span>
                      <span className="text-foreground truncate max-w-[150px]">{client.primary_contact || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-muted">Email:</span>
                      <span className="text-foreground truncate max-w-[150px]">{client.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-border/5 pt-4 flex justify-between items-center text-[10px] font-mono text-muted">
                  <span>{projectCount} Project(s)</span>
                  <span>{userCount} Portal User(s)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
