<script setup lang="tsx">
import ColumnSearch from "@/packages/components/c-table/components/ColumnSearch.vue";
import { C_TABLE_EVENTS } from "@/packages/components/c-table/core/constants/event.ts";
import {
  SPECIAL_COLUMN_MAP,
  TABLE_DRAGGABLE_CLASS,
} from "@/packages/components/c-table/core/constants/vNode.tsx";
import { useColumnSearch } from "@/packages/components/c-table/hooks/useColumnSearch.ts";
import { epToolkitConfigService } from "@/packages/store/config/index.service.ts";
import { type SetupContext, type SlotsType, useSlots } from "vue";
import {
  RenderCTableHeaderComponent,
  RenderCTableColumnComponent,
} from "./components/Render.tsx";
import { RenderComponent } from "@/helper/render.tsx";
import type { TableBuilder } from "./core/TableBuilder.ts";
import { useCTable } from "./hooks/useCTable.tsx";
import { VueDraggable } from "vue-draggable-plus";

defineOptions({
  name: "CTable",
});

const { tableBuilder } = defineProps<{
  tableBuilder: TableBuilder;
}>();

const emit = defineEmits([...C_TABLE_EVENTS]);

defineSlots<{
  empty: () => void;
  append: () => void;
}>();

const {
  initElTableInstance,
  getPaginationProps,
  config,
  onDrag,
  dragChange,
  elTableRef,
} = useCTable(tableBuilder);

const { count, find, clear } = useColumnSearch(elTableRef);

const slots = useSlots();
const getOtherSlots = () => {
  return Object.keys(slots).filter(
    (key) => !["empty", "append", "_"].includes(key),
  ) as unknown as SlotsType[];
};

const CTableWrapper = (_: unknown, { slots }: SetupContext) => {
  if (tableBuilder.starDraggable) {
    return (
      /* @ts-ignore */
      <VueDraggable
        v-model={tableBuilder.data}
        class="c-table__draggable"
        target=".c-table__table tbody"
        item-key={
          config.value.draggableAttrs?.idKey ?? config.value.rowKey ?? "id"
        }
        handle={`.${TABLE_DRAGGABLE_CLASS}`}
        animation={config.value.draggableAttrs?.animation ?? 150}
        onEnd={onDrag}
        onChange={dragChange}
      >
        {slots.default?.()}
      </VueDraggable>
    );
  }
  return slots.default?.();
};

const CTableHeaderWrapper = (_: unknown, { slots }: SetupContext) => {
  if (config.value.enableColumnSearch && count.value > 0) {
    return <div class="c-table__header-wrapper">{slots.default?.()}</div>;
  }
  return slots.default?.();
};
</script>

<template>
  <div class="c-table__container">
    <div v-loading="tableBuilder.loading" class="c-table__body">
      <CTableWrapper>
        <el-table
          :ref="initElTableInstance"
          class="c-table__table"
          v-bind="tableBuilder.tableAttrs"
          :data="tableBuilder.data"
          v-on="tableBuilder.getTableRegisterEvents(emit)"
          @selection-change="
            (value: TObj[]) => {
              tableBuilder.updateSelectList(value);
            }
          "
        >
          <el-table-column
            v-for="column in tableBuilder.showColumns"
            v-bind="column.tableColumnAttrs"
            :key="column.props.prop"
            :class-name="column.className"
          >
            <template #header="{ column: headerColumn, $index }">
              <CTableHeaderWrapper>
                <RenderCTableHeaderComponent
                  :column="column.props"
                  :header-column="headerColumn"
                  :index="$index"
                />
              </CTableHeaderWrapper>
            </template>

            <template #default="{ row, $index }">
              <template
                v-if="
                  !column.props.type || !SPECIAL_COLUMN_MAP[column.props.type]
                "
              >
                <RenderCTableColumnComponent
                  :column="column.props"
                  :row="row"
                  :data="{
                    ...row,
                    $index,
                    $tableData: tableBuilder.data,
                    $defaultSort: tableBuilder.tableAttrs.defaultSort,
                    $rowKey: tableBuilder.tableAttrs.rowKey,
                  }"
                />
              </template>
            </template>
          </el-table-column>
          <template #empty>
            <slot name="empty">
              <RenderComponent
                v-if="epToolkitConfigService.fullTableConfig?.tableEmptyRender"
                :render="
                  epToolkitConfigService.fullTableConfig.tableEmptyRender
                "
              />
            </slot>
          </template>
          <template #append>
            <slot name="append">
              <RenderComponent
                v-if="config.appendRender"
                :render="config.appendRender"
              />
            </slot>
          </template>
          <!-- other slots -->
          <template v-for="name in getOtherSlots()" #[name]>
            <slot :name="name" />
          </template>
        </el-table>
      </CTableWrapper>
    </div>
    <div
      v-if="config.hasPagination"
      :class="[
        'c-table__pagination',
        config.paginationPosition
          ? `is-update-position is-${config.paginationPosition}`
          : '',
      ]"
    >
      <el-pagination
        v-bind="getPaginationProps"
        :current-page="tableBuilder.pagination.current"
        :page-size="tableBuilder.pagination.size"
        :total="tableBuilder.pagination.total"
        @update:current-page="
          (val: number) => tableBuilder.updatePagination({ current: val })
        "
        @update:page-size="
          (val: number) => tableBuilder.updatePagination({ size: val })
        "
        v-on="tableBuilder.getPaginationEvents(emit)"
        @change="() => tableBuilder.refresh()"
      ></el-pagination>
    </div>
  </div>
  <ColumnSearch
    v-if="config.enableColumnSearch"
    :count="count"
    @find="find"
    @hidden="clear"
  />
</template>

<style scoped lang="scss">
.c-table__container {
  --table-search-result-bg-color: rgb(244, 154, 70);
  --table-search-result-color: #000;

  .c-table__body {
    .c-table__table {
      :deep() {
        .c-table__column__is-draggable {
          cursor: move;
        }

        .c-table__header-wrapper {
          display: contents;
        }

        .el-table__cell__search-result {
          .c-table__header-wrapper {
            background-color: var(--table-search-result-bg-color);
            display: unset;
            color: var(--table-search-result-color);
          }
        }
      }
    }
  }
  .c-table__pagination {
    padding: 16px 0;

    &.is-update-position {
      display: flex;
    }

    &.is-right {
      justify-content: flex-end;
    }

    &.is-center {
      justify-content: center;
    }

    &.is-left {
      justify-content: flex-start;
    }
  }
}
</style>
