import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite';


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 8080,
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
  };
});
