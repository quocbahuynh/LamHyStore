import apiLinks from "@/utils/api-links";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/chinh-sach/",
        "/tim-kiem/",
        "/admin-signin",
        "/thanh-toan",
      ],
    },
    sitemap: `${apiLinks.domain.domain}/sitemap.xml`,
  };
}
