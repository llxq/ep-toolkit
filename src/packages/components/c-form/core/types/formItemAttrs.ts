import type {
  IStyle,
  TOptionsReturn,
} from "@/packages/components/c-form/core/types/shared.ts";
import type {
  DatePickerProps,
  InputProps,
  RadioGroupProps,
} from "element-plus";
import type { cascaderProps } from "element-plus/es/components/cascader/src/cascader";
import type { SelectProps } from "element-plus/es/components/select/src/select";
import type { ExtractPropTypes } from "vue";

/**
 * select 的属性
 */
export interface ICFormSelectAttrs extends Omit<SelectProps, "options"> {
  /**
   * select 的 options
   */
  options?: TOptionsReturn;
  /**
   * 设置 select 的宽度
   */
  width?: string;
}

/**
 * 日期的属性
 */
export interface ICFormDateAttrs extends DatePickerProps {
  /**
   * 是否自动加上秒
   */
  autoAddSeconds?: boolean;
  /**
   * 是否使用一天的开始/结束时间（时/分/秒）作为默认值
   */
  useDefaultTimeToDay?: boolean;
}

export interface IGroupSelectOptions {
  /**
   * select 选中的对应的 input 的占位符
   */
  placeholder?: string;
  /**
   * select 选中的对应的 input 的最大长度
   */
  maxlength?: number;
  /**
   * select 选中的对应的 input 的输入类型
   * @param long 对应的是只能输入 long 最大值 9223372036854775807
   */
  type?: "long" | string;
}
/**
 * select & input 结合的组件的属性
 */
export type ICFormSelectInputGroupAttrs = {
  selectAttrs?: Partial<SelectProps> & IStyle;
  /**
   * select 的 options
   */
  options: TOptionsReturn<IGroupSelectOptions>;
  /**
   * select 的内容修改是否不触发 change 事件
   * @default false
   */
  changeOnSelect?: boolean;
  /**
   * select 的宽度
   * @default 100px
   */
  selectWidth?: string;
  /**
   * 是否默认选中第一个下拉数据
   * @default: true
   */
  defaultSelectFirst?: boolean;
  /**
   * 是否把select放到前面
   * @default false
   */
  selectToFirst?: boolean;
} & IStyle &
  Omit<InputProps, "modelValue">;

/**
 * element-plus 中 cascader 的属性
 */
export type TCascaderProps = ExtractPropTypes<typeof cascaderProps>;
/**
 * 级联选择的属性
 */
export interface ICFormCascaderAttrs extends Omit<TCascaderProps, "options"> {
  options?: TOptionsReturn;
  /**
   * 设置 cascader 的宽度
   */
  width?: string;
}

/**
 * 数字范围的属性
 */
export interface ICFormNumberRangeAttrs {
  /**
   * 最小值的参数
   */
  minProps?: Partial<InputProps>;
  /**
   * 最大值的参数
   */
  maxProps?: Partial<InputProps>;
  /**
   * 分割字符
   */
  separator?: string;
  /**
   * 可输入的最大值
   */
  max?: number;
  /**
   * 可输入的最小值
   */
  min?: number;
  /**
   * 设置最多支持几位小数
   */
  precision?: number;
  /**
   * 设置文本框的宽度
   */
  inputWidth?: string;
}

/**
 * 日期范围和下拉框的属性
 */
export interface ICFormDateRangeAndSelectGroupAttrs {
  /**
   * select 的 options
   */
  options: TOptionsReturn<IGroupSelectOptions>;
  /**
   * select options
   */
  selectWidth?: string;
  /**
   * 废弃属性，请使用 selectAttrs
   * @deprecated
   */
  selectOptions?: Partial<SelectProps>;
  /**
   * select 的属性
   */
  selectAttrs?: Partial<SelectProps>;
  /**
   * 是否在时间为空的情况下禁用 select
   * @default true
   */
  disabledSelectByEmptyData?: boolean;
  /**
   * 是否把select放到前面
   * @default false
   */
  selectToFirst?: boolean;
  /**
   * 是否默认选中第一个下拉数据
   * @default: false
   */
  defaultSelectFirst?: boolean;
  /**
   * 当日期清空的时候是否需要清空下拉框
   * @default false
   */
  whenEmptyDateClearSelect?: boolean;
}

/**
 * 数字输入框的属性
 */
export interface ICFormNumberInputAttrs extends InputProps {
  /*
   * 设置最多支持几位小数
   */
  precision?: number;
  /**
   * 最大值
   */
  max?: number;
  /**
   * 最小值
   */
  min?: number;
}

/**
 * radio 的属性
 */
export interface ICFormRadioAttrs extends Omit<RadioGroupProps, "options"> {
  /**
   * radio 的 options
   */
  options?: TOptionsReturn;
}
