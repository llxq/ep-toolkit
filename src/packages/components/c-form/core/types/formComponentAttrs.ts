import type { EFormComponentType } from "@/packages/components/c-form/core/constants/enum.ts";
import type {
  ICFormCascaderAttrs,
  ICFormDateAttrs,
  ICFormDateRangeAndSelectGroupAttrs,
  ICFormNumberInputAttrs,
  ICFormNumberRangeAttrs,
  ICFormRadioAttrs,
  ICFormSelectAttrs,
  ICFormSelectInputGroupAttrs,
} from "@/packages/components/c-form/core/types/formItemAttrs.ts";
import type { InputProps, SwitchProps } from "element-plus";

export interface IFormComponentAttrs {
  [EFormComponentType.INPUT]: InputProps;
  [EFormComponentType.SELECT]: ICFormSelectAttrs;
  [EFormComponentType.DATE]: ICFormDateAttrs;
  [EFormComponentType.DATE_RANGE]: ICFormDateAttrs;
  [EFormComponentType.SWITCH]: SwitchProps;
  [EFormComponentType.GROUP_SELECT_INPUT]: ICFormSelectInputGroupAttrs;
  [EFormComponentType.SEARCH_INPUT]: InputProps;
  [EFormComponentType.CASCADER]: ICFormCascaderAttrs;
  [EFormComponentType.NUMBER_RANGE]: ICFormNumberRangeAttrs;
  [EFormComponentType.DATE_RANGE_AND_SELECT_GROUP]: ICFormDateRangeAndSelectGroupAttrs;
  [EFormComponentType.NUMBER_INPUT]: ICFormNumberInputAttrs;
  [EFormComponentType.RADIO]: ICFormRadioAttrs;
}
