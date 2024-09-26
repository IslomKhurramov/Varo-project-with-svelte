import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      "/api": {
        target: "https://119.65.247.158:9002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/asset/api"), // Rewrites /api to /asset/api
        secure: false, // Bypass SSL check for self-signed certificates
      },
    },
  },
});
