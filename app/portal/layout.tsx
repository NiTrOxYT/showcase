import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function PortalRootLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
