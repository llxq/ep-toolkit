import { installAll } from "@/helper/installAll.ts";
import pkg from "../package.json";

const installer = {
  install: installAll,
  version: pkg.version,
};

export { installer as default };

/**
 * 暂时不考虑分包处理。
 */
export * from "@/packages/components";
export * from "@/packages/components/help.exports.ts";
export * from "@/packages/hooks";
export * from "@/packages/utils";
export * from "@/packages/directives";
// 配置服务
export * from "@/packages/store/config/index.service.ts";
