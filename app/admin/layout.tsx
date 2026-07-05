import React from "react";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-y-auto px-6 py-10 md:px-12 md:py-12">
        {children}
      </main>
    </div>
  );
}
