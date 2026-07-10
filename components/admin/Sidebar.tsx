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
  Globe,
  Briefcase,
  FileText,
  BookOpen,
  Users,
  ArrowRightLeft,
  BarChart2,
  Calendar
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const navGroups = [
    {
      group: "Content",
      items: [
        { title: "Showcase", href: "/admin/projects", icon: FolderKanban },
        { title: "Case Studies", href: "/admin/case-studies", icon: FileText },
        { title: "Services", href: "/admin/services", icon: Briefcase },
        { title: "Blog", href: "/admin/blog", icon: BookOpen },
      ]
    },
    {
      group: "Marketing",
      items: [
        { title: "SEO", href: "/admin/seo", icon: Globe },
        { title: "Redirects", href: "/admin/redirects", icon: ArrowRightLeft },
      ]
    },
    {
      group: "Sales",
      items: [
        { title: "Leads", href: "/admin/leads", icon: Users },
        { title: "Bookings", href: "/admin/bookings", icon: Calendar },
        { title: "Proposals", href: "/admin/proposals", icon: FileText },
        { title: "Analytics", href: "/admin/analytics", icon: BarChart2 },
      ]
    }
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

  const isActiveLink = (href: string) => {
    return pathname === href || (href !== "/admin" && pathname.startsWith(href));
  };

  return (
    <aside
      className={cn(
        "h-screen border-r border-border/10 bg-background/80 backdrop-blur-md sticky top-0 flex flex-col justify-between py-6 transition-all duration-300 z-30 select-none",
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

        {/* Nav Items */}
        <nav className="flex flex-col gap-5">
          {/* Dashboard link (always at top) */}
          <div>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200",
                pathname === "/admin"
                  ? "bg-primary text-background font-bold shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                  : "text-muted hover:text-foreground hover:bg-surface/30"
              )}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </div>

          {/* Grouped links */}
          {navGroups.map((group) => (
            <div key={group.group} className="flex flex-col gap-1.5">
              {!collapsed && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted/30 px-3.5 select-none font-bold">
                  {group.group}
                </span>
              )}
              {collapsed && <hr className="border-border/5 my-1" />}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveLink(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200",
                        active
                          ? "bg-primary text-background font-bold shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                          : "text-muted hover:text-foreground hover:bg-surface/30"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Settings at bottom of list */}
          <div>
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200",
                isActiveLink("/admin/settings")
                  ? "bg-primary text-background font-bold shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                  : "text-muted hover:text-foreground hover:bg-surface/30"
              )}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Settings</span>}
            </Link>
          </div>
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
