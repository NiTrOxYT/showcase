"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

interface BookingItem {
  id?: string;
  booking_type: string;
  requested_date: string;
  requested_time: string;
  timezone: string;
  status?: string;
  lead_id: string;
  lead?: {
    id?: string;
    full_name: string;
    company?: string | null;
    clients?: { id: string }[];
  };
}

interface Props {
  initialBookings: BookingItem[];
}

export function BookingsClient({ initialBookings }: Props) {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (bookingId: string, nextStatus: string) => {
    setLoadingId(bookingId);
    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: bookingId,
          status: nextStatus,
        }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: nextStatus } : b))
        );
        router.refresh();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error logging booking status.");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Confirmed") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (status === "Completed") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (status === "Cancelled") return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20"; // Pending
  };

  return (
    <div className="border border-border/20 bg-surface/5 rounded-lg overflow-hidden select-none">
      {bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-border/20 bg-surface/10 font-mono text-[9px] uppercase tracking-widest text-muted/50">
                <th className="py-3 px-4 font-bold">Client Name</th>
                <th className="py-3 px-4 font-bold">Meeting Type</th>
                <th className="py-3 px-4 font-bold">Schedule Slot</th>
                <th className="py-3 px-4 font-bold">Timezone</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10 text-foreground/80">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-surface/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{b.lead?.full_name}</div>
                    {b.lead?.company && <div className="text-[10px] text-muted/50 mt-0.5">{b.lead?.company}</div>}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded">
                      {b.booking_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[11px] font-bold text-foreground/95">{b.requested_date}</div>
                    <div className="text-[10px] text-muted/50 mt-0.5">{b.requested_time}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-muted/50">{b.timezone}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide border ${getStatusColor(b.status || "")}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id || "", e.target.value)}
                        disabled={loadingId === b.id}
                        className="px-2.5 py-1 bg-surface border border-border/20 rounded text-[10px] font-mono text-foreground focus:outline-none focus:border-primary/45 disabled:opacity-50 appearance-none uppercase pr-6 relative"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirm</option>
                        <option value="Completed">Complete</option>
                        <option value="Cancelled">Cancel</option>
                      </select>
                      
                      {(() => {
                        const linkedClient = b.lead?.clients?.[0];
                        if (linkedClient?.id) {
                          return (
                            <Link
                              href={`/admin/clients/${linkedClient.id}`}
                              className="font-mono text-[9px] text-muted hover:text-foreground border border-border/20 bg-surface/30 px-2.5 py-1 rounded"
                            >
                              Profile
                            </Link>
                          );
                        }
                        if (b.lead_id || b.lead?.id) {
                          return (
                            <Link
                              href={`/admin/leads/${b.lead_id || b.lead?.id}`}
                              className="font-mono text-[9px] text-muted hover:text-foreground border border-border/20 bg-surface/30 px-2.5 py-1 rounded"
                            >
                              Profile
                            </Link>
                          );
                        }
                        return (
                          <span
                            className="font-mono text-[9px] text-muted/40 border border-border/10 bg-surface/10 px-2.5 py-1 rounded cursor-not-allowed select-none"
                          >
                            No Profile
                          </span>
                        );
                      })()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
          <Calendar className="w-8 h-8 text-muted/30" />
          <span className="font-mono text-xs text-muted/50">No consultation bookings scheduled.</span>
        </div>
      )}
    </div>
  );
}
