"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Stack } from "@/components/layout/Stack";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Access denied.");
      }
    } catch {
      setError("Server connection failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center bg-background select-none">
      <Container className="max-w-md w-full">
        <div className="glassmorphism p-8 md:p-10 rounded-xl border border-border/80 shadow-2xl relative overflow-hidden">
          {/* Cybernetic Accent lights */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

          <form onSubmit={handleSubmit}>
            <Stack gap={6}>
              <div className="text-center">
                <span className="font-mono text-[9px] uppercase tracking-widest text-primary font-bold">
                  [ System Gateway ]
                </span>
                <Heading level={2} className="text-xl md:text-2xl font-bold tracking-tightest mt-2 uppercase font-mono">
                  ANNEX OPERATING OS
                </Heading>
                <Text className="text-muted/60 text-xs mt-1">
                  Secure administration interface portal.
                </Text>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted/60 font-medium">
                  Password Key
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter system access token..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-mono text-sm tracking-widest px-4 py-3 bg-surface/30 rounded border border-border/60 text-foreground focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all duration-300 w-full"
                />
              </div>

              {error && (
                <div className="text-center bg-destructive/10 border border-destructive/20 rounded p-2.5">
                  <span className="font-mono text-xs text-destructive font-semibold">
                    Error: {error}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="font-mono text-xs uppercase tracking-widest py-3 rounded bg-primary text-background hover:bg-primary/90 font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Establish Link"}
              </button>

              <div className="text-center">
                <span className="font-mono text-[9px] text-muted/40 uppercase tracking-wider">
                  * Unauthorized activities are recorded.
                </span>
              </div>
            </Stack>
          </form>
        </div>
      </Container>
    </main>
  );
}
