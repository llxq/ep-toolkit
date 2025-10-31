import * as process from "node:process";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "unplugin-dts/vite";
import pkg from "./package.json";
import { resolve } from "node:path";
import { vitePluginGenGlobalComponentsDts } from "./scripts/vitePluginGenGlobalComponentsDts.ts";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      tsconfigPath: "./tsconfig.json",
      bundleTypes: true,
      aliases: {
        // 增加解析规则，否则可能会导致生成的路径不对导致合并声明失败。
        "@": resolve(__dirname, "./src"),
      },
      outDirs: "./dist/es",
    }),
    vitePluginGenGlobalComponentsDts(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "EpKit",
      fileName: (format) => `${format}/index.js`,
      // dev 模式下只需要 esm
      formats: isDev ? ["es"] : ["es", "umd", "iife"],
    },
    emptyOutDir: true,
    rollupOptions: {
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          "element-plus": "ElementPlus",
          "vue-router": "VueRouter",
          dayjs: "dayjs",
          "@element-plus/icons-vue": "iconsVue",
          lodash: "_",
          "vue-draggable-plus": "vueDraggablePlus",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.names.includes("ep-toolkit.css")) {
            return "index.css";
          }
          return "assets/[name].[ext]";
        },
      },
      external: Object.keys(pkg.dependencies).filter(
        (dep) => !["lodash", "emoji-regex", "vue-draggable-plus"].includes(dep),
      ),
    },
  },
});
