import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { buildSitemapXml } from "./server/sitemap.js";
import { robotsTxtForDeploy } from "./server/robotsTxt.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const outputs = JSON.parse(readFileSync(path.join(rootDir, "amplify_outputs.json"), "utf8"));

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

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const dataApiUrl = String(env.VITE_API_URL || outputs?.custom?.dataApiUrl || "")
    .trim()
    .replace(/\/$/, "");
  const useApiProxy = command === "serve" && Boolean(dataApiUrl);
  const apiProxy = useApiProxy
    ? {
        "/api": {
          target: dataApiUrl,
          changeOrigin: true,
          timeout: 300_000,
          proxyTimeout: 300_000,
        },
      }
    : undefined;

  return {
    plugins: [react(), sitemapPlugin(), robotsPlugin()],
    envPrefix: ["VITE_"],
    define: {
      "import.meta.env.VITE_USE_API_PROXY": JSON.stringify(useApiProxy ? "1" : ""),
    },
    server: {
      port: 5173,
      proxy: apiProxy,
    },
    preview: {
      port: 4173,
      proxy: apiProxy,
    },
  };
});
