import { defineConfig } from "vite";

// Explicit Vite configuration. Defaults suit this client-only app; this file
// records the dev-server port and the build output directory.
export default defineConfig({
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});
