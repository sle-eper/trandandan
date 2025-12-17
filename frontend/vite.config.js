import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,                   // allow docker access
    port: 5173,
    strictPort: true,
    allowedHosts: ["frontend", "localhost","nginx"],
    origin: "http://localhost:5173",  // allow docker hostname
     cors: {
      origin: ["http://localhost:5173", "http://frontend:5173"],
      credentials: true,
    },
  },
});
