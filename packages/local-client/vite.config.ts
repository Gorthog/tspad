import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.NODE_DEBUG": undefined,
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      // Enable polyfill plugins for rollup. vite uses rollup in production mode
      plugins: [nodePolyfills()],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins. vite uses esbuild only on dev mode
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});
