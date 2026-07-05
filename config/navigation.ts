import type { NavItem } from "@/types/navigation";

export const navigationConfig = {
  mainNav: [
    { title: "Home", href: "/" },
    { title: "Showcase", href: "/showcase" },
    { title: "Process", href: "/#process" },
    { title: "Contact", href: "/contact" },
  ] as NavItem[],
  adminNav: [
    { title: "Dashboard", href: "/admin" },
    { title: "Projects", href: "/admin/projects" },
    { title: "Settings", href: "/admin/settings" },
  ] as NavItem[],
};
