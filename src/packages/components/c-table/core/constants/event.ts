/**
 * element-plus el-table 的事件
 * @see element-plus/es/components/table/src/table.mjs
 */
export const EL_TABLE_EVENTS = [
  /**
   * 当用户手动勾选数据行的 Checkbox 时触发的事件
   * @param selection 已选中的数据
   * @param row 当前选中的行数据
   */
  "select",

  /**
   * 当用户手动勾选全选 Checkbox 时触发的事件
   * @param selection 已选中的数据
   */
  "select-all",

  /**
   * 当选择项发生变化时会触发该事件
   * @param selection 已选中的数据
   */
  "selection-change",

  /**
   * 当单元格 hover 进入时会触发该事件
   * @param row 行数据
   * @param column 列数据
   * @param cell 单元格 DOM 元素
   * @param event 事件对象
   */
  "cell-mouse-enter",

  /**
   * 当单元格 hover 退出时会触发该事件
   * @param row 行数据
   * @param column 列数据
   * @param cell 单元格 DOM 元素
   * @param event 事件对象
   */
  "cell-mouse-leave",

  /**
   * 当单元格被鼠标右键点击时触发该事件
   * @param row 行数据
   * @param column 列数据
   * @param cell 单元格 DOM 元素
   * @param event 事件对象
   */
  "cell-contextmenu",

  /**
   * 当某个单元格被点击时会触发该事件
   * @param row 行数据
   * @param column 列数据
   * @param cell 单元格 DOM 元素
   * @param event 事件对象
   */
  "cell-click",

  /**
   * 当某个单元格被双击时会触发该事件
   * @param row 行数据
   * @param column 列数据
   * @param cell 单元格 DOM 元素
   * @param event 事件对象
   */
  "cell-dblclick",

  /**
   * 当某一行被点击时会触发该事件
   * @param row 行数据
   * @param column 列数据
   * @param event 事件对象
   */
  "row-click",

  /**
   * 当某一行被鼠标右键点击时会触发该事件
   * @param row 行数据
   * @param column 列数据
   * @param event 事件对象
   */
  "row-contextmenu",

  /**
   * 当某一行被双击时会触发该事件
   * @param row 行数据
   * @param column 列数据
   * @param event 事件对象
   */
  "row-dblclick",

  /**
   * 当某一列的表头被点击时会触发该事件
   * @param column 列数据
   * @param event 事件对象
   */
  "header-click",

  /**
   * 当某一列的表头被鼠标右键点击时触发该事件
   * @param column 列数据
   * @param event 事件对象
   */
  "header-contextmenu",

  /**
   * 当表格的排序条件发生变化时会触发该事件
   * @param {object} { column, prop, order } 排序的列信息
   */
  "sort-change",

  /**
   * 当表格的筛选条件发生变化时会触发该事件
   * @param filters 筛选条件
   */
  "filter-change",

  /**
   * 当表格的当前行发生变化时会触发该事件
   * @param currentRow 当前行数据
   * @param oldCurrentRow 之前的当前行数据
   */
  "current-change",

  /**
   * 当拖动表头改变了列的宽度的时候会触发该事件
   * @param newWidth 新宽度
   * @param oldWidth 旧宽度
   * @param column 列数据
   * @param event 事件对象
   */
  "header-dragend",

  /**
   * 当用户对某一行展开或者关闭的时候会触发该事件
   * @param row 展开行的数据
   * @param expandedRows 展开行数据数组
   */
  "expand-change",

  /**
   * 当表格滚动时会触发该事件
   * @param event 事件对象
   */
  "scroll",
] as const;

export const PAGINATION_EVENT_PREFIX = "pagination:";
/**
 * element-plus el-pagination 的事件
 * @see element-plus/es/components/pagination/src/pagination.mjs
 */
export const PAGINATION_EVENTS = [
  /**
   * 分页：size-change 事件
   * @param size 每页显示条数
   */
  `${PAGINATION_EVENT_PREFIX}size-change`,
  /**
   * 分页：current-change 事件
   * @param currentPage 当前页
   */
  `${PAGINATION_EVENT_PREFIX}current-change`,
  /**
   * 分页：prev-click 事件
   * @param currentPage 当前页
   */
  `${PAGINATION_EVENT_PREFIX}prev-click`,
  /**
   * 分页：next-click 事件
   * @param currentPage 当前页
   */
  `${PAGINATION_EVENT_PREFIX}next-click`,
  /**
   * 分页：change 事件
   * @param value (currentPage: number, pageSize: number)
   */
  `${PAGINATION_EVENT_PREFIX}change`,
] as const;

/**
 * c-table 的事件
 */
export const C_TABLE_EVENTS = [
  /**
   * 拖拽时触发
   */
  "drag",
  /**
   * 表格数据加载完成时触发
   * @param position { oldIndex, newIndex } 拖拽前后的位置
   * @param data 拖拽后的数据即表格数据
   */
  "loaded",
  ...EL_TABLE_EVENTS,
  ...PAGINATION_EVENTS,
] as const;

export type CTableEventKeys = (typeof C_TABLE_EVENTS)[number] | string;
