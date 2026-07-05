"use client";

import React, { useState, useEffect } from "react";
import { DeviceFrame } from "../device/DeviceFrame";
import type { GalleryItem } from "@/types/project";
import { Heading } from "@/components/typography/Heading";

interface ProjectGalleryProps {
  gallery: GalleryItem[];
}

export function ProjectGallery({ gallery }: ProjectGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIdx(null);
      } else if (e.key === "ArrowRight") {
        setSelectedIdx((prev) => (prev !== null && prev < gallery.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : gallery.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, gallery]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="flex flex-col gap-24 md:gap-36">
      <div className="flex flex-col gap-24 md:gap-36">
        {gallery
          .sort((a, b) => a.order - b.order)
          .map((item, index) => {
            const isFullWidth = index % 2 === 0;

            if (isFullWidth) {
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-6 group cursor-pointer w-full"
                  onClick={() => setSelectedIdx(index)}
                >
                  <DeviceFrame
                    src={item.image}
                    alt={item.alt}
                    device={item.device}
                    className="hover:scale-[1.01] transition-transform duration-700 ease-out"
                  />
                  <div className="text-center max-w-sm mx-auto">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest">[ {item.device} ]</span>
                    <Heading level={4} className="text-sm font-bold mt-1 text-muted/80 group-hover:text-foreground transition-colors duration-300">
                      {item.title}
                    </Heading>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center group cursor-pointer"
                  onClick={() => setSelectedIdx(index)}
                >
                  <div className="md:col-span-8">
                    <DeviceFrame
                      src={item.image}
                      alt={item.alt}
                      device={item.device}
                      className="hover:scale-[1.01] transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="md:col-span-4 flex flex-col justify-center border-l border-border/10 pl-6 h-full md:py-6">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest">[ {item.device} ]</span>
                    <Heading level={3} className="text-xl font-bold mt-2">
                      {item.title}
                    </Heading>
                    <p className="font-sans text-xs text-muted/70 mt-2 leading-relaxed">
                      {item.alt}
                    </p>
                  </div>
                </div>
              );
            }
          })}
      </div>

      {/* Lightbox Overlay */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col justify-between p-6 md:p-10">
          <div className="flex justify-between items-center w-full">
            <span className="font-mono text-xs text-muted">
              {selectedIdx + 1} / {gallery.length} · {gallery[selectedIdx].title}
            </span>
            <button
              onClick={() => setSelectedIdx(null)}
              className="font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground p-3"
            >
              Close [Esc]
            </button>
          </div>

          <div className="relative flex-1 w-full max-w-5xl mx-auto my-6 flex items-center justify-center">
            <DeviceFrame
              src={gallery[selectedIdx].image}
              alt={gallery[selectedIdx].alt}
              device={gallery[selectedIdx].device}
              priority
              className="max-h-[70vh] w-auto object-contain"
            />
          </div>

          <div className="flex justify-between items-center w-full max-w-md mx-auto">
            <button
              onClick={() =>
                setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : gallery.length - 1))
              }
              className="font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground p-3"
            >
              ← Prev
            </button>
            <span className="font-mono text-[10px] text-muted/40 uppercase tracking-widest">
              Use Arrow Keys to Navigate
            </span>
            <button
              onClick={() =>
                setSelectedIdx((prev) => (prev !== null && prev < gallery.length - 1 ? prev + 1 : 0))
              }
              className="font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground p-3"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
