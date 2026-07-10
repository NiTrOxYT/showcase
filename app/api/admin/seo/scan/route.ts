import { NextResponse } from "next/server";
import { showcaseRepository } from "@/services/showcaseRepository";

export const dynamic = "force-dynamic";

interface ImageIssue {
  src: string;
  missingAlt: boolean;
  missingDimensions: boolean;
}

interface PageReport {
  path: string;
  score: number;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  hasSchema: boolean;
  h1Count: number;
  h2Count: number;
  imageIssues: ImageIssue[];
  warnings: string[];
  recommendations: string[];
}

export async function GET(req: Request) {
  try {
    const origin = new URL(req.url).origin;

    // Get showcase projects to scan dynamically
    const projects = await showcaseRepository.getProjects();
    const projectPaths = projects.map((p) => `/showcase/${p.slug}`);

    const pathsToScan = [
      "/",
      "/showcase",
      "/book-call",
      ...projectPaths,
    ];

    const reports: PageReport[] = [];

    for (const path of pathsToScan) {
      const url = `${origin}${path}`;
      const warnings: string[] = [];
      const recommendations: string[] = [];
      let score = 100;

      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "ANNEX-SEO-QA-Bot",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          reports.push({
            path,
            score: 0,
            title: "",
            description: "",
            canonical: "",
            ogTitle: "",
            ogDescription: "",
            ogImage: "",
            twitterTitle: "",
            hasSchema: false,
            h1Count: 0,
            h2Count: 0,
            imageIssues: [],
            warnings: [`Page returned status code ${res.status}`],
            recommendations: ["Check routing configs or database rows"],
          });
          continue;
        }

        const html = await res.text();

        // 1. Meta validation
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : "";
        if (!title) {
          warnings.push("Missing HTML <title> tag");
          score -= 20;
        } else {
          // Check standard title length boundaries (50-60 chars)
          const cleanTitle = title.replace(/\s*\|\s*ANNEX/i, "");
          if (cleanTitle.length < 50 || cleanTitle.length > 60) {
            recommendations.push(`Title length is ${cleanTitle.length} characters (recommended 50-60 chars)`);
            score -= 5;
          }
        }

        const descMatch =
          html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i) ||
          html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i);
        const description = descMatch ? descMatch[1].trim() : "";
        if (!description) {
          warnings.push("Missing meta description");
          score -= 20;
        } else if (description.length < 140 || description.length > 160) {
          recommendations.push(`Description length is ${description.length} characters (recommended 140-160 chars)`);
          score -= 5;
        }

        // 2. Canonical URL validation
        const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i);
        const canonical = canonicalMatch ? canonicalMatch[1].trim() : "";
        if (!canonical) {
          warnings.push("Missing canonical link alternate");
          score -= 10;
        }

        // 3. Open Graph social validations
        const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i);
        const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : "";
        const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i);
        const ogDescription = ogDescMatch ? ogDescMatch[1].trim() : "";
        const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
        const ogImage = ogImageMatch ? ogImageMatch[1].trim() : "";

        if (!ogImage) {
          warnings.push("Missing Open Graph metadata image preview");
          score -= 10;
        }

        const twTitleMatch = html.match(/<meta[^>]*name="twitter:title"[^>]*content="([^"]*)"/i);
        const twitterTitle = twTitleMatch ? twTitleMatch[1].trim() : "";

        // 4. Structured Data checks
        const hasSchema = /<script[^>]*type="application\/ld\+json"[^>]*>/i.test(html);
        if (!hasSchema) {
          warnings.push("Missing JSON-LD structured data schemas");
          score -= 15;
        }

        // 5. Headings validation
        const h1s = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
        const h1Count = h1s.length;
        if (h1Count === 0) {
          warnings.push("Missing H1 heading node");
          score -= 10;
        } else if (h1Count > 1) {
          warnings.push(`Multiple H1 headings detected (${h1Count} found)`);
          score -= 10;
        }

        const h2s = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
        const h2Count = h2s.length;
        if (h2Count === 0) {
          recommendations.push("No H2 headings found (structure layout hierarchy could be improved)");
          score -= 5;
        }

        // 6. Image audits
        const imgTags = html.match(/<img[^>]*>/gi) || [];
        const imageIssues: ImageIssue[] = [];
        let missingAltCount = 0;
        let missingDimCount = 0;

        for (const tag of imgTags) {
          const srcM = tag.match(/src="([^"]*)"/i);
          const src = srcM ? srcM[1] : "";
          if (!src) continue;

          // Check alt
          const altM = tag.match(/alt="([^"]*)"/i);
          const alt = altM ? altM[1] : "";
          const missingAlt = !alt || alt.trim() === "";

          // Check dimensions
          const widthM = tag.match(/width="([^"]*)"/i) || tag.match(/width={[^}]+}/i);
          const heightM = tag.match(/height="([^"]*)"/i) || tag.match(/height={[^}]+}/i);
          const fillM = tag.match(/fill[=\s]/i);
          const missingDimensions = !fillM && (!widthM || !heightM);

          if (missingAlt || missingDimensions) {
            imageIssues.push({ src, missingAlt, missingDimensions });
            if (missingAlt) missingAltCount++;
            if (missingDimensions) missingDimCount++;
          }
        }

        if (missingAltCount > 0) {
          warnings.push(`${missingAltCount} images are missing descriptive alt tag attributes`);
          score -= Math.min(15, missingAltCount * 5);
        }
        if (missingDimCount > 0) {
          recommendations.push(`${missingDimCount} images are missing width/height dimension configurations`);
          score -= Math.min(10, missingDimCount * 2);
        }

        // Ensure bounds on computed score
        const finalScore = Math.max(0, score);

        reports.push({
          path,
          score: finalScore,
          title,
          description,
          canonical,
          ogTitle,
          ogDescription,
          ogImage,
          twitterTitle,
          hasSchema,
          h1Count,
          h2Count,
          imageIssues,
          warnings,
          recommendations,
        });

      } catch (err) {
        console.error(`Error scanning path ${path}:`, err);
        reports.push({
          path,
          score: 0,
          title: "",
          description: "",
          canonical: "",
          ogTitle: "",
          ogDescription: "",
          ogImage: "",
          twitterTitle: "",
          hasSchema: false,
          h1Count: 0,
          h2Count: 0,
          imageIssues: [],
          warnings: [`Fetch failure: ${(err as Error).message}`],
          recommendations: ["Check dev server status"],
        });
      }
    }

    // Compute averages
    const totalPages = reports.length;
    const avgScore = Math.round(reports.reduce((acc, curr) => acc + curr.score, 0) / totalPages) || 0;
    const missingMetadata = reports.filter((r) => !r.title || !r.description).length;
    const missingOgImage = reports.filter((r) => !r.ogImage).length;
    const missingSchema = reports.filter((r) => !r.hasSchema).length;
    const missingAlt = reports.filter((r) => r.imageIssues.some((i) => i.missingAlt)).length;
    const missingCanonical = reports.filter((r) => !r.canonical).length;

    const summary = {
      totalPages,
      indexedPages: totalPages, // Manual placeholder matches request
      missingMetadata,
      missingOgImage,
      missingSchema,
      missingAlt,
      missingCanonical,
      brokenLinks: 0,
      brokenImages: 0,
      averageScore: avgScore,
    };

    return NextResponse.json({ summary, pages: reports });
  } catch (error) {
    console.error("SEO audit scanner route error:", error);
    return NextResponse.json({ error: "SEO scan operation failed" }, { status: 500 });
  }
}
