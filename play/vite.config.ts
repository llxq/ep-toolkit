import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({ include: [/\.vue$/, /\.md$/] }), vueJsx()],
  resolve: {
    alias: {
      "ep-toolkit": resolve(__dirname, "../src/index"),
      "@": resolve(__dirname, "../src"),
      "@play": resolve(__dirname, "./src"),
    },
  },
});
