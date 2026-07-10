/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "ANNEX Showcase";
    const description = searchParams.get("description") || siteConfig.description;
    const category = searchParams.get("category") || "Studio";
    const theme = searchParams.get("theme") || "dark";
    const coverImage = searchParams.get("coverImage");

    const isDark = theme === "dark";
    const bgColor = isDark ? "#0B0B0B" : "#FFFFFF";
    const textColor = isDark ? "#FFFFFF" : "#000000";
    const subtitleColor = isDark ? "#888888" : "#555555";
    const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: bgColor,
            padding: "80px",
            fontFamily: "sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Dynamic cover image backdrop if provided */}
          {coverImage && (
            <img
              src={coverImage}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: isDark ? 0.25 : 0.15,
              }}
              alt=""
            />
          )}

          {/* Ambient lighting overlay */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: isDark
                ? "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Top Bar: Eyebrow category */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isDark ? "#FFFFFF" : "#000000",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: textColor,
              }}
            >
              {category}
            </span>
          </div>

          {/* Middle Body: Dynamic Typography */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              maxWidth: "840px",
              zIndex: 10,
            }}
          >
            <h1
              style={{
                fontSize: title.length > 30 ? "54px" : "68px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: textColor,
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "20px",
                lineHeight: 1.5,
                color: subtitleColor,
                margin: 0,
                maxHeight: "90px",
                overflow: "hidden",
              }}
            >
              {description}
            </p>
          </div>

          {/* Bottom Footer Section */}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `1px solid ${borderColor}`,
              paddingTop: "32px",
              zIndex: 10,
            }}
          >
            {/* Logo */}
            <span
              style={{
                fontFamily: "sans-serif",
                fontWeight: 900,
                fontSize: "24px",
                letterSpacing: "0.15em",
                color: textColor,
              }}
            >
              ANNEX
            </span>
            {/* Tagline */}
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: subtitleColor,
              }}
            >
              Independent Digital Studio
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("OG Image generation failed:", error);
    return new Response("Failed to generate OG Image", { status: 500 });
  }
}
