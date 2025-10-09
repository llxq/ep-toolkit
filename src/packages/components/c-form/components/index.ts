import CFormInput from "@/packages/components/c-form/components/CFormInput.vue";
import { EFormComponentType } from "@/packages/components/c-form/core/constants/enum.ts";
import type { Component } from "vue";

/**
 * 表单组件
 */
export const cFormComponents: Partial<Record<EFormComponentType, Component>> = {
  [EFormComponentType.INPUT]: CFormInput,
};

export { CFormInput };
