import type { FormBuilder } from "@/packages/components/c-form/core/FormBuilder.ts";
import type { CTableEventKeys } from "@/packages/components/c-table/core/constants/event.ts";
import { TableBuilder } from "@/packages/components/c-table/core/TableBuilder.ts";
import type { TFunction } from "@/packages/components/c-table/core/types/shared.ts";
import type { ICTableColumn } from "@/packages/components/c-table/core/types/tabColumn.ts";
import type { ITableConfig } from "@/packages/components/c-table/core/types/tableConfig.ts";
import { isFunction } from "lodash";
import { computed, type Ref, ref, unref } from "vue";

export const useCreateTableBuilder = <T extends TObj = TObj>(
  columns: ICTableColumn<T>[] | (() => ICTableColumn<T>[]),
  config?: ITableConfig<T> & {
    formBuilder?: FormBuilder;
    /**
     * 通过什么方式查询数据，默认是在触发search的时候查询
     * @default 'search'
     *
     * @description
     * search: 点击搜索按钮的时候触发
     * change: 实时触发查询，表单数据变更了就会触发
     */
    queryType?: "search" | "change";
  },
) => {
  const tableBuilder = ref(new TableBuilder()) as unknown as Ref<
    TableBuilder<T>
  >;

  const columnsValue = isFunction(columns) ? columns() : columns;
  const { formBuilder, queryType = "search", ...restConfig } = config ?? {};
  tableBuilder.value.init(columnsValue, restConfig);

  /**
   * 获取选中的数据
   */
  const selectList = computed(() => {
    return tableBuilder.value.selectList;
  });

  /**
   * 注册事件
   * @param event
   * @param callback
   */
  const registerEvent = (event: CTableEventKeys, callback: TFunction) => {
    tableBuilder.value.registerEvent(event, callback);
  };

  /**
   * 刷新
   * @param resetPagination
   */
  const refresh = (resetPagination?: boolean) =>
    tableBuilder.value.tableDataStore.refresh(resetPagination);

  if (formBuilder) {
    if (queryType === "search") {
      formBuilder.onSearch(() => {
        void refresh(true);
      });
    } else {
      formBuilder.onChange(() => {
        void refresh(true);
      });
    }
  }

  return {
    tableBuilder: unref(tableBuilder),
    registerEvent,
    refresh,
    selectList,
  };
};
