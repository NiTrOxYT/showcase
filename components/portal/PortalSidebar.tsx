"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { 
  LayoutDashboard, FolderKanban, Bell, User, LogOut, ChevronLeft, ChevronRight, Sparkles 
} from "lucide-react";

interface PortalSidebarProps {
  unreadCount?: number;
}

export function PortalSidebar({ unreadCount = 0 }: PortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { title: "Dashboard", href: "/portal", icon: LayoutDashboard },
    { title: "Projects", href: "/portal/projects", icon: FolderKanban },
    { title: "Notifications", href: "/portal/notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { title: "Profile", href: "/portal/profile", icon: User },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/portal/logout", { method: "POST" });
      if (res.ok) {
        router.push("/portal/login");
        router.refresh();
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const isActiveLink = (href: string) => {
    return pathname === href || (href !== "/portal" && pathname.startsWith(href));
  };

  return (
    <aside
      className={cn(
        "h-screen border-r border-border/10 bg-background/85 backdrop-blur-md sticky top-0 flex flex-col justify-between py-6 transition-all duration-300 z-30 select-none",
        collapsed ? "w-16 px-2" : "w-64 px-4"
      )}
    >
      <div className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-100px)] no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between px-2">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-mono text-sm tracking-widest font-black text-foreground">
                ANNEX PORTAL
              </span>
            </div>
          )}
          {collapsed && <Sparkles className="w-5 h-5 text-primary mx-auto animate-pulse" />}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-surface/50 border border-border/20 rounded text-muted hover:text-foreground transition-all duration-200"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between py-2.5 px-3.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200",
                  active
                    ? "bg-primary text-background font-bold shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                    : "text-muted hover:text-foreground hover:bg-surface/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </div>
                {!collapsed && item.badge !== undefined && (
                  <span className="bg-primary text-background font-bold text-[9px] px-1.5 py-0.5 rounded-full shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className={cn(
          "flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-mono uppercase tracking-wider text-muted hover:text-destructive hover:bg-destructive/5 transition-all duration-200 text-left",
          collapsed && "justify-center"
        )}
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {!collapsed && <span>Sign Out</span>}
      </button>
    </aside>
  );
}
