import React from "react";
import { cn } from "@/lib/cn";

export const Section = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("py-32 md:py-48 relative overflow-hidden", className)}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";
