import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/avcena.github.io/",
  server: {
    proxy: {
      "/api": "http://localhost:3001"
    }
  }
});
