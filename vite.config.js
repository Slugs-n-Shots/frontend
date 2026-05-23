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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (/(node_modules\/)(react|react-dom|react-router-dom)\//.test(id)) {
            return "react";
          }

          if (/(node_modules\/)(bootstrap|react-bootstrap)\//.test(id)) {
            return "bootstrap";
          }

          if (/(node_modules\/)(@mui|@emotion)\//.test(id)) {
            return "mui";
          }

          if (id.includes("node_modules/react-markdown/")) {
            return "markdown";
          }

          if (/(node_modules\/)(axios|react-data-table-component)\//.test(id)) {
            return "data";
          }

          if (/(node_modules\/)(@fortawesome|react-icons|flag-icons)\//.test(id)) {
            return "icons";
          }
        },
      },
    },
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
