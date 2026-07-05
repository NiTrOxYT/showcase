import React from "react";
import { cn } from "@/lib/cn";

interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
}

export const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  ({ className, as: Tag = "span", ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = Tag as any;
    return (
      <Component
        ref={ref}
        className={cn(
          "font-sans text-xs md:text-sm text-muted uppercase tracking-wider",
          className
        )}
        {...props}
      />
    );
  }
);

Caption.displayName = "Caption";
