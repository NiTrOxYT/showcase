"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Projects", href: "/admin/projects", icon: FolderKanban },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <aside
      className={cn(
        "h-screen border-r border-border/10 bg-background/80 backdrop-blur-md sticky top-0 flex flex-col justify-between py-6 transition-all duration-300 z-30 select-none",
        collapsed ? "w-16 px-2" : "w-64 px-4"
      )}
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between px-2">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-mono text-sm tracking-widest font-black text-foreground">
                ANNEX CMS
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

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200",
                  isActive
                    ? "bg-primary text-background font-bold shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                    : "text-muted hover:text-foreground hover:bg-surface/30"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
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
