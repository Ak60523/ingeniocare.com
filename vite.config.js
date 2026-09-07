import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { buildSitemapXml } from "./server/sitemap.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function sitemapPlugin() {
  return {
    name: "ingenio-sitemap",
    async closeBundle() {
      try {
        const xml = await buildSitemapXml();
        await writeFile(path.join(rootDir, "dist", "sitemap.xml"), xml);
      } catch (error) {
        this.warn(`sitemap generation failed: ${error.message}`);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), sitemapPlugin()],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
