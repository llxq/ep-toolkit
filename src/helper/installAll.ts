import type { TSFCWithInstall } from "@/helper/withInstall.ts";
import * as allComponents from "@/packages/components";
import { initEpKitDirectives } from "@/packages/directives";
import type { App, Component, Plugin } from "vue";

export type TEpKitComponentKey = keyof typeof allComponents;

export interface IEpKitConfig {
  /**
   * 需要安装的组件
   * @default Object.keys(allComponents)
   */
  components?: TEpKitComponentKey[];
  /**
   * 是否注入自定义指令
   * @default true
   */
  injectDirective?: boolean;
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
  const injectDirective = config?.injectDirective ?? true;
  if (injectDirective) {
    app.use(initEpKitDirectives);
  }
};
