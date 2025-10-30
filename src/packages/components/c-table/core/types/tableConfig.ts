import type { TRenderFunction } from "@/helper/type.ts";
import type {
  ICTableLoadResult,
  ICTablePagination,
} from "@/packages/components/c-table/core/types/shared.ts";
import type { PaginationProps, TableProps } from "element-plus";

export interface ITableConfig<T extends TObj> extends Partial<TableProps<T>> {
  /**
   * 表格数据
   */
  tableData?: T[];

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
   * 是否需要分页
   * @default true
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
   * append render
   */
  appendRender?: TRenderFunction;
}
