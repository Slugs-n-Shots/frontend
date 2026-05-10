import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: ["slugs-n-shots-frontend.test"],
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
      contexts: path.resolve(__dirname, "src/contexts"),
      lang: path.resolve(__dirname, "src/lang"),
      models: path.resolve(__dirname, "src/models"),
      routes: path.resolve(__dirname, "src/routes"),
      src: path.resolve(__dirname, "src"),
    },
  },
});
