"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Service } from "@/types/service";
import { Heading } from "@/components/typography/Heading";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Globe,
} from "lucide-react";

interface ServiceListClientProps {
  initialServices: Service[];
}

export function ServiceListClient({ initialServices }: ServiceListClientProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Draft" | "Published">("All");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service page?")) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete service");
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting service. Please try again.");
    }
  };

  // Move service up/down to adjust sort order
  const handleSort = async (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= services.length) return;

    const listCopy = [...services];
    const temp = listCopy[index];
    listCopy[index] = listCopy[nextIndex];
    listCopy[nextIndex] = temp;

    // Reassign order metrics locally
    const updated = listCopy.map((s, idx) => ({ ...s, sortOrder: idx }));
    setServices(updated);

    // Call REST endpoints to persist order updates in DB
    try {
      await fetch(`/api/admin/services/${updated[index].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: updated[index].sortOrder }),
      });
      await fetch(`/api/admin/services/${updated[nextIndex].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: updated[nextIndex].sortOrder }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to persist order swaps:", err);
    }
  };

  const filtered = services
    .filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="flex flex-col gap-10 max-w-[1200px] mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/10 pb-6">
        <div>
          <Heading level={1} className="text-3xl font-black tracking-tightest">
            Service Landing Pages
          </Heading>
          <p className="text-xs font-mono uppercase tracking-widest text-muted mt-1.5">
            Commercial Money Pages Configuration
          </p>
        </div>
        <div>
          <Link
            href="/admin/services/new"
            className="flex items-center gap-2 bg-foreground text-background hover:bg-neutral-200 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 font-bold shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add New Service
          </Link>
        </div>
      </div>

      {/* Filters & search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/5 border border-border/15 p-4 rounded-xl">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted" />
          <input
            type="text"
            placeholder="Search service title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border/25 pl-10 pr-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Published", "Draft"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter as "All" | "Published" | "Draft")}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                statusFilter === filter
                  ? "bg-foreground text-background font-bold"
                  : "border border-border/20 hover:border-foreground hover:bg-surface/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table List */}
      <div className="border border-border/15 bg-surface/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-border/10 bg-surface/20 font-mono text-[9px] uppercase tracking-wider text-muted">
                <th className="p-4 font-bold">Sort</th>
                <th className="p-4 font-bold">Service Title</th>
                <th className="p-4 font-bold">URL Route</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Featured</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {filtered.map((service, idx) => (
                <tr key={service.id} className="hover:bg-surface/10 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSort(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 hover:bg-surface border border-transparent hover:border-border/20 rounded disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSort(idx, "down")}
                        disabled={idx === filtered.length - 1}
                        className="p-1 hover:bg-surface border border-transparent hover:border-border/20 rounded disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-neutral-200">{service.title}</span>
                      <span className="text-muted text-[11px] line-clamp-1">{service.shortDescription}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-neutral-400">
                    <Link
                      href={`/services/${service.slug}`}
                      target="_blank"
                      className="hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      /services/{service.slug}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        service.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
                      }`}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {service.featured ? (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                        <Sparkles className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted font-mono">No</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="p-1.5 hover:bg-surface border border-transparent hover:border-border/20 rounded text-muted hover:text-foreground transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1.5 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-muted hover:text-rose-400 rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center font-mono text-muted">
                    No services found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default ServiceListClient;
