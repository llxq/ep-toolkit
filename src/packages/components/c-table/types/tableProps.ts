import type { FormBuilder } from "@/packages/components/c-form/core/FormBuilder.ts";
import type {
  ICTableLoadResult,
  ICTablePagination,
  TSelector,
} from "@/packages/components/c-table/types/shared.ts";
import type { ICTableColumn } from "@/packages/components/c-table/types/tableColumn.ts";
import type { PaginationProps, TableProps } from "element-plus";

export interface ICTableProps extends Partial<TableProps<TObj>> {
  /**
   * 表格数据
   */
  tableData?: TObj[];

  /**
   * 列配置项
   * NOTE: 使用 any 兼容各类型的 formBuilder
   */
  columns: ICTableColumn<any>[];

  /**
   * 用于加载数据
   */
  loadMethod?: (
    params: Omit<ICTablePagination, "total">,
  ) => ICTableLoadResult | Promise<TUndefinable<ICTableLoadResult>>;

  /**
   * 是否默认加载数据
   */
  autoLoad?: boolean;

  /**
   * 是否需要默认操作按钮（刷新）
   */
  hasDefaultOperation?: boolean;

  /**
   * 是否需要分页
   */
  hasPagination?: boolean;

  /**
   * 分页参数
   */
  paginationProps?: Omit<Partial<PaginationProps>, "size">;

  /**
   * paginationPosition
   */
  paginationPosition?: "left" | "right";

  /**
   * 分页是否固定
   */
  fixedPagination?: boolean;

  /**
   * 设置sticky的触发元素，如果没有。则默认会从el-main上拿去
   */
  stickyTriggerSelector?: TSelector;

  /**
   * 是否需要表头固定，默认关闭
   */
  stickyHeader?: boolean;
  /**
   * 表单的实例，如果需要表单加载完成事件（loaded）则需要传递
   * NOTE: 使用 any 兼容各类型的 formBuilder
   */
  formBuilder?: FormBuilder<any>;

  /**
   * 是否开启拖拽，默认不开启，只有设置了拖拽的列id（即prop）才会开启拖拽，可以设置多个
   */
  enableDragProps?: string[] | string;

  /**
   * draggable 的配置
   */
  draggableAttrs?: {
    /**
     * 表格唯一id，如果不设置会自动取表格设置的 row-key，最后是 id
     * @default id
     */
    idKey?: string;
    // default 150
    animation?: number;
  };

  /**
   * 是否开启列搜索
   * @default false
   */
  enableColumnSearch?: boolean;

  /**
   * 是否高度百分百
   * @default true
   */
  fullHeight?: boolean;

  /**
   * 是否高度100的情况下自动滚动
   * @default false
   */
  autoScrollY?: boolean;

  /**
   * 是否在选中的时候展示选中的数量
   * @default true
   */
  showSelectCount?: boolean;
}
