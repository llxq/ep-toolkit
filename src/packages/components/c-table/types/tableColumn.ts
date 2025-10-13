import type { TableColumnCtx } from "element-plus";
import type { h, VNode } from "vue";
import type { JSX } from "vue/jsx-runtime";

export interface ICTableColumn<T extends TObj = TObj>
  extends Partial<
    Omit<TableColumnCtx<T>, "prop" | "renderHeader" | "type" | "fixed">
  > {
  /*
   * 列的类型，默认为 default
   */
  type?: "default" | "selection" | "index" | "expand" | string;

  /*
   * 用于自定义渲染
   * NOTE：如果返回 null、undefined、空字符串，或者返回 TABLE_EMPTY_VALUE 则会默认渲染 TABLE_EMPTY_NODE
   * TABLE_EMPTY_NODE see： src/components/base-table/helpers/constants.ts
   * 使用 _render 是因为如果用 render 会被 vue 的 render 类型覆盖。
   */
  _render?: (
    _: typeof h,
    params: T & { $index: number; $tableData: T[] },
    data: T,
  ) => TAllType | VNode | HTMLElement | JSX.Element;

  /**
   * 根据 options 渲染对应的数据
   * _color: 会自动把字体颜色变化
   * _status：会加上状态颜色
   */
  renderToOptions?: {
    label?: string;
    value?: TAllType;
    _color?: string;
    _status?: string;
  }[];

  /*
   * 用于渲染自定义头，为了支持 tsx
   */
  renderHeader?: (
    _: typeof h,
    headerColumn: TAllType,
    $index: number,
    column: ICTableColumn<T>,
  ) => TAllType | VNode | HTMLElement | JSX.Element;

  /* 是否隐藏列。
   * 注意：如果想要让自己的列变为根据某个条件动态的显示/隐藏对应的列，在定义列的时候请使用 computed 定义！否则可能会导致无法搜集到对应的依赖从而不触发列的状态更新和重新渲染。
   * */
  hidden?: boolean | ((params: T) => boolean);

  /*
   * 对应的字段
   */
  prop?: keyof T | string;

  /*
   * 如果值为空的时候的默认值，默认为 "-"
   * @see src/components/base-table/helpers/constants.tsx
   */
  emptyValue?: TAllType;

  /*
   * 点击事件，如果添加此属性，则表格文本则会变为可点击的按钮；如果表格文本为空，则无变化
   */
  onClick?: (params: T) => void;

  /*
   * 为空的时候是否能点击
   */
  emptyClick?: boolean;

  /**
   * fixed
   */
  fixed?: boolean | "left" | "right";

  /**
   * 是否在列为空的时候也渲染内容（只有在有_render)方法的情况下生效
   * @default false
   */
  renderToEmpty?: boolean;
}
