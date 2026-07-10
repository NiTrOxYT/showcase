import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getPortalSession } from "@/lib/supabase/middleware";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function WorkspaceLayout({ children }: LayoutProps) {
  const headersList = await headers();
  const cookiesHeader = headersList.get("cookie") || "";
  
  const mockReq = {
    cookies: {
      getAll: () => {
        return cookiesHeader.split(";").map((c) => {
          const [name, ...val] = c.trim().split("=");
          return { name, value: val.join("=") };
        });
      },
      get: (name: string) => {
        const cookie = cookiesHeader.split(";").find((c) => c.trim().startsWith(`${name}=`));
        if (!cookie) return undefined;
        return { name, value: cookie.split("=")[1] };
      }
    }
  } as unknown as NextRequest;

  const session = await getPortalSession(mockReq);

  if (!session) {
    return redirect("/portal/login");
  }

  const notifications = await ClientPortalRepository.getNotifications(session.clientUserId, true);
  const unreadCount = notifications.length;

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-background">
      <PortalSidebar unreadCount={unreadCount} />
      <main className="flex-1 overflow-x-hidden p-6 md:p-10 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center border-b border-border/10 pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                [ Customer Workspace ]
              </span>
              <h2 className="font-mono text-lg font-bold text-foreground mt-1">Welcome back, {session.name}</h2>
            </div>
            <div className="text-right font-mono text-[10px] text-muted">
              <span>Account: {session.email}</span>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
