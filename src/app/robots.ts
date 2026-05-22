import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/privacy", "/terms", "/login", "/register"],
        disallow: ["/admin", "/api/", "/access-portal-admin"],
      },
    ],
    sitemap: "https://www.dailydosemcq.com/sitemap.xml",
    host: "https://www.dailydosemcq.com",
  };
}
