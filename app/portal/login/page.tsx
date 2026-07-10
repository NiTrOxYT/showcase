"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { Heading } from "@/components/typography/Heading";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authErr } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) {
        throw authErr;
      }

      if (data.session) {
        // Authenticated successfully! Verify if portal user profile is mapped
        // Route to portal root dashboard page
        router.push("/portal");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Invalid email or password";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 select-none">
      <div className="w-full max-w-md bg-surface/30 p-8 rounded-2xl border border-border/10 backdrop-blur-md flex flex-col gap-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-3 bg-primary/10 rounded-full text-primary animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <Heading level={2} className="text-xl font-bold font-mono tracking-widest mt-2 uppercase">
            ANNEX PORTAL
          </Heading>
          <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
            Secure client delivery workspace login
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-xs text-destructive text-center font-mono">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-muted text-[10px] uppercase font-bold">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="bg-background border border-border/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-muted text-[10px] uppercase font-bold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-background border border-border/10 rounded-lg p-3 text-foreground focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background font-bold p-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
