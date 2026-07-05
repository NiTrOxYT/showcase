import React from "react";
import { cn } from "@/lib/cn";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, as: Tag = "p", ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          "font-sans text-base text-foreground/80 leading-relaxed text-wrap-pretty max-w-[75ch]",
          className
        )}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";
