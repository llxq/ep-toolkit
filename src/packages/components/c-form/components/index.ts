import CFormCascader from "@/packages/components/c-form/components/CFormCascader.vue";
import CFormDate from "@/packages/components/c-form/components/CFormDate.vue";
import CFormDateRangeAndSelectGroup from "@/packages/components/c-form/components/CFormDateRangeAndSelectGroup.vue";
import CFormInput from "@/packages/components/c-form/components/CFormInput.vue";
import CFormNumberInput from "@/packages/components/c-form/components/CFormNumberInput.vue";
import CFormNumberRange from "@/packages/components/c-form/components/CFormNumberRange.vue";
import CFormRadio from "@/packages/components/c-form/components/CFormRadio.vue";
import CFormSearchInput from "@/packages/components/c-form/components/CFormSearchInput.vue";
import CFormSelect from "@/packages/components/c-form/components/CFormSelect.vue";
import CFormSelectInputGroup from "@/packages/components/c-form/components/CFormSelectInputGroup.vue";
import { EFormComponentType } from "@/packages/components/c-form/core/constants/enum.ts";
import type { Component } from "vue";

/**
 * 表单组件
 */
export const cFormComponents: Partial<Record<EFormComponentType, Component>> = {
  [EFormComponentType.INPUT]: CFormInput,
  [EFormComponentType.CASCADER]: CFormCascader,
  [EFormComponentType.DATE]: CFormDate,
  [EFormComponentType.DATE_RANGE_AND_SELECT_GROUP]:
    CFormDateRangeAndSelectGroup,
  [EFormComponentType.NUMBER_INPUT]: CFormNumberInput,
  [EFormComponentType.NUMBER_RANGE]: CFormNumberRange,
  [EFormComponentType.RADIO]: CFormRadio,
  [EFormComponentType.SEARCH_INPUT]: CFormSearchInput,
  [EFormComponentType.SELECT]: CFormSelect,
  [EFormComponentType.GROUP_SELECT_INPUT]: CFormSelectInputGroup,
};

export {
  CFormInput,
  CFormCascader,
  CFormDate,
  CFormDateRangeAndSelectGroup,
  CFormNumberInput,
  CFormNumberRange,
  CFormRadio,
  CFormSearchInput,
  CFormSelect,
  CFormSelectInputGroup,
};
