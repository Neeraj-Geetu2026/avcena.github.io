import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/avcena.github.io/",
  server: {
    proxy: {
      "/api": "http://localhost:3001"
    }
  }
});
