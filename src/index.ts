import { installAll } from "@/helper/installAll.ts";
import pkg from "../package.json";

const installer = {
  install: installAll,
  version: pkg.version,
};

export { installer as default };

/**
 * 目前三个包的内容作为统一导出，暂时不考虑分包处理。
 */
export * from "@/packages/components";
export * from "@/packages/hooks";
export * from "@/packages/utils";
