import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "ep-kit": resolve(__dirname, "../src/index"),
      "@": resolve(__dirname, "../src"),
    },
  },
});
