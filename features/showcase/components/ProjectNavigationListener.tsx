"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProjectNavigationListenerProps {
  prevSlug: string | null;
  nextSlug: string | null;
}

export function ProjectNavigationListener({ prevSlug, nextSlug }: ProjectNavigationListenerProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing navigation shortcuts if the user is typing inside forms
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      if (e.key === "ArrowLeft" && prevSlug) {
        router.push(`/showcase/${prevSlug}`);
      } else if (e.key === "ArrowRight" && nextSlug) {
        router.push(`/showcase/${nextSlug}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlug, nextSlug, router]);

  return null;
}
