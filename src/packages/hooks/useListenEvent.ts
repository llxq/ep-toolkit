import {
  getCurrentScope,
  onBeforeUnmount,
  onScopeDispose,
  useTemplateRef,
} from "vue";

/**
 * 创建一个监听事件
 * @example
 * const { on, stops } = useListenEvent();
 * on("click", () => {
 *   console.log("click");
 * });
 * on("click", () => {
 *   console.log("click");
 * });
 * // stop all events
 * stops();
 */
export const useListenEvent = <T extends HTMLElement>() => {
  const listenElementRef = useTemplateRef<T>("listenElementRef");
  const getElement = () => listenElementRef?.value || document.body;

  const stacks: {
    event: keyof HTMLElementEventMap;
    fn: <K extends keyof HTMLElementEventMap>(
      _: HTMLElementEventMap[K],
    ) => void;
    options?: boolean | AddEventListenerOptions;
  }[] = [];

  const on = <K extends keyof HTMLElementEventMap>(
    event: K,
    fn: (_: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ) => {
    stacks.push({ event, fn: fn as never, options });
    getElement().addEventListener<K>(event, fn, options);
  };

  const stops = () => {
    stacks.forEach(({ event, fn, options }) =>
      getElement().removeEventListener(event, fn, options),
    );
    stacks.length = 0;
  };

  onBeforeUnmount(stops);

  if (getCurrentScope()) {
    onScopeDispose(stops);
  }

  return {
    stops,
    on,
    listenElementRef,
  };
};
