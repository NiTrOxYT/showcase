import React from "react";
import Image from "next/image";
import { safeSrc } from "@/lib/images";
import { siteConfig } from "@/config/site";

interface SeoImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SeoImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  className,
  style,
}: SeoImageProps) {
  // Enforce fallback alt text to ensure 100% SEO Compliance
  const resolvedAlt = alt?.trim() || `ANNEX - ${siteConfig.name}`;

  // Enforce secure asset path mapping
  const resolvedSrc = safeSrc(src) || "/images/logo.png";

  // Prevent Next.js sizing errors by resolving default values when not using fill
  const hasDimension = width !== undefined || height !== undefined;
  const resolvedWidth = !fill && !hasDimension ? 800 : width;
  const resolvedHeight = !fill && !hasDimension ? 500 : height;

  return (
    <Image
      src={resolvedSrc}
      alt={resolvedAlt}
      width={fill ? undefined : resolvedWidth}
      height={fill ? undefined : resolvedHeight}
      fill={fill}
      priority={priority}
      sizes={sizes || (fill ? "100vw" : undefined)}
      className={className}
      style={style}
      loading={priority ? undefined : "lazy"}
    />
  );
}
export default SeoImage;
