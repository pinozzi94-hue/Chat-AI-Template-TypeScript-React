import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Freebuff runs the dev server in a managed session: bind to 0.0.0.0 and keep
// HMR disabled (the platform handles reloads).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    hmr: false,
  },
});
