import { defineConfig } from "vite";

// Build a single, self-contained ES module that registers <ha-adapt-panel>.
// The bundle (lit included) is written into the Python component so Home
// Assistant can serve it directly — no Node toolchain at install time.
//
// `npm run dev` instead serves the panel with hot-reload; point Home Assistant
// at it with HA_ADAPT_DEV_URL=http://localhost:5173/src/ha-adapt-panel.ts
// (see README → Development).
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    cors: true, // HA loads the module cross-origin from the dev server
  },
  build: {
    target: "es2021",
    outDir: "../custom_components/ha_adapt/frontend/dist",
    emptyOutDir: true,
    lib: {
      entry: "src/ha-adapt-panel.ts",
      formats: ["es"],
      fileName: () => "ha-adapt-panel.js",
    },
    rollupOptions: {
      output: {
        // Keep everything in one file for a stable, cache-busted asset URL.
        inlineDynamicImports: true,
      },
    },
  },
});
