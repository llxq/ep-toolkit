import type { App, Component, Plugin } from "vue";

export type TSFCWithInstall<T> = T & Plugin;

/**
 * 创建一个install
 * @param component
 * @param alias
 */
const createInstallFunction =
  <T extends Component>(component: T, alias?: string) =>
  (app: App) => {
    const name = alias || Reflect.get(component, "name");
    if (!name) {
      console.error("Component is missing a name and cannot be registered:", component);
      return;
    }
    app.component(name, component);
  };

/**
 * 组件注册
 * @param component
 * @param alias
 */
export const withInstallComponent = <T extends Component>(component: T, alias?: string): T => {
  (component as unknown as TSFCWithInstall<T>).install = createInstallFunction<T>(component, alias);

  return component as T;
};
