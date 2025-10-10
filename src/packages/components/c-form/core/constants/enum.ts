/**
 * 当前预定于的表单组件对应的 tag
 */
export enum EFormComponentType {
  /**
   * 输入框
   */
  INPUT = "el-input",

  /**
   * 下拉框
   */
  SELECT = "base-select",

  /**
   * 日期
   */
  DATE = "el-date-picker",

  /**
   * 日期范围
   */
  DATE_RANGE = "date-range",

  /**
   * 开关
   */
  SWITCH = "el-switch",

  /**
   * 单选
   */
  RADIO = "base-radio",

  /**
   * 下拉筛选组合
   */
  GROUP_SELECT_INPUT = "group-select-input",

  /**
   * 搜索框
   */
  SEARCH_INPUT = "base-search-input",

  /**
   * 级联下拉
   */
  CASCADER = "el-cascader",

  /**
   * 数字区间
   */
  NUMBER_RANGE = "number-range",

  /**
   * 日期时间区间和下拉选择组合组件
   */
  DATE_RANGE_AND_SELECT_GROUP = "date-range-and-select-group",

  /**
   * 数字框
   */
  NUMBER_INPUT = "number-input",
}

/**
 * 表单事件
 */
export enum EFormEvent {
  /**
   * 表单组件值发生变化
   */
  CHANGE = "change",
  /**
   * 触发查询
   */
  SEARCH = "search",
}
