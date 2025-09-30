import type { TSFCWithInstall } from "@/helper/withInstall.ts";
import * as allComponents from "@/packages/components";
import type { App, Component, Plugin } from "vue";

export type TEpKitComponentKey = keyof typeof allComponents;

export interface IEpKitConfig {
  components?: TEpKitComponentKey[];
}

/**
 * 安装所有组件
 * @param app
 * @param config 配置
 */
export const installAll = (app: App, config?: IEpKitConfig) => {
  const installComponents = config?.components || Object.keys(allComponents);
  installComponents.forEach((componentKey) => {
    const plugin: TSFCWithInstall<Component> = Reflect.get(
      allComponents,
      componentKey,
    );
    if (plugin.install) {
      app.use(plugin as Plugin, config);
    } else {
      console.error(`组件${componentKey}不存在`);
    }
  });
};
