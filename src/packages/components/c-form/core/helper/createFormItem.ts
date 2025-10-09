import { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import type { IFormComponentAttrs } from "@/packages/components/c-form/core/types/formComponentAttrs.ts";
import type { IFormItem } from "@/packages/components/c-form/core/types/formProps.ts";
import { isFunction } from "lodash";
import {
  getCurrentScope,
  onScopeDispose,
  type Ref,
  ref,
  unref,
  watchEffect,
} from "vue";

export type TCreateFormItemParams<
  T extends keyof IFormComponentAttrs,
  U extends TObj,
> = Omit<IFormItem<U>, "tag" | "attrs" | "componentProps"> & {
  /**
   * 需要渲染的组件
   */
  tag: T;
  /**
   * 对应的属性类型
   */
  attrs?: Partial<IFormComponentAttrs[T]>;
};

/**
 * 为 FormItem 提供一个类型定义的函数
 * FIXME: 不能使用重载，否者会导致类型提示失效！具体原因未知。。
 * @param props 定义基础列的参数。如果该参数是一个函数则会默认开启一个 effect 用于监听，当当前作用域销毁的时候会自动取消监听，或者当前formBuilder实例销毁时也会自动取消监听
 * @example 默认的使用
 * createFormItem({
 *     tag: ECFormComponentType.GROUP_SELECT_INPUT,
 *     label: "test",
 *     prop: "searchKey",
 * }),
 *
 * @example 动态props
 * const test = ref(1);
 * createFormItem(() => {
 *   return {
 *     tag: ECFormComponentType.GROUP_SELECT_INPUT,
 *     label: "",
 *     prop: "searchKey",
 *     attrs: {
 *       placeholder: 1 === test.value ? "placeholder-a" : "placeholder-b",
 *     },
 *   }
 * }),
 * @return 根据对应的 tag 返回对应的 FormItem
 */
export function createFormItem<
  T extends keyof IFormComponentAttrs,
  U extends TObj,
>(
  props: TCreateFormItemParams<T, U> | (() => TCreateFormItemParams<T, U>),
): FormItem<U, IFormComponentAttrs[T]> {
  const isFunctionProps = isFunction(props);
  const newProps = isFunctionProps ? props() : props;
  /* FIXME 创建一个新的 FormItem，如果不用 ref 无法做到响应式更新！ */
  const formItem = ref(
    new FormItem<U, IFormComponentAttrs[T]>(newProps),
  ) as unknown as Ref<FormItem<U, IFormComponentAttrs[T]>>;
  if (isFunctionProps) {
    /* 构建一个副作用用于更新对应的动态props */
    const stopEffect = watchEffect(() => {
      const _newProps = isFunctionProps ? props() : props;
      formItem.value.initProps(_newProps);
    });
    formItem.value.addStopper(stopEffect);
    /* 如果当前作用域有顶层作用域，在作用域销毁的时候销毁掉当前副作用函数 */
    if (getCurrentScope()) {
      onScopeDispose(() => {
        formItem.value.removeStopper(stopEffect);
      });
    }
  }
  return unref(formItem);
}
