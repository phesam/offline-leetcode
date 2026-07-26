import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:4174"
    }
  },
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        systemDesign: resolve(__dirname, "system-design.html")
      }
    }
  }
});
