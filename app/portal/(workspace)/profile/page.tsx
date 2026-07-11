"use client";

import React, { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { Heading } from "@/components/typography/Heading";
import { User, Lock, Loader2 } from "lucide-react";

export default function PortalProfilePage() {
  const [profile, setProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Password reset states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        // Look up public.client_users profile matching auth.users.id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: clientUser } = await (supabaseClient as any)
          .from("client_users")
          .select("name, email, role")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (clientUser) {
          setProfile({
            name: clientUser.name,
            email: clientUser.email,
            role: clientUser.role,
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    try {
      setUpdating(true);
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) throw error;
      setStatus({ type: "success", message: "Password updated successfully" });
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to update password";
      setStatus({ type: "error", message: msg });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 font-mono text-xs text-muted items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 select-none max-w-2xl">
      {/* Header */}
      <div className="pb-6 border-b border-border/10">
        <Heading level={1}>My Profile</Heading>
        <p className="text-xs text-muted font-mono mt-1">Manage portal account credentials and workspace roles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Profile Card */}
        {profile && (
          <div className="bg-surface/30 p-6 rounded-2xl border border-border/10 flex flex-col gap-6 font-mono text-xs">
            <h3 className="font-bold text-foreground border-b border-border/5 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Mapped Profile
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted/50 uppercase font-bold">Full Name</span>
                <span className="text-foreground font-bold">{profile.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted/50 uppercase font-bold">Email Address</span>
                <span className="text-foreground font-bold">{profile.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted/50 uppercase font-bold">Workspace Role</span>
                <span className="text-foreground font-bold capitalize">{profile.role}</span>
              </div>
            </div>
          </div>
        )}

        {/* Password update form */}
        <div className="bg-surface/30 p-6 rounded-2xl border border-border/10 flex flex-col gap-6 font-mono text-xs">
          <h3 className="font-bold text-foreground border-b border-border/5 pb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" /> Update Password
          </h3>

          {status && (
            <div className={`p-3 rounded-lg border text-center font-bold ${
              status.type === "success" 
                ? "bg-green-500/10 border-green-500/20 text-green-400" 
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-[10px] uppercase font-bold">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-[10px] uppercase font-bold">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="bg-primary text-background font-bold p-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {updating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
