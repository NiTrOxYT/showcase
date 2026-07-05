import React from "react";
import { cn } from "@/lib/cn";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: React.ElementType;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 1, as, ...props }, ref) => {
    const Tag = as || (`h${level}` as React.ElementType);

    const sizeClasses = {
      1: "text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tightest leading-tight",
      2: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tightest leading-tight",
      3: "text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-snug",
      4: "text-xl md:text-2xl font-semibold tracking-tight leading-snug",
      5: "text-lg md:text-xl font-semibold leading-normal",
      6: "text-base md:text-lg font-semibold leading-normal",
    };

    return (
      <Tag
        ref={ref}
        className={cn(
          "font-display text-foreground text-wrap-balance",
          sizeClasses[level],
          className
        )}
        {...props}
      />
    );
  }
);

Heading.displayName = "Heading";
