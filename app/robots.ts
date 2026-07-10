import type { MetadataRoute } from "next";
import { getRobotsData } from "@/lib/seo/robots";

export default function robots(): MetadataRoute.Robots {
  return getRobotsData();
}
