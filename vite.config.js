import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { buildSitemapXml } from "./server/sitemap.js";
import { robotsTxtForDeploy } from "./server/robotsTxt.js";

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

function robotsPlugin() {
  return {
    name: "ingenio-robots",
    async closeBundle() {
      try {
        const body = robotsTxtForDeploy();
        await writeFile(path.join(rootDir, "dist", "robots.txt"), body);
      } catch (error) {
        this.warn(`robots.txt generation failed: ${error.message}`);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), sitemapPlugin(), robotsPlugin()],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
