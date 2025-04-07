import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lamhy.Store",
    short_name: "Lamhy.Store",
    description: "LamHy.Store",
    start_url: "/admin",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#800020",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
