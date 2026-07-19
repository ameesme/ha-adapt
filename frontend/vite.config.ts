import { defineConfig } from "vite";

// Build a single, self-contained ES module that registers <sundial-panel>.
// The bundle (lit included) is written into the Python component so Home
// Assistant can serve it directly — no Node toolchain at install time.
//
// `npm run dev` instead serves the standalone dev harness (frontend/index.html
// + frontend/dev/), which runs the panel against an in-memory mock backend with
// fake lights — no Home Assistant needed. See README → Development.
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    host: true, // reachable from another device on the network
    open: true, // pop open the dev harness on start
  },
  build: {
    target: "es2021",
    outDir: "../custom_components/sundial/frontend/dist",
    emptyOutDir: true,
    lib: {
      entry: "src/sundial-panel.ts",
      formats: ["es"],
      fileName: () => "sundial-panel.js",
    },
    rollupOptions: {
      output: {
        // Keep everything in one file for a stable, cache-busted asset URL.
        inlineDynamicImports: true,
      },
    },
  },
});
