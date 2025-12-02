import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,                   // allow docker access
    port: 5173,
    strictPort: true,
    allowedHosts: ["frontend", "localhost"], // allow docker hostname
  },
});
