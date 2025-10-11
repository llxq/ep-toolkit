import { filterComponentEmptyProps } from "@/packages/components/c-form/core/helper/component.ts";
import { omit } from "lodash";
import { computed, type ComputedRef, getCurrentInstance } from "vue";

/**
 * 因为vue是在编译时通过typescript类型进行props的解析，导致得到的props会有很多不必要的默认值。该方法可以过滤掉所有非用户传递过来的props的值，得到一个纯净的props
 * @param props
 * @param filterPropKeys
 */
export const useGetPureAttrs = <T extends TObj, U extends keyof T>(
  props: T,
  filterPropKeys: U[],
) => {
  const instance = getCurrentInstance();

  const getPureAttrs = computed(() => {
    const defaultAttrs = filterComponentEmptyProps(
      omit(props, filterPropKeys || []),
    );
    if (instance) {
      // 用户实际传递来的属性
      const attrs = instance?.vnode?.props;
      if (attrs) {
        return Object.keys(props).reduce((result, key) => {
          if (Reflect.has(attrs, key)) {
            Reflect.set(result, key, Reflect.get(props, key));
          }
          return result;
        }, {});
      }
    }
    return defaultAttrs;
  }) as ComputedRef<Omit<T, (typeof filterPropKeys)[number]>>;

  return [getPureAttrs];
};
