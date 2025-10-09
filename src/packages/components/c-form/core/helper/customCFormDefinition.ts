import type { TKeyofCustomFormComponentType } from "@/packages/components/c-form/core/helper/createCustomCFormItem.ts";
import type { IFormItem } from "@/packages/components/c-form/core/types/formProps.ts";
import type { Component } from "vue";

export interface ICustomTagToComponentValue {
  component: Component;
  defaultPraseStrategy: (field: IFormItem) => IFormItem;
}

export const CUSTOM_TAG_SUFFIX = "__custom-component__";

/**
 * 用于定义自定义组件和相应的解析策略
 */
const customComponentDefinitionMap = new Map<
  string,
  Partial<ICustomTagToComponentValue>
>();

const getCustomKey = (prop: string | TKeyofCustomFormComponentType): string =>
  `${CUSTOM_TAG_SUFFIX}${prop}`;

/**
 * 是否为自定义组件
 * @param customTagName
 */
export const isCustomComponent = (
  customTagName: string | TKeyofCustomFormComponentType,
): boolean => customComponentDefinitionMap.has(getCustomKey(customTagName));

/**
 * 添加对应的custom组件定义
 * @param customTagName 自定义组件名称，基于 TKeyofCustomFormComponentType
 * @param value 自定义组件定义 （包含组件定义和默认值解析策略）
 */
export function addCustomDefinition(
  customTagName: string | TKeyofCustomFormComponentType,
  value: Partial<ICustomTagToComponentValue>,
) {
  // 添加自定义组件的映射
  if (customComponentDefinitionMap.has(getCustomKey(customTagName))) {
    console.warn(`${customTagName} 组件已经存在，重复定义会覆盖原有的组件`);
  }
  customComponentDefinitionMap.set(getCustomKey(customTagName), value);
}

/**
 * 获取对应的自定义组件定义
 * @param customTagName
 */
export const getCustomComponentDefinition = (
  customTagName: string | TKeyofCustomFormComponentType,
): TUndefinable<Partial<ICustomTagToComponentValue>> =>
  customComponentDefinitionMap.get(getCustomKey(customTagName));

/**
 * 是否为自定义组件
 * @param customTagName
 */
export const hasCustomDefinitionByTagName = (
  customTagName: string | TKeyofCustomFormComponentType,
): boolean => customComponentDefinitionMap.has(getCustomKey(customTagName));

/**
 * 根据tagName获取自定义组件
 * @param customTagName
 */
export const getCustomComponentByTagName = (
  customTagName: string | TKeyofCustomFormComponentType,
): TUndefinable<Component> =>
  customComponentDefinitionMap.get(getCustomKey(customTagName))?.component;

/**
 * 清空对应的自定义组件
 * @param customTagName
 */
export const clearCustomToTagName = (
  customTagName: string | TKeyofCustomFormComponentType,
) => {
  if (customComponentDefinitionMap.has(getCustomKey(customTagName))) {
    customComponentDefinitionMap.delete(getCustomKey(customTagName));
  }
};

/**
 * 清空所有自定义组件的缓存
 */
export const clearCustomComponentDefinition = () => {
  customComponentDefinitionMap.clear();
};
