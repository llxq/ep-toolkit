import { installAll } from "@/helper/installAll.ts";
import pkg from "../package.json";

const installer = {
  install: installAll,
  version: pkg.version,
};

export { installer as default };

export * from "@/packages/components";
export * from "@/packages/hooks";
