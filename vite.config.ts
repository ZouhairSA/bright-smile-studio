import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/bright-smile-studio/",
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "index.vite.html"),
    },
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/backend": {
        target: "http://localhost",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/backend/, "/bright-smile-studio/backend"),
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
