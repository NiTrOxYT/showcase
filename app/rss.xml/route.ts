import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { showcaseRepository } from "@/services/showcaseRepository";

export const dynamic = "force-dynamic";

interface RSSBlogItem {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  category?: string;
}

export async function GET() {
  const projects = await showcaseRepository.getProjects();
  
  // Dynamic placeholders for future blog releases
  const blogPosts: RSSBlogItem[] = []; 

  const items = [
    ...projects.map((project) => `
      <item>
        <title><![CDATA[${project.title} - ${project.subtitle}]]></title>
        <description><![CDATA[${project.shortDescription}]]></description>
        <link>${siteConfig.url}/showcase/${project.slug}</link>
        <guid isPermaLink="true">${siteConfig.url}/showcase/${project.slug}</guid>
        <pubDate>${project.completionDate ? new Date(project.completionDate).toUTCString() : new Date().toUTCString()}</pubDate>
        <category><![CDATA[${project.category}]]></category>
      </item>
    `),
    ...blogPosts.map((post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <description><![CDATA[${post.description}]]></description>
        <link>${siteConfig.url}/blog/${post.slug}</link>
        <guid isPermaLink="true">${siteConfig.url}/blog/${post.slug}</guid>
        <pubDate>${new Date(post.datePublished).toUTCString()}</pubDate>
        <category><![CDATA[${post.category || "Blog"}]]></category>
      </item>
    `)
  ].join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>
  `.trim();

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=18000",
    },
  });
}
