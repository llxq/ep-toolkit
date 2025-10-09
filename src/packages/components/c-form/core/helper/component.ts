import { isUndefined } from "lodash";

/**
 * 获取组件名称
 * @param component
 */
export const getComponentName = <T extends TObj>(component: T): string =>
  component.name || component.__name || "";

/**
 * 过滤组件的空属性
 * @param props
 */
export const filterComponentEmptyProps = <T extends TObj>(props: T): T => {
  const keys = Object.keys(props);
  return keys.reduce((prev: T, key) => {
    const value = Reflect.get(props, key);
    if (!isUndefined(value)) {
      Reflect.set(prev, key, value);
    }
    return prev;
  }, {} as T) as T;
};
