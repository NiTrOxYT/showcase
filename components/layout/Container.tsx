import React from "react";
import { cn } from "@/lib/cn";

export const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12", className)}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";
