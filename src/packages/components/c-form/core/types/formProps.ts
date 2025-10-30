import type { EFormComponentType } from "@/packages/components/c-form/core/constants/enum.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import type {
  IStyle,
  TEvent,
} from "@/packages/components/c-form/core/types/shared.ts";
import type {
  ColProps,
  FormItemProps,
  FormProps,
  RowProps,
} from "element-plus";

export interface ICFormProps extends Partial<Omit<FormProps, "model">> {
  /**
   * 是否自动初始化
   * @default true
   */
  isAutoInit?: boolean;
  /**
   * 是否使用 row 布局
   * @default true
   */
  useRowLayout?: boolean;
  /**
   * el-row 对应的属性
   * @default { gutter: 24 } 默认使用 column-gap 设置间距
   */
  elRowAttrs?: Partial<RowProps> & IStyle;
  /**
   * modelValue
   */
  modelValue?: TObj;
  /**
   * 表单的class
   */
  className?: string;
  /**
   * 初始化的值
   */
  initialFormData?: TObj;
}

export interface IFormItem<T extends TObj = TObj> extends IStyle {
  /**
   * 组件类型
   */
  tag: EFormComponentType | string;
  /**
   * label名称
   */
  label: string | ((formItem: FormItem) => string);
  /**
   * prop，用于数据绑定
   */
  prop: keyof T | string;
  /**
   * 在使用row布局的时候的占比
   */
  span?: number;
  /**
   * 用于传递给组件的属性
   */
  attrs?: TObj;
  /**
   * 用于定义element-plus组件的属性
   */
  componentProps?: TObj;
  /**
   * 默认值
   */
  defaultValue?: TAllType;
  /**
   * form-item 属性
   */
  elFormItemAttrs?: Partial<FormItemProps> & IStyle;
  /**
   * el-col 的配置
   */
  elColAttrs?: Partial<ColProps>;
  /**
   * 事件
   */
  on?: TEvent;
  /**
   * 是否隐藏，返回 true 则表示隐藏，返回 false 表示不隐藏
   * @default false
   */
  hidden?: ((formData: T, column: IFormItem<T>) => boolean) | boolean;
  /**
   * 用于触发 change 事件的 event
   */
  changeEvent?: string;
  /**
   * 用于format结果
   * 如果传递了 format 方法并且返回值是个 object类型 会自动去掉原有的值，否则会丢弃返回的值
   * @example
   * createBaseFormItem({
   *   tag: EFormComponentType.DATE_RANGE,
   *   label: "分配时间",
   *   prop: "time",
   *   format: (date: [string, string]) => {
   *   const [ start, end ] = date
   *     return {
   *       start,
   *       end
   *     }
   *   }
   * }),
   * // 最后得到的 formData 结构
   * {
   *   start: "2022-01-01",
   *   end: "2022-01-02",
   * }
   * // 如果返回的是个非 object
   * createBaseFormItem({
   *   tag: EFormComponentType.DATE_RANGE,
   *   label: "分配时间",
   *   prop: "time",
   *   format: (date: [string, string]) => 1
   * }),
   * // 结果会丢弃 time 字段
   * { }
   */
  format?: (
    data: T[keyof T] | any,
    formData: T,
    column: IFormItem<T>,
  ) => TNullableUndefinable<TObj>;
}
