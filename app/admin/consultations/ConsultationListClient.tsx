"use client";

import React, { useState, useMemo } from "react";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import type { ConsultationRequest } from "@/services/repositories/ConsultationRepository";
import {
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";

interface ConsultationListClientProps {
  initialConsultations: ConsultationRequest[];
}

const ITEMS_PER_PAGE = 10;

export function ConsultationListClient({ initialConsultations }: ConsultationListClientProps) {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>(initialConsultations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Compute live analytical counts
  const stats = useMemo(() => {
    return {
      total: consultations.length,
      pending: consultations.filter(c => c.status === "Pending").length,
      confirmed: consultations.filter(c => c.status === "Confirmed").length,
      completed: consultations.filter(c => c.status === "Completed").length,
      cancelled: consultations.filter(c => c.status === "Cancelled").length,
    };
  }, [consultations]);

  // Filtered consultations list
  const filteredConsultations = useMemo(() => {
    let result = [...consultations];

    // Search query check
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          (c.notes || "").toLowerCase().includes(q) ||
          c.reference_id.toLowerCase().includes(q)
      );
    }

    // Status filter mapping
    if (statusFilter !== "all") {
      result = result.filter(c => c.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Consultation Type mapping
    if (typeFilter !== "all") {
      result = result.filter(c => c.consultation_type.toLowerCase() === typeFilter.toLowerCase());
    }

    return result;
  }, [consultations, search, statusFilter, typeFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredConsultations.length / ITEMS_PER_PAGE) || 1;
  const paginatedConsultations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredConsultations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredConsultations, currentPage]);

  // Inline status updates handler
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setConsultations(prev =>
          prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (e) {
      console.error("Failed to communicate update:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  // CSV Export utility
  const handleExportCSV = () => {
    const headers = [
      "Reference ID",
      "Name",
      "Phone",
      "Consultation Type",
      "Address",
      "Preferred Date",
      "Preferred Time",
      "Notes",
      "Status",
      "Created At"
    ];

    const rows = filteredConsultations.map(c => [
      `"${c.reference_id}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone.replace(/"/g, '""')}"`,
      `"${c.consultation_type}"`,
      `"${(c.address || "").replace(/"/g, '""')}"`,
      `"${c.preferred_date}"`,
      `"${c.preferred_time}"`,
      `"${(c.notes || "").replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${c.created_at}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];
    
    link.setAttribute("href", url);
    link.setAttribute("download", `consultation-requests-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status style helper
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Confirmed":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "Completed":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      default:
        return "bg-muted/10 text-muted border border-muted/20";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Consultations Management ]
          </span>
          <Heading level={1} className="text-3xl font-black mt-2 tracking-tightest uppercase font-mono">
            CONSULTATION SYSTEM CONTROL
          </Heading>
          <Text className="text-muted/60 text-xs mt-1">
            Review request logs, configure status states, and export audit files.
          </Text>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredConsultations.length === 0}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-border/40 hover:border-foreground hover:bg-surface/10 rounded font-bold transition-all duration-300 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Requests", count: stats.total, icon: FileText, style: "text-foreground" },
          { label: "Pending", count: stats.pending, icon: AlertCircle, style: "text-amber-500" },
          { label: "Confirmed", count: stats.confirmed, icon: CheckCircle2, style: "text-blue-500" },
          { label: "Completed", count: stats.completed, icon: CheckCircle2, style: "text-emerald-500" },
          { label: "Cancelled", count: stats.cancelled, icon: XCircle, style: "text-red-500" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-4 border border-border/30 rounded bg-surface/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-muted/50">
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold">
                  {item.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${item.style}`} />
              </div>
              <span className="font-mono text-2xl font-black text-foreground">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md flex items-center border border-border/30 rounded bg-background/50 focus-within:border-primary transition-all duration-200">
          <Search className="w-4 h-4 absolute left-3 text-muted/40" />
          <input
            type="text"
            placeholder="Search by name, phone, notes or reference..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-transparent px-4 py-2.5 pl-10 text-xs focus:outline-none text-foreground placeholder:text-muted/30"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 border border-border/30 rounded bg-background/50 px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-muted/40" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-background text-foreground">All Statuses</option>
              <option value="pending" className="bg-background text-foreground">Pending</option>
              <option value="confirmed" className="bg-background text-foreground">Confirmed</option>
              <option value="completed" className="bg-background text-foreground">Completed</option>
              <option value="cancelled" className="bg-background text-foreground">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border border-border/30 rounded bg-background/50 px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-muted/40" />
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-background text-foreground">All Types</option>
              <option value="visit us" className="bg-background text-foreground">Visit Us</option>
              <option value="we visit you" className="bg-background text-foreground">We Visit You</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Telemetry Table */}
      <div className="border border-border/30 rounded bg-surface/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-border/20 bg-surface/10 font-mono text-[9px] uppercase tracking-widest text-muted/60 select-none">
                <th className="py-4 px-5 font-bold">Reference / Created</th>
                <th className="py-4 px-5 font-bold">Client</th>
                <th className="py-4 px-5 font-bold">Type</th>
                <th className="py-4 px-5 font-bold">Preferred Slot</th>
                <th className="py-4 px-5 font-bold">Address / Notes</th>
                <th className="py-4 px-5 font-bold">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {paginatedConsultations.length > 0 ? (
                paginatedConsultations.map((item) => (
                  <tr key={item.id} className="hover:bg-surface/5 transition-colors">
                    {/* Reference ID / Date */}
                    <td className="py-4 px-5">
                      <div className="font-mono text-primary font-bold">
                        {item.reference_id}
                      </div>
                      <div className="text-[10px] text-muted/45 mt-1 font-mono">
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </td>
                    
                    {/* Name & Phone */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-muted/50" /> {item.name}
                      </div>
                      <div className="text-muted/65 mt-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-muted/50" /> {item.phone}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted/70">
                        {item.consultation_type}
                      </span>
                    </td>

                    {/* Date / Time */}
                    <td className="py-4 px-5 font-sans">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Calendar className="w-3.5 h-3.5 text-muted/50" /> {item.preferred_date}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted/75 mt-1">
                        <Clock className="w-3.5 h-3.5 text-muted/50" /> {item.preferred_time}
                      </div>
                    </td>

                    {/* Address & Notes */}
                    <td className="py-4 px-5 max-w-xs">
                      {item.consultation_type === "We Visit You" ? (
                        <div className="flex items-start gap-1.5 text-muted/80">
                          <MapPin className="w-3.5 h-3.5 text-muted/50 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{item.address}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-muted/30 italic">N/A - Office Visit</span>
                      )}
                      {item.notes && (
                        <div className="text-[11px] text-muted/50 italic mt-1 border-t border-border/5 pt-1">
                          &quot;{item.notes}&quot;
                        </div>
                      )}
                    </td>

                    {/* Status inline edit */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        {updatingId === item.id ? (
                          <div className="flex items-center gap-2 text-muted">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> Updating...
                          </div>
                        ) : (
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider focus:outline-none cursor-pointer ${getStatusStyle(item.status)}`}
                          >
                            <option value="Pending" className="bg-background text-foreground">Pending</option>
                            <option value="Confirmed" className="bg-background text-foreground">Confirmed</option>
                            <option value="Completed" className="bg-background text-foreground">Completed</option>
                            <option value="Cancelled" className="bg-background text-foreground">Cancelled</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted/45 font-mono">
                    No matching consultation requests logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination control */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border/10 font-mono text-[10px] text-muted/50 uppercase select-none">
          <span>
            Page {currentPage} of {totalPages} ({filteredConsultations.length} records)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-border/30 rounded hover:border-foreground/50 hover:text-foreground transition-all disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-border/30 rounded hover:border-foreground/50 hover:text-foreground transition-all disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
