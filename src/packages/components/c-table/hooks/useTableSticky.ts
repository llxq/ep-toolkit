import { isHiddenNode } from "@/helper/html.ts";
import type { TElTableRefInstance } from "@/helper/type.ts";
import { STICKY_CONTAINER_CLASS } from "@/packages/components/c-table/core/constants/vNode.tsx";
import { cloneDeep, isFunction, isString } from "lodash";
import { nextTick, onUnmounted, type Ref } from "vue";

export type ISelector = string | HTMLElement | (() => HTMLElement) | undefined;

export interface IUseTableStickyOptions {
  stickyTriggerSelector?: ISelector;
  cTableOperationElement: Ref<TUndefinable<HTMLElement>>;
  elTableRef: TElTableRefInstance;
}

type TWatchPosition = "top" | "bottom";
type TWatchCallBack = (visible: boolean, position: TWatchPosition) => void;

/* 元素正在sticky的标识 */
const STICKY_DATA_FLAG = "data-sticky";
/**
 * 增加标识
 * @param element
 */
const addStickyFlag = (element: HTMLElement) =>
  element.setAttribute(STICKY_DATA_FLAG, "true");
/**
 * 删除标识
 * @param element
 */
const removeStickyFlag = (element: HTMLElement) =>
  element.removeAttribute(STICKY_DATA_FLAG);

/**
 * 将选择器转换成获取元素的函数
 * @param selectorOrElement
 */
const normalizeSelector = (
  selectorOrElement: ISelector,
): (() => HTMLElement | null) => {
  const empty = () => null;
  if (!selectorOrElement) return empty;
  if (isString(selectorOrElement)) {
    return () => document.querySelector(selectorOrElement);
  } else if (isFunction(selectorOrElement)) {
    return selectorOrElement;
  } else if (selectorOrElement instanceof HTMLElement) {
    return () => selectorOrElement;
  } else {
    console.warn("未知的选择器类型");
    return empty;
  }
};

/**
 * 根据选择器或者元素获取元素
 * @param selectorOrElement
 */
const getElement = (selectorOrElement: ISelector) =>
  normalizeSelector(selectorOrElement)();

/**
 * 监听元素的可见性
 * @param element
 * @param options
 */
const useWatchVisible = (
  element: HTMLElement,
  options?: IntersectionObserverInit,
) => {
  const watchCallBacks: TWatchCallBack[] = [];
  const onWatchVisible = (callBack: TWatchCallBack) => {
    if (!watchCallBacks.includes(callBack)) {
      watchCallBacks.push(callBack);
    }
  };
  const observer = new IntersectionObserver(([entry]) => {
    let position: TWatchPosition = "top";
    if (!entry.isIntersecting) {
      // 元素不可见，判断是在上方还是下方
      const targetRect = entry.boundingClientRect;
      const rootRect = entry.rootBounds;
      const rootTop = rootRect ? rootRect.top : 0;
      const rootBottom = rootRect ? rootRect.bottom : window.innerHeight;
      if (targetRect.bottom <= rootTop) {
        position = "top";
      } else if (targetRect.top >= rootBottom) {
        position = "bottom";
      }
    }
    watchCallBacks.forEach((callBack) =>
      callBack(entry.isIntersecting, position),
    );
  }, options);

  // auto start
  observer.observe(element);

  const onStopWatchVisible = () => {
    observer?.disconnect();
    watchCallBacks.length = 0;
  };

  return {
    onWatchVisible,
    onStopWatchVisible,
  };
};

/**
 * 监听元素的宽高变化
 * @param element
 */
const useWatchResize = (element: HTMLElement) => {
  const callBackStacks: (() => void)[] = [];
  const onUpdate = (callBack: () => void) => {
    if (!callBackStacks.includes(callBack)) {
      callBackStacks.push(callBack);
    }
  };

  const observer = new ResizeObserver(() =>
    requestAnimationFrame(() =>
      callBackStacks.forEach((callBack) => callBack()),
    ),
  );
  observer.observe(element);

  return {
    onUpdate,
    onStop: () => {
      observer?.disconnect();
      callBackStacks.length = 0;
    },
  };
};

/**
 * 创建一个元素用于监听
 * @param parent
 * @param className
 */
const createWatchElement = (parent: HTMLElement, className: string) => {
  const children = document.createElement("div");
  children.classList.add(className);
  Object.assign(children.style, {
    position: "relative",
    width: "100%",
    height: "1px",
    zIndex: "-1",
    backgroundColor: "transparent",
    pointerEvents: "none",
  } as CSSStyleDeclaration);
  parent.parentElement?.insertBefore(children, parent);
  return children;
};

/**
 * 获取表格中需要固定的元素
 * @param tableElement
 */
const getTableStickyElements = (tableElement?: HTMLElement): HTMLElement[] => {
  const elements: HTMLElement[] = [];
  if (!tableElement) return elements;
  /* 正常表头 */
  const tableHeaderElement = tableElement.querySelector(
    ".el-table__header-wrapper",
  ) as HTMLElement;
  if (tableHeaderElement) {
    elements.push(tableHeaderElement);
  }
  return elements;
};

/**
 * 处理表格开启表头固定的逻辑
 */
