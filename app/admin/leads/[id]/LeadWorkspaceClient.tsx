"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Plus, UserPlus, RefreshCw } from "lucide-react";

interface Props {
  leadId: string;
  currentStatus: string;
}

export function LeadWorkspaceClient({ leadId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [converting, setConverting] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value;
    setUpdating(true);
    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          action: "update_status",
          status: nextStatus,
        }),
      });

      if (res.ok) {
        setStatus(nextStatus);
        router.refresh();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during status update.");
    } finally {
      setUpdating(false);
    }
  };

  const handleConvert = async () => {
    try {
      setConverting(true);
      const res = await fetch(`/api/clients/${leadId}/convert`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Conversion failed");
      const { client } = await res.json();
      router.push(`/admin/clients/${client.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to convert lead to client.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {status === "Won" && (
        <button
          onClick={handleConvert}
          disabled={converting}
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded text-xs font-mono font-bold hover:opacity-90 disabled:opacity-50 transition-all select-none"
        >
          {converting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <UserPlus className="w-3.5 h-3.5" />
          )}
          Convert to Client
        </button>
      )}

      <div className="flex items-center gap-3">
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Pipeline Status</span>
        <div className="relative">
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={updating}
            className="px-3.5 py-2 bg-surface border border-border/20 rounded text-xs text-foreground font-mono focus:outline-none focus:border-primary/45 disabled:opacity-50 appearance-none uppercase tracking-wider pr-8"
          >
            <option value="New">New</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Contacted">Contacted</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Meeting Scheduled">Meeting Scheduled</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
            <option value="Archived">Archived</option>
          </select>
          <div className="absolute right-3 top-3.5 pointer-events-none w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-muted/60" />
        </div>
      </div>
    </div>
  );
}

interface NoteItem {
  id: string;
  note: string;
  created_at: string;
}

interface NotesProps {
  leadId: string;
  initialNotes: NoteItem[];
}

export function NotesWidget({ leadId, initialNotes }: NotesProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: leadId,
          action: "add_note",
          note: newNote.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.note) {
        setNotes((prev) => [data.note, ...prev]);
        setNewNote("");
        router.refresh();
      } else {
        alert("Failed to submit note.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred logging note.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 border border-border/30 bg-surface/10 rounded-xl flex flex-col gap-4">
      <h2 className="text-xs font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2 border-b border-border/5 pb-3">
        <MessageSquare className="w-4 h-4 text-primary" /> Internal Notes Log
      </h2>

      {/* Note input form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add comments or status log updates..."
          rows={3}
          className="w-full px-3 py-2 bg-background border border-border/20 rounded text-xs text-foreground focus:outline-none focus:border-primary/40 resize-none font-sans"
        />
        <button
          type="submit"
          disabled={submitting || !newNote.trim()}
          className="flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-widest py-2 px-4 bg-primary text-background hover:bg-primary/95 transition-all font-bold rounded shadow disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" /> {submitting ? "Saving..." : "Add Note"}
        </button>
      </form>

      {/* Notes list */}
      <div className="flex flex-col gap-3 mt-2 overflow-y-auto max-h-[360px] pr-1">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="p-3 bg-background/50 border border-border/10 rounded text-xs flex flex-col gap-2">
              <p className="text-foreground/80 leading-relaxed font-sans white-space-pre-wrap">{note.note}</p>
              <div className="flex justify-between items-center text-[9px] font-mono text-muted/40 uppercase">
                <span>By Admin</span>
                <span>{new Date(note.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <span className="font-mono text-xs text-muted/40 py-2">No comments logged yet.</span>
        )}
      </div>
    </div>
  );
}

// Bind Notes widget as sub-property to keep import clean
LeadWorkspaceClient.Notes = NotesWidget;
