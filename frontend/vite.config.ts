import { defineConfig } from "vite";

// Build a single, self-contained ES module that registers <ha-adapt-panel>.
// The bundle (lit included) is written into the Python component so Home
// Assistant can serve it directly — no Node toolchain at install time.
export default defineConfig({
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
