import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Listen on all interfaces
    port: 5176,
  },
  optimizeDeps: {
    exclude: ["chunk-OEO6ATGZ.js", "chunk-CDH2GEAB.js", "chunk-KJ6VSRRT.js"],
  },
});
