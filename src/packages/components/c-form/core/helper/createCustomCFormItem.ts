import { createFormItem } from "@/packages/components/c-form/core/helper/createFormItem.ts";
import { addCustomDefinition } from "@/packages/components/c-form/core/helper/customCFormDefinition.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import type { IFormItem } from "@/packages/components/c-form/core/types/formProps.ts";
import { isObject } from "lodash";
import type { Component, ExtractPropTypes } from "vue";

export interface ICustomComponentDefinition {
  component: Component;
  defaultPraseStrategy: (field: IFormItem) => IFormItem;
}

/**
 * EFormComponentType 类型扩展
 * @example
 * declare module "ep-kit" {
 *   export interface ICustomFormComponentType {
 *     // 也可以自定义对应枚举作为相应的 key
 *     'custom-input': {
 *       // 自定义表单组件的属性
 *       placeholder: boolean
 *       //....
 *     }
 *   }
 * }
 */
export interface ICustomFormComponentType {
  /**
   * 自定义表单组件名称和对应的类型
   * @example
   */
  __example__: {
    multiple: boolean;
  };
}
export type TKeyofCustomFormComponentType = keyof ICustomFormComponentType;

/**
 * 定义自定义表单组件，该定义为全局单例，只要定义了任何位置都可用。
 * @param key 自定义组件的 key （需要在 ICustomFormComponentType 中定义）
 * @param defaultPraseStrategy 默认值解析器
 * @param component 自定义组件
 * @example
 * import Test from "src/components/Test.vue";
 * defineCustomCFormComponent("test", (field: ICFormItem) => {
 *   const { label } = field
 *   return merge({ placeholder: `请输入${label}` }, field)
 * }, Test);
 */
export function defineCustomCFormComponent<T extends Component>(
  key:
    | TKeyofCustomFormComponentType
    | Partial<TObj<TKeyofCustomFormComponentType, ICustomComponentDefinition>>,
  defaultPraseStrategy?: (field: IFormItem) => IFormItem,
  component?: T,
) {
  if (isObject(key)) {
    for (const [_key, value] of Object.entries(key)) {
      addCustomDefinition(_key as TKeyofCustomFormComponentType, value);
    }
  } else {
    addCustomDefinition(key, { component, defaultPraseStrategy });
  }
}

type PropsOf<T> = T extends Component<infer P> ? P : never;
type TCreateCustomFormItemParams<
  T extends Component,
  U extends TObj = TObj,
> = Omit<IFormItem<U>, "tag" | "attrs" | "componentProps"> & {
  tag: T;
  attrs?: Partial<ExtractPropTypes<PropsOf<T>>>;
  componentProps?: Partial<ExtractPropTypes<PropsOf<T>>>;
};
export type TCreateCustomFormItemParamsByDefinition<
  T extends TKeyofCustomFormComponentType,
  U extends TObj = TObj,
> = Omit<IFormItem<U>, "tag" | "attrs" | "componentProps"> & {
  tag: T;
  /**
   * 如果组件定义中存在 attrs 类型，则提供该类型的 Partial 作为提示，否则回退到 TObj。
   */
  attrs?: "attrs" extends keyof ICustomFormComponentType[T]
    ? Partial<ICustomFormComponentType[T]["attrs"]>
    : TObj;
  /**
   * 如果组件定义中存在 componentProps 类型，则提供该类型的 Partial 作为提示，否则回退到 TObj。
   */
  componentProps?: "componentProps" extends keyof ICustomFormComponentType[T]
    ? Partial<ICustomFormComponentType[T]["componentProps"]>
    : TObj;
};
/**
 * 新建一个自定义组件项，与createBaseFormItem的区别为：该组件可以新建自定义组件，tag 可以为自定义的组件，并且支持 attrs 的类型自动推导
 * 注意：因为类型推导原因暂不支持 tag 为动态导入。
 * @param props
 * @example
 * // 如果 'test' 已经通过 defineCustomCFormComponent 定义
 * createCustomFormItem(() => {
 *   tag: 'test',
 *   label: "测试-已全局定义的自定义组件",
 *   prop: "test",
 *   attrs: {
 *     // Test 组件定义的类型,
 *     test: "test",
 *   },
 *   // 给自定义组件的 modelValue 设置默认值
 *   defaultValue: "test"
 * })
 *
 * // 支持直接传入组件
 * import Test from "src/components/Test.vue";
 * createCustomFormItem({
 *   tag: Test,
 *   label: "测试",
 *   prop: "test",
 *   attrs: {
 *     // Test 组件定义的类型,
 *     test: "test",
 *   },
 *   // 给自定义组件的 modelValue 设置默认值
 *   defaultValue: "test"
 * })
 *
 */
export function createCustomCFormItem<
  T extends TKeyofCustomFormComponentType = TKeyofCustomFormComponentType,
  U extends TObj = TObj,
>(
  props:
    | TCreateCustomFormItemParamsByDefinition<T, U>
    | (() => TCreateCustomFormItemParamsByDefinition<T, U>),
): FormItem<U, ICustomFormComponentType[T]>;
export function createCustomCFormItem<
  T extends Component,
  U extends TObj = TObj,
>(
  props:
    | TCreateCustomFormItemParams<T, U>
    | (() => TCreateCustomFormItemParams<T, U>),
): FormItem<U, Partial<ExtractPropTypes<PropsOf<T>>>>;
export function createCustomCFormItem(props: unknown) {
  return createFormItem(props as never);
}
