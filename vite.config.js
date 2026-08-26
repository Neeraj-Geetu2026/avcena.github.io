import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/avcena.github.io/",
  server: {
    proxy: {
      "/api": "http://localhost:3001"
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        about: resolve(process.cwd(), "about.html")
      }
    }
  }
});
