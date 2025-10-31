import type { TElTableRefInstance } from "@/helper/type.ts";
import { ref } from "vue";

interface IColumnSearch {
  element: HTMLElement;
  rect: { top: number; left: number };
}

/**
 * 列自定义搜索
 * @param elTableRef
 */
export const useColumnSearch = (elTableRef: TElTableRefInstance) => {
  const count = ref(0);

  const getColumns = (): IColumnSearch[] => {
    const columnsInfo: IColumnSearch[] = [];
    const tableWrapper = elTableRef.value?.$el?.querySelector(
      ".el-table__inner-wrapper",
    );
    if (tableWrapper) {
      const headerWrappers = tableWrapper.querySelectorAll(
        ".el-table__header-wrapper",
      );
      if (headerWrappers.length) {
        /* 找到不是隐藏的那个表头，表头固定的元素 insertBefore 插入的，所以固定取展示的最后一个即可 */
        const headerWrapper = Array.from<HTMLElement>(
          headerWrappers as unknown as ArrayLike<HTMLElement>,
        )
          .filter((it) => {
            const { display } = getComputedStyle(it);
            return display !== "none";
          })
          .pop();
        const thNodes = headerWrapper?.querySelectorAll(".el-table__cell");
        if (thNodes?.length) {
          const thArray = Array.from<HTMLElement>(
            thNodes as NodeListOf<HTMLElement>,
          );
          const [firstElement] = thArray;
          /* 找到第一个可滚动元素 */
          const firstScrollElement = thArray.find(
            (it) => !it.classList.contains("el-table-fixed-column--left"),
          );
          /* 处理滚动之后的元素计算位置的偏差，以第一个可滚动元素为准 */
          const firstElementLeft =
            firstScrollElement?.getBoundingClientRect().left ?? 0;
          const tableWrapperLeft = tableWrapper.getBoundingClientRect().left;
          /* 计算滚动条默认不在初始位置 */
          let offset = Math.abs(firstElementLeft - tableWrapperLeft);
          if (firstElement !== firstScrollElement) {
            /* 找到最后一个固定在最前面的元素 */
            const lastIndex = thArray.findLastIndex((it) =>
              it.classList.contains("el-table-fixed-column--left"),
            );
            const lastFixedLeftElement = thArray[lastIndex];
            const {
              left: lastFixedLeftElementLeft,
              width: lastFixedLeftElementWidth,
            } = lastFixedLeftElement.getBoundingClientRect();
            /* offset = 最后一个固定在最前面的元素的 left + width - 第一个可滚动元素的 left */
            offset =
              lastFixedLeftElementLeft +
              lastFixedLeftElementWidth -
              firstElementLeft;
          }
          const { width } = elTableRef.value.$el.getBoundingClientRect();
          /* 找到横向滚动条 */
          const scrollBar = tableWrapper.querySelector(".el-scrollbar__thumb");
          /* 滚动的位置需要减去滚动条一半的距离才能居中 */
          const scrollBarWidth = scrollBar
            ? scrollBar.getBoundingClientRect().width
            : 0;
          const scrollBarOffSet = scrollBarWidth ? scrollBarWidth / 2 : 0;
          thArray.forEach((item) => {
            const { top, left } = item.getBoundingClientRect();
            /* left = 自身的left + 滚动条的偏移量 - 表格的宽度/2 - 滚动条的宽度（滚动条一半才能居中） */
            columnsInfo.push({
              element: item,
              rect: { top, left: left + offset - width / 2 - scrollBarOffSet },
            });
          });
        }
      }
    }
    return columnsInfo;
  };

  const compare = (str: string, str2: string) =>
    str.toLowerCase().includes(str2.toLowerCase());

  const clearStacks: (() => void)[] = [];

  const clear = () => {
    clearStacks.forEach((it) => it());
    count.value = 0;
    clearStacks.length = 0;
  };

  const addAnimation = ({ element }: IColumnSearch) => {
    element.classList.add("el-table__cell__search-result");
    clearStacks.push(() => {
      element.classList.remove("el-table__cell__search-result");
    });
  };

  const scrollTo = ({ rect }: IColumnSearch) => {
    const { top, left } = rect;
    elTableRef.value.scrollTo(left, top);
  };

  const find = (keyword: string, currentIndex: number) => {
    clear();
    if (keyword) {
      const columns = getColumns();
      if (columns?.length) {
        const findResult = columns.filter(({ element }) => {
          const text = element.textContent;
          if (!text) {
            return false;
          }
          return compare(text, keyword);
        });
        if (findResult.length) {
          findResult.forEach(addAnimation);
          const current = findResult[currentIndex];
          current && scrollTo(current);
          count.value = findResult.length;
        }
      }
    }
  };

  return {
    count,
    find,
    clear,
  };
};
