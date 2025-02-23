import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src/**/*"],
      exclude: [],
    }),
    tailwindcss(),
  ],

  build: {
    outDir: "dist",

    lib: {
      entry: resolve(__dirname, "src/v3/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `v3/index.${format === "es" ? "mjs" : "cjs"}`,
    },
    sourcemap: true,
    minify: false,
  },
});
