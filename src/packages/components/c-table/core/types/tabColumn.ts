import type { TRenderReturnType } from "@/helper/type.ts";
import type { TableColumnCtx } from "element-plus";
import type { h } from "vue";

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
   * NOTE: 如果返回 null、undefined、空字符串，则返回默认空值 -
   * NOTE: 直接使用 render 命名会导致和 vue 内置的 render 类型冲突导致无法正常进行类型提示。
   * NOTE: 第一个参数为编译 t/jsx 的默认 h 函数。
   *
   * @param h - t/jsx编译所需要的 h 函数
   * @param params - 当前行数据，该数据为 el-table 返回的默认数据，是不带双向绑定的，修改是不会影响到表格的渲染
   * @param data - 当前行数据，该数据为原始数据，更改会影响到表格的渲染内容
   *
   * @example
   * contentRender: (_, params) => {
   *   return <span>{ params.row.name }</span>
   * }
   *
   * @example
   * contentRender: (_, params, data) => {
   *   // 可用于进行双向绑定
   *   return <Tes v-model={ data.name }></Test></Test>
   * }
   */
  contentRender?: (
    _: typeof h,
    params: T & { $index: number; $tableData: T[] },
    data: T,
  ) => TRenderReturnType;

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
   * 用于渲染自定义头
   */
  headerRender?: (
    _: typeof h,
    headerColumn: TAllType,
    $index: number,
    column: ICTableColumn<T>,
  ) => TRenderReturnType;

  /* 是否隐藏列。
   * 注意：如果想要让自己的列变为根据某个条件动态的显示/隐藏对应的列，在定义列的时候请使用 computed 定义！否则可能会导致无法搜集到对应的依赖从而不触发列的状态更新和重新渲染。
   * */
  hidden?: boolean | ((params: ICTableColumn<T>) => boolean);

  /*
   * 对应的字段
   */
  prop?: keyof T | string;

  /*
   * 如果值为空的时候的默认值，默认为 "-"
   * @default "-"
   * @description
   * emptyValue: "0" // 当某个数字后端返回了 null / undefined / "" 的时候，会显示 0
   */
  emptyValue?: TAllType;

  /*
   * 点击事件，如果添加此属性，则表格文本则会变为可点击的按钮；如果表格文本为空，则无变化
   */
  onClick?: (params: T) => void;

  /*
   * 当设置了 onClick 的时候数据为空时是否能点击
   */
  emptyClick?: boolean;

  /**
   * fixed
   */
  fixed?: boolean | "left" | "right";

  /**
   * 是否在列为空的时候也渲染内容（只有在有contentRender)方法的情况下生效
   * @default false
   * @description
   * emptyIsRender: true
   * // 假如表格的数据为 [{}] 是一个空对象数组，默认情况下为了避免不必要的执行是不会执行 contentRender 方法的
   * // 但是如果设置了 emptyIsRender 就会执行
   */
  emptyIsRender?: boolean;

  /**
   * 是否开启拖拽
   */
  draggable?: boolean;
}
