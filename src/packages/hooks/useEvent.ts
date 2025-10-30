import { getCurrentScope, onBeforeUnmount, onScopeDispose } from "vue";

interface IListenerStackItem {
  target: EventTarget;
  event: string;
  fn: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

/**
 * 创建一个监听事件
 *
 * @example
 * // 指定目标（document）
 * const { on, stop } = useEvent();
 * on(document, "scroll", () => {
 *   console.log(1);
 * }, { passive: false });
 *
 * @example
 * // 向后兼容：不指定目标，默认绑定到 document.body
 * const { on } = useEvent();
 * on("click", (e) => {
 *   // ...
 * }, { passive: true });
 */
export const useEvent = () => {
  const getDefaultTarget = () => document.body as EventTarget;

  const stacks: IListenerStackItem[] = [];

  // 类型工具：根据不同 target 推导事件 Map
  type EventMapFor<Target> = Target extends HTMLElement
    ? HTMLElementEventMap
    : Target extends typeof document
      ? DocumentEventMap
      : Target extends typeof window
        ? WindowEventMap
        : Record<string, Event>;

  /**
   * 绑定事件监听
   *
   * @example
   * const { on } = useEvent();
   * on(document, "scroll", (e) => { // ...
   * }, { passive: false });
   *
   * @example
   * const { on } = useEvent();
   * on("click", (e) => { // ...
   * }, { passive: true });
   */
  // 重载：保持向后兼容（默认监听到 body）
  function on<K extends keyof HTMLElementEventMap>(
    event: K,
    fn: (_: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): () => void;
  // 重载：HTMLElement 目标
  function on<Target extends HTMLElement, K extends keyof EventMapFor<Target>>(
    target: Target,
    event: K,
    fn: (_: EventMapFor<Target>[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): () => void;
  // 重载：Document 目标
  function on<
    Target extends typeof document,
    K extends keyof EventMapFor<Target>,
  >(
    target: Target,
    event: K,
    fn: (_: EventMapFor<Target>[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): () => void;
  // 重载：Window 目标
  function on<
    Target extends typeof window,
    K extends keyof EventMapFor<Target>,
  >(
    target: Target,
    event: K,
    fn: (_: EventMapFor<Target>[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): () => void;
  // 实现
  function on(
    targetOrEvent: EventTarget | string,
    eventOrFn?: string | EventListenerOrEventListenerObject,
    fnOrOptions?:
      | EventListenerOrEventListenerObject
      | boolean
      | AddEventListenerOptions,
    maybeOptions?: boolean | AddEventListenerOptions,
  ): () => void {
    let target: EventTarget;
    let event: string;
    let fn: EventListenerOrEventListenerObject;
    let options: boolean | AddEventListenerOptions | undefined;

    if (typeof targetOrEvent === "string") {
      // 兼容老签名：on(event, fn, options)
      target = getDefaultTarget();
      event = targetOrEvent;
      fn = eventOrFn as EventListenerOrEventListenerObject;
      options = fnOrOptions as boolean | AddEventListenerOptions | undefined;
    } else {
      // 新签名：on(target, event, fn, options)
      target = targetOrEvent;
      event = eventOrFn as string;
      fn = fnOrOptions as EventListenerOrEventListenerObject;
      options = maybeOptions as boolean | AddEventListenerOptions | undefined;
    }
    if (!target) {
      return () => {};
    }

    target.addEventListener(
      event,
      fn as EventListener,
      options as AddEventListenerOptions,
    );
    const stackItem = { target, event, fn, options };
    stacks.push(stackItem);

    return () => {
      target.removeEventListener(
        event,
        fn as EventListener,
        options as AddEventListenerOptions,
      );
      stacks.splice(stacks.indexOf(stackItem), 1);
    };
  }

  const stop = () => {
    stacks.forEach(({ target, event, fn, options }) =>
      target.removeEventListener(event, fn as EventListener, options),
    );
    stacks.length = 0;
  };

  onBeforeUnmount(stop);

  if (getCurrentScope()) {
    onScopeDispose(stop);
  }

  return {
    stop,
    on,
  };
};
