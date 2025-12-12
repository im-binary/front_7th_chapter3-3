import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const baseUrl = process.env.NODE_ENV === "production" ? "/front_7th_chapter3-3/" : "/";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: baseUrl,
  server: {
    proxy: {
      "/api": {
        // target: 'https://jsonplaceholder.typicode.com',
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
