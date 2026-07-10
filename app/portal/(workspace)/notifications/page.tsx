"use client";

import React, { useState, useEffect } from "react";
import { Heading } from "@/components/typography/Heading";
import { Bell, Check, Loader2, CheckCircle2 } from "lucide-react";
import type { PortalNotification } from "@/types/portal";

export default function PortalNotificationsPage() {
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      setActioning(true);
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActioning(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 font-mono text-xs text-muted items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading notifications...
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <Heading level={1}>Notifications</Heading>
          <p className="text-xs text-muted font-mono mt-1">Review live delivery updates and sprint triggers.</p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={actioning}
            className="flex items-center gap-2 border border-border/10 hover:border-primary/20 bg-surface/50 text-foreground px-3.5 py-2 rounded-lg text-xs font-mono font-bold hover:bg-surface disabled:opacity-50 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/10 rounded-2xl bg-surface/10">
          <Bell className="w-8 h-8 text-muted/40 mb-3" />
          <p className="text-muted font-mono text-xs text-center">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl font-mono text-xs">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 border rounded-xl flex justify-between items-center gap-4 transition-all ${
                n.read 
                  ? "bg-surface/10 border-border/5 text-muted/60" 
                  : "bg-primary/5 border-primary/20 text-foreground"
              }`}
            >
              <div>
                <p className="font-bold">{n.title}</p>
                {n.description && <p className="text-[10px] text-muted mt-1 font-sans">{n.description}</p>}
                <span className="text-[9px] text-muted/40 mt-1 block">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="p-1.5 hover:bg-primary/10 hover:text-primary rounded text-muted transition-all"
                  title="Mark as read"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
