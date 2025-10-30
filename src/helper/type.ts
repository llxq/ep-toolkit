import type { h, Ref, VNode } from "vue";
import type { JSX } from "vue/jsx-runtime";

/**
 * 通用的渲染返回类型
 */
export type TRenderReturnType =
  | TAllType
  | TAllType<JSX.Element | VNode | HTMLElement>;

/**
 * 通用的渲染函数
 */
export type TRenderFunction = (_: typeof h) => TRenderReturnType;

/**
 * el table 的实例
 * 如果直接使用 typeof ElTable 会导致打包类型报错
 */
export interface IElTableInstance {
  /**
   * 用于多选表格，清空用户的选择
   */
  clearSelection(): void;

  /**
   * 返回当前选中的行
   */
  getSelectionRows(): any[];

  /**
   * 用于多选表格，切换某一行的选中状态
   * @param row 要切换选中状态的行
   * @param selected 是否选中，如果设置则直接设置选中状态
   */
  toggleRowSelection(row: any, selected?: boolean): void;

  /**
   * 用于多选表格，切换全选和全不选
   */
  toggleAllSelection(): void;

  /**
   * 用于可扩展的表格或树表格，切换行的展开状态
   * @param row 要切换展开状态的行
   * @param expanded 是否展开，如果设置则直接设置展开状态
   */
  toggleRowExpansion(row: any, expanded?: boolean): void;

  /**
   * 用于单选表格，设定某一行为选中行
   * @param row 要选中的行，如果不传参数则取消当前选中的行
   */
  setCurrentRow(row?: any): void;

  /**
   * 清空排序条件，数据会恢复成未排序的状态
   */
  clearSort(): void;

  /**
   * 清除过滤条件
   * @param columnKeys 由columnKey组成的数组，用于清除指定列的过滤条件。如果不传，则清除所有过滤器
   */
  clearFilter(columnKeys?: string[]): void;

  /**
   * 对 Table 进行重新布局。当表格可见性变化时，可能需要调用此方法以获得正确的布局
   */
  doLayout(): void;

  /**
   * 手动排序表格
   * @param prop 排序列的 prop
   * @param order 排序顺序，'ascending' 或 'descending'
   */
  sort(prop: string, order: "ascending" | "descending"): void;

  /**
   * 滚动到一组特定坐标
   * @param options 滚动位置选项
   */
  scrollTo(options: {
    top?: number;
    left?: number;
    behavior?: "auto" | "smooth";
  }): void;

  /**
   * 设置垂直滚动位置
   * @param top 垂直滚动位置
   */
  setScrollTop(top: number): void;

  /**
   * 设置水平滚动位置
   * @param left 水平滚动位置
   */
  setScrollLeft(left: number): void;

  /**
   * 获取表列的 context
   */
  columns: any[];

  /**
   * 适用于 lazy Table, 需要设置 rowKey, 更新 key children
   * @param key 行的 key
   * @param children 子节点数据
   */
  updateKeyChildren(key: string | number, children: any[]): void;

  // Vue 实例属性
  /**
   * 组件根 DOM 元素
   */
  $el: HTMLElement;

  /**
   * 组件属性
   */
  $props: Record<string, any>;

  /**
   * 组件插槽
   */
  $slots: Record<string, any>;

  /**
   * 组件属性 (包含未声明的属性)
   */
  $attrs: Record<string, any>;

  /**
   * 组件发射的事件
   */
  $emit: (event: string, ...args: any[]) => void;
}
export type TElTableRefInstance = Ref<IElTableInstance>;
