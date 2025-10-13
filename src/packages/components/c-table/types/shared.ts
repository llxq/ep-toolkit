/**
 * 表格加载的数据结构
 */
export interface ICTableLoadResult {
  /**
   * 表格数据
   */
  data?: TObj[];
  /**
   * 总条数
   */
  total?: number;
  /**
   * 总页数
   */
  count?: string;
}

/**
 * 不使用 elTable 的势力作为类型。否则会导致打包类型报错
 * error: Exported variable 'useBaseTable' has or is using name 'TableHeader' from external module
 */
export interface IElTableRef {
  $el: HTMLElement;
  clearSort: () => void;
  scrollTo: (x: number, y: number) => void;
  clearSelection: () => void;
  [key: string]: any;
}

/**
 * 分页
 */
export interface ICTablePagination {
  /*
   * 当前页码
   */
  current: number;
  /*
   * 每页条数
   */
  size: number;
  /*
   * 总条数
   */
  total?: number;
}

/**
 * c-table 实例。
 */
export interface ICTableInstance {
  /**
   * 刷新页面
   * @param resetPagination {boolean} 是否重置分页 default true
   */
  refresh: (resetPagination?: boolean) => Promise<void>;
  /**
   * 加载数据
   * @param params
   */
  loadData: (params?: ICTablePagination) => Promise<void>;
  /**
   * 获取分页数据
   */
  getPagination: () => ICTablePagination;
  /**
   * 清除排序
   */
  clearSort: () => void;
  /**
   * 获取导出的列定义
   */
  getExportColumnsProps: () => string[];
  /**
   * 表格实例
   */
  elTable: IElTableRef;
  /**
   * 获取表格数据
   */
  getTableData: <T extends TObj>() => T[];
}

/**
 * 元选择器
 */
export type TSelector = string | HTMLElement | (() => HTMLElement) | undefined;
