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
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          bootstrap: ["bootstrap", "react-bootstrap"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          markdown: ["react-markdown"],
          data: ["axios", "react-data-table-component"],
          icons: [
            "@fortawesome/fontawesome-svg-core",
            "@fortawesome/free-solid-svg-icons",
            "@fortawesome/react-fontawesome",
            "react-icons",
            "flag-icons",
          ],
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
