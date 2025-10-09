import { isFunction } from "lodash";
import { onUnmounted, type Ref, unref, watchPostEffect } from "vue";

/**
 * 监听元素的宽高变化（支持 ResizeObserver，不支持时降级为 window.resize）
 * @example
 * const { onResize, stopResize } = useResizeObserver();
 * onResize(() => {
 *   console.log("resize");
 * });
 * onResize(() => {
 *   console.log("resize");
 * });
 * // stop all events
 * stopResize();
 */
export const useResizeObserver = () => {
  let observer: ResizeObserver | null = null;
  let cleanup: (() => void) | null = null;

  const onResize = <T extends HTMLElement>(
    target: T | Ref<T> | (() => T | Ref<T>),
    callBack: (entry: ResizeObserverEntry | DOMRectReadOnly) => void,
  ) => {
    if (observer || cleanup) {
      return;
    }

    const getTarget = (): T | null => {
      if (isFunction(target)) {
        return unref(target());
      }
      return unref(target);
    };

    const startWithObserver = (el: T) => {
      observer = new ResizeObserver(([entry]) => callBack(entry));
      observer.observe(el);
    };

    const startWithResizeEvent = (el: T) => {
      let lastRect: DOMRectReadOnly | null = null;

      const handler = () => {
        const rect = el.getBoundingClientRect();
        if (
          !lastRect ||
          rect.width !== lastRect.width ||
          rect.height !== lastRect.height
        ) {
          lastRect = rect;
          callBack(rect);
        }
      };

      window.addEventListener("resize", handler);
      // 默认触发一次
      handler();
      cleanup = () => window.removeEventListener("resize", handler);
    };

    const { stop: stopWatch } = watchPostEffect(() => {
      const el = getTarget();
      if (el) {
        if (typeof ResizeObserver !== "undefined") {
          startWithObserver(el);
        } else {
          console.warn(
            "ResizeObserver is not supported, fallback to window.resize",
          );
          startWithResizeEvent(el);
        }
        stopWatch?.();
      }
    });
  };

  const stopResize = () => {
    observer?.disconnect();
    observer = null;

    cleanup?.();
    cleanup = null;
  };

  onUnmounted(stopResize);

  return {
    onResize,
    stopResize,
  };
};
