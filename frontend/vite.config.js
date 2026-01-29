import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,                   // allow docker access
    port: 8443,
    strictPort: true,
    allowedHosts: ["frontend", "localhost","nginx"],
    origin: "https://10.14.3.2:8443",  // allow docker hostname
     cors: {
      origin: ["https://10.14.3.2:8443", "http://frontend:8443"],
      credentials: true,
    },
  },
});
