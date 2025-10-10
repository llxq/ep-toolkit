import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";

const GRID_COLUMNS = 24; // Element Plus 栅格系统总列数

/**
 * 计算 Element Plus el-row 布局中最后一行剩余的可用 span。
 */
export const calculateRemainingRowSpan = (formItems: FormItem[]) => {
  if (!formItems || formItems.length === 0) {
    return GRID_COLUMNS; // 没有表单项，整行都是空的
  }

  let currentLineOccupiedSpan = 0;

  for (const item of formItems) {
    // 确保 item.span 存在且是数字，否则默认使用 GRID_COLUMNS
    const itemSpan =
      typeof item.span === "number" && item.span > 0 ? item.span : GRID_COLUMNS;

    if (currentLineOccupiedSpan + itemSpan <= GRID_COLUMNS) {
      // 当前项可以放入当前行
      currentLineOccupiedSpan += itemSpan;
    } else {
      // 当前项不能放入当前行，需要新开一行
      // 新行从当前项的 span 开始
      currentLineOccupiedSpan = itemSpan;
    }
  }

  // 计算最后一行剩余的 span 值
  const result = GRID_COLUMNS - currentLineOccupiedSpan;
  return result <= 0 ? GRID_COLUMNS : result;
};
