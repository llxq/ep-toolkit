import { readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

/**
 * 转换组件名称
 * @param name
 */
const convertComponentName = (name: string) => {
  return name
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join("");
};

/**
 * 生成全局组件的dts
 */
export const vitePluginGenGlobalComponentsDts = () => {
  return {
    name: "vite-plugin-gen-global-components-dts",
    enforce: "post",
    closeBundle() {
      const componentNames = readdirSync(
        resolve(__dirname, "../src/packages/components"),
        {
          withFileTypes: true,
        },
      ).reduce<string[]>((result, dir) => {
        if (dir.isDirectory()) {
          result.push(convertComponentName(dir.name));
        }
        return result;
      }, []);
      const isDev = process.env.NODE_ENV === "development";
      const writePath = resolve(
        __dirname,
        isDev
          ? "../play/src/types/global.components.d.ts"
          : "../dist/global.components.d.ts",
      );
      writeFileSync(
        writePath,
        `declare module "vue" {
  export interface GlobalComponents {
    ${componentNames
      .map((name, index) => {
        return `${index ? " ".repeat(4) : ""}${name}: (typeof import("ep-kit"))["${name}"]`;
      })
      .join("\n")}
  }
}\n
export {};\n`,
      );
    },
  } as Plugin;
};
