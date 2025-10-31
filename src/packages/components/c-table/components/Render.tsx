import { isEmptyCellValue } from "@/helper/is.ts";
import CTableLinkButton from "@/packages/components/c-table-link-button/index.vue";
import {
  TABLE_EMPTY_NODE,
  TABLE_EMPTY_VALUE,
} from "@/packages/components/c-table/core/constants/vNode.tsx";
import type { ICTableColumn } from "@/packages/components/c-table/core/types/tabColumn.ts";
import { camelizeObject } from "@/packages/utils";
import { isEmpty, isFunction } from "lodash";
import { h } from "vue";

/**
 * 渲染表头
 * @param props
 * @constructor
 */
export const RenderCTableHeaderComponent = (props: {
  column: ICTableColumn;
  headerColumn: any;
  index: number;
}) => {
  const { column, headerColumn, index } = camelizeObject(props);
  const { headerRender, label } = column;
  if (isFunction(headerRender)) {
    return headerRender(h, headerColumn, index, column);
  }
  return label;
};

export const RenderCTableColumnComponent = (props: {
  column: ICTableColumn;
  row: TObj;
  data: TObj;
}) => {
  const { column, row, data } = camelizeObject(props);
  // 在空数据的时候也会进入，避免不必要的渲染执行，等待数据加载完成
  if ((!row || isEmpty(row)) && !column.emptyIsRender) {
    return TABLE_EMPTY_NODE;
  }

  const {
    contentRender,
    renderToOptions,
    onClick,
    emptyClick,
    emptyValue,
    prop,
  } = column;
  if (isFunction(contentRender)) {
    const { $tableData, $index, $defaultSort, $rowKey } = data;
    let index = $index;
    if ($defaultSort) {
      if (!$rowKey) {
        console.warn(
          "如果设置了default-sort，必须要设置row-key，否则可能会导致自定义渲染内容错乱！",
        );
      } else {
        index = $tableData.findIndex(
          (it: TObj) => Reflect.get(it, $rowKey) === Reflect.get(row, $rowKey),
        );
      }
    }
    const node = contentRender(
      h,
      (data as never) ?? {},
      Reflect.get($tableData, index) ?? {},
    );
    if (typeof node !== "number" && (!node || node === TABLE_EMPTY_VALUE)) {
      return TABLE_EMPTY_NODE;
    }
    return node;
  }

  const showEmptyValue = emptyValue ?? TABLE_EMPTY_NODE;
  if (!prop) {
    return showEmptyValue;
  }
  const currentData = Reflect.get(data, prop);
  if (renderToOptions) {
    const value = renderToOptions.find((it) => it.value === currentData);
    const renderValue = value?.label ?? showEmptyValue;
    if (value?._color) {
      return <span style={{ color: value._color }}>{renderValue}</span>;
    }
    if (value?._status) {
      return (
        <span
          class="custom-status__color"
          style={{ "--status-color": value._status }}
        >
          {renderValue}
        </span>
      );
    }
    return renderValue;
  }

  const currentIsEmpty =
    isEmptyCellValue(currentData) || currentData == emptyValue;
  if (onClick) {
    const link = (
      <CTableLinkButton onClick={() => onClick?.(props.data)}>
        {currentData}
      </CTableLinkButton>
    );
    if (emptyClick) {
      return link;
    }
    // 如果值为 undefined 或者 null 或者和 emptyValue 设置的值一致，那么就认为他是空值，空值在默认情况下不会触发 onClick 事件
    return currentIsEmpty ? showEmptyValue : link;
  }
  return currentIsEmpty ? showEmptyValue : currentData;
};
