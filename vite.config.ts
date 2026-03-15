import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/n2-land/",
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
  },
});
