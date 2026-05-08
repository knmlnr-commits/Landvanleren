import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";

// Versie wordt afgeleid uit Vercel's commit SHA (in productie) of de
// lokale git short SHA (lokaal). Bij ontbreken: 'dev'.
function resolveVersion() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync("git rev-parse --short HEAD", {
      stdio: ["pipe", "pipe", "ignore"],
    }).toString().trim();
  } catch {
    return "dev";
  }
}

const VERSION = resolveVersion();
const BUILD_DATE = new Date().toISOString().slice(0, 10);

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: "dist", sourcemap: false },
  define: {
    __APP_VERSION__: JSON.stringify(VERSION),
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
  },
});
