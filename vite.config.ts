import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base URL when the app is served from http://localhost/bright-smile-studio/
  // This ensures built asset paths work correctly under the Apache subfolder.
  base: "/bright-smile-studio/",
  build: {
    // Use a dedicated HTML entry for Vite builds so Apache can keep serving
    // the built `index.html` without breaking future `npm run build`.
    rollupOptions: {
      input: path.resolve(__dirname, "index.vite.html"),
    },
  },
  server: {
    host: "::",
    port: 8080,
    // Optional dev convenience:
    // When running `npm run dev`, proxy /backend/* to XAMPP Apache so that
    // fetch("/backend/login.php") works without CORS issues.
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
