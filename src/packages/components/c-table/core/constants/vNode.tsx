import type { ICTableColumn } from "@/packages/components/c-table/core/types/tabColumn.ts";

/**
 * 特殊的列配置
 */
export const SPECIAL_COLUMN_MAP: Record<
  "index" | "selection" | string,
  ICTableColumn
> = {
  index: {
    prop: "__index",
    width: 60,
    label: "序号",
  },
  selection: {
    prop: "__selection",
    type: "selection",
    width: 55,
  },
};

/**
 * 表格开启拖拽的class
 */
export const TABLE_DRAGGABLE_CLASS = "c-table__column__is-draggable";

/**
 * 表格默认的空值
 */
export const TABLE_EMPTY_VALUE = "-";
export const TABLE_EMPTY_NODE = (
  <span style={{ color: "#999", fontSize: "12px" }}>{TABLE_EMPTY_VALUE}</span>
);

/**
 * 表格 sticky 的容器的 class
 */
export const STICKY_CONTAINER_CLASS = "__c-table-sticky-container";
