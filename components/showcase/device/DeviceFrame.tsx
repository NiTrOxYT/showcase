import React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface DeviceFrameProps {
  src: string;
  alt: string;
  device: "desktop" | "laptop" | "tablet" | "mobile" | "browser";
  priority?: boolean;
  className?: string;
}

export function DeviceFrame({ src, alt, device, priority = false, className }: DeviceFrameProps) {
  return (
    <div className={cn("relative w-full overflow-hidden transition-all duration-700", className)}>
      {device === "mobile" && (
        <div className="mx-auto w-full max-w-[280px] aspect-[9/19.5] border-8 border-border rounded-[2.5rem] relative bg-background shadow-2xl overflow-hidden">
          {/* Speaker notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-border rounded-full z-20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-background" />
          </div>
          {/* Content image */}
          <div className="absolute inset-0 z-10">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              priority={priority}
              className="object-cover"
            />
          </div>
        </div>
      )}

      {device === "laptop" && (
        <div className="mx-auto w-full max-w-[720px]">
          {/* Laptop Screen */}
          <div className="aspect-[16/10] border-[6px] border-border rounded-t-xl relative bg-background shadow-2xl overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              priority={priority}
              className="object-cover"
            />
          </div>
          {/* Keyboard Tray base base */}
          <div className="h-3 w-full bg-border rounded-b-xl border-t border-background/20 relative shadow-md">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-background/50 rounded-b-md" />
          </div>
        </div>
      )}

      {device === "desktop" && (
        <div className="mx-auto w-full max-w-[800px]">
          {/* Desktop Monitor screen */}
          <div className="aspect-[16/9] border-8 border-border rounded-lg relative bg-background shadow-2xl overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1200px) 100vw, 1000px"
              priority={priority}
              className="object-cover"
            />
          </div>
          {/* Monitor Neck & Stand base */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-8 bg-border" />
            <div className="w-32 h-1.5 bg-border rounded-t-sm shadow-md" />
          </div>
        </div>
      )}

      {device === "tablet" && (
        <div className="mx-auto w-full max-w-[420px] aspect-[4/3] border-[8px] border-border rounded-2xl relative bg-background shadow-2xl overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            priority={priority}
            className="object-cover"
          />
        </div>
      )}

      {device === "browser" && (
        <div className="w-full rounded-lg border border-border bg-background shadow-2xl overflow-hidden">
          {/* Browser Header Bar */}
          <div className="h-7 bg-surface/50 border-b border-border/60 flex items-center px-4">
            <div className="flex gap-1.5 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            {/* Fake Address bar */}
            <div className="mx-auto w-1/2 h-3.5 bg-background/60 rounded border border-border/30" />
          </div>
          {/* Content view */}
          <div className="aspect-[16/10] relative w-full overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1200px) 100vw, 1000px"
              priority={priority}
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
