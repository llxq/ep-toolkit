import type { IElTableInstance, TElTableRefInstance } from "@/helper/type.ts";
import type { TableBuilder } from "@/packages/components/c-table/core/TableBuilder.ts";
import { epToolkitConfigService } from "@/packages/store/config/index.service.ts";
import { merge, isNull, isUndefined } from "lodash";
import { computed, ref } from "vue";
import type { SortableEvent } from "vue-draggable-plus";

export const useCTable = <T extends TObj>(tableBuilder: TableBuilder<T>) => {
  const elTableRef = ref() as TElTableRefInstance;

  /**
   * 初始化表格实例
   * @param instance
   */
  const initElTableInstance = (instance: IElTableInstance) => {
    elTableRef.value = instance;
    tableBuilder.initElTableInstance(elTableRef);
  };

  const getPaginationProps = computed(() => {
    return merge(
      {},
      epToolkitConfigService.tableConfig.paginationProps,
      tableBuilder.config.paginationProps,
    );
  });

  const config = computed(() => {
    return tableBuilder.config;
  });

  if (tableBuilder.config.autoLoad) {
    void tableBuilder.refresh();
  }

  // 拖拽结束时触发(限制合计行拖拽/将新的顺序同步给后端)
  const onDrag = (e: SortableEvent) => {
    const { oldIndex, newIndex } = e;
    // 如果没有变化或索引无效，直接返回
    if (isNull(oldIndex) || isNull(newIndex) || oldIndex === newIndex) return;
    tableBuilder.triggerEvent(
      "drag",
      { oldIndex, newIndex },
      tableBuilder.data,
    );
  };

  const dragChange = (e: SortableEvent) => {
    if (!isUndefined(e.newIndex) && !isUndefined(e.oldIndex)) {
      const boxes = document.querySelectorAll(".el-table__row");
      const page = document.querySelector(".mainWrapper");
      if (!boxes[e.newIndex] || !page) return;
      const itemEl = boxes[e.newIndex].getBoundingClientRect();
      const pageEl = page.getBoundingClientRect();
      if (itemEl.bottom >= pageEl.height) {
        boxes[e.newIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        if (itemEl.top <= 220) {
          boxes[e.newIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  };

  return {
    initElTableInstance,
    getPaginationProps,
    config,
    onDrag,
    dragChange,
    elTableRef,
  };
};
