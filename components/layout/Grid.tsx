import React from "react";
import { cn } from "@/lib/cn";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12;
  colsSm?: 1 | 2 | 3 | 4 | 6;
  colsMd?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  colsLg?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  dense?: boolean;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, colsSm, colsMd, colsLg, gap = 4, dense = false, ...props }, ref) => {
    const colClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      8: "grid-cols-8",
      12: "grid-cols-12",
    };

    const colSmClasses = {
      1: "sm:grid-cols-1",
      2: "sm:grid-cols-2",
      3: "sm:grid-cols-3",
      4: "sm:grid-cols-4",
      6: "sm:grid-cols-6",
    };

    const colMdClasses = {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      6: "md:grid-cols-6",
      8: "md:grid-cols-8",
      12: "md:grid-cols-12",
    };

    const colLgClasses = {
      1: "lg:grid-cols-1",
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      6: "lg:grid-cols-6",
      8: "lg:grid-cols-8",
      12: "lg:grid-cols-12",
    };

    const gapClasses = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          colClasses[cols],
          colsSm && colSmClasses[colsSm],
          colsMd && colMdClasses[colsMd],
          colsLg && colLgClasses[colsLg],
          gapClasses[gap],
          dense && "grid-flow-dense",
          className
        )}
        {...props}
      />
    );
  }
);

Grid.displayName = "Grid";