export const useTableSticky = (options: IUseTableStickyOptions) => {
  const getRoot = () =>
    getElement(options.stickyTriggerSelector ?? `.${STICKY_CONTAINER_CLASS}`);

  const stopStacks: (() => void)[] = [];

  /**
   * clone 固定元素用于占位
   * @param element
   */
  const cloneStickyElement = (element: HTMLElement) => {
    let cloneElement: TUndefinable<HTMLElement>,
      originDisplay = element.style.display;
    return {
      insert: () => {
        if (!cloneElement) {
          cloneElement = element.cloneNode(true) as HTMLElement;
          element.parentElement?.insertBefore(cloneElement, element);
        } else {
          cloneElement.style.display = originDisplay;
        }
      },
      remove: () => {
        cloneElement &&
          element.parentElement?.contains(cloneElement) &&
          element.parentElement?.removeChild(cloneElement);
        cloneElement = void 0;
      },
      hidden: () => {
        if (cloneElement) {
          originDisplay = cloneElement.style.display;
          cloneElement.style.display = "none";
        }
      },
      getCloneElement: () => cloneElement as HTMLElement,
    };
  };

  const cloneElementIsHidden = (cloneElement: HTMLElement) => {
    const style = cloneElement.style;
    return style.display === "none";
  };

  /**
   * 修改/重制固定元素的样式
   * @param stickyElement
   * @param root
   */
  const updateStickyElementStyle = (
    stickyElement: HTMLElement,
    root: HTMLElement,
  ) => {
    const originStyle = cloneDeep(getComputedStyle(stickyElement));
    const { insert, hidden, remove, getCloneElement } =
      cloneStickyElement(stickyElement);
    stopStacks.push(remove);

    let onStopResize: TUndefinable<() => void>;
    return {
      update: (style?: Partial<CSSStyleDeclaration>) => {
        if (isHiddenNode(stickyElement)) {
          return;
        }
        insert();
        const cloneElement = getCloneElement();
        const { top } = root.getBoundingClientRect();
        const { left, width } = stickyElement.getBoundingClientRect();
        /* 给sticky的元素增加标识 */
        addStickyFlag(stickyElement);
        Object.assign(
          stickyElement.style,
          {
            position: "fixed",
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            zIndex: 100,
          },
          style ?? {},
        );
        /* 为了处理页面宽度发生变化固定元素宽度无法变化 */
        const { onUpdate, onStop } = useWatchResize(cloneElement);
        onUpdate(() => {
          if (!cloneElementIsHidden(cloneElement)) {
            const { width: _w, left: _l } =
              cloneElement.getBoundingClientRect();
            stickyElement.style.width = `${_w}px`;
            stickyElement.style.left = `${_l}px`;
          }
        });
        onStopResize = onStop;
      },
      reset: () => {
        /* 去除标识 */
        removeStickyFlag(stickyElement);
        Object.assign(stickyElement.style, {
          position: originStyle.position ?? "",
          top: originStyle.top ?? "",
          left: originStyle.left ?? "",
          width: originStyle.width ?? "",
          zIndex: originStyle.zIndex ?? "",
        });
        hidden();
        onStopResize?.();
      },
    };
  };

  /**
   * 开始为某个固定元素进行样式的修改
   * @param stickyElement
   * @param onWatchVisible
   * @param root
   * @param updateStyle
   */
  const startUpdateStickyElementByWatch = (
    stickyElement: HTMLElement,
    onWatchVisible: (callBack: TWatchCallBack) => void,
    root: HTMLElement,
    updateStyle?: Partial<CSSStyleDeclaration>,
  ) => {
    const { update, reset } = updateStickyElementStyle(stickyElement, root);
    onWatchVisible((visible, position) => {
      if (!visible && root && position === "top") {
        update(updateStyle);
      } else {
        reset();
      }
    });
  };

  /**
   * 用于监听某个元素的可见性
   * @param watchElement
   */
  const watchElementVisible = (watchElement: HTMLElement) => {
    const root = getRoot();
    if (!root) {
      return;
    }
    const { onWatchVisible, onStopWatchVisible } = useWatchVisible(
      watchElement,
      { root },
    );
    const { cTableOperationElement, elTableRef } = options;
    if (!cTableOperationElement.value) {
      return;
    }
    /* 进行操作区域的监听 */
    startUpdateStickyElementByWatch(
      cTableOperationElement.value,
      onWatchVisible,
      root,
    );
    /* 对表头进行监听 */
    const tableElements = getTableStickyElements(elTableRef.value?.$el);
    const { top } = root.getBoundingClientRect();
    const { height } = cTableOperationElement.value.getBoundingClientRect();
    tableElements.forEach((element) =>
      startUpdateStickyElementByWatch(element, onWatchVisible, root, {
        top: `${top + height}px`,
      }),
    );
    stopStacks.push(onStopWatchVisible);
  };

  /* 开始开启 */
  const start = () => {
    /**
     * 初始化数据
     */
    const { cTableOperationElement } = options;
    if (!cTableOperationElement.value) {
      return;
    }
    watchElementVisible(
      createWatchElement(
        cTableOperationElement.value,
        "c-table-watch-sticky__operation",
      ),
    );
  };

  /**
   * 停止
   */
  const stopSticky = () => {
    stopStacks.forEach((stopFn) => stopFn());
    stopStacks.length = 0;
  };

  onUnmounted(stopSticky);

  const reset = async () => {
    stopSticky();
    await nextTick();
    start();
  };

  return {
    start,
    reset,
    stopSticky,
  };
};
