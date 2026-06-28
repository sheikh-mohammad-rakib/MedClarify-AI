import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Dev-only proxy to bypass CORS restrictions on
    // generativelanguage.googleapis.com's Interactions API endpoint.
    // In dev, /api/gemini/* is forwarded to the real Google endpoint.
    // In production on Firebase Hosting, configure a rewrite in
    // firebase.json to point /api/gemini at a Cloud Function — no
    // client-side changes needed because the SDK is already routed
    // through this prefix.
    proxy: {
      "/api/gemini": {
        target: "https://generativelanguage.googleapis.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/gemini/, ""),
      },
    },
  },
})
