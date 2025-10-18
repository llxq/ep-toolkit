# useListenEvent Hook

用于在 Vue 3 组件中创建并管理事件监听，支持 HTML 元素、`document`、`window` 以及任意 `EventTarget`。提供自动清理与手动停止能力。

## 基础用法

```ts
import { useListenEvent } from "@/packages/hooks";

const { on, stop } = useListenEvent();

// 不指定目标（向后兼容）：默认绑定到 document.body
on(
  "click",
  (e) => {
    console.log("body clicked", e.target);
  },
  { passive: true },
);

// 指定目标：document
on(
  document,
  "scroll",
  () => {
    console.log("document scroll");
  },
  { passive: false },
);
```

## API

### useListenEvent

```ts
const { on, stop } = useListenEvent();
```

#### on 重载签名

```ts
// 1) 向后兼容：不指定目标，默认监听到 document.body
on<K extends keyof HTMLElementEventMap>(
  event: K,
  fn: (_: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void

// 2) 目标为 HTMLElement（根据元素推导事件类型）
on<Target extends HTMLElement, K extends keyof EventMapFor<Target>>(
  target: Target,
  event: K,
  fn: (_: EventMapFor<Target>[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void

// 3) 目标为 document
on<Target extends typeof document, K extends keyof DocumentEventMap>(
  target: Target,
  event: K,
  fn: (_: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void

// 4) 目标为 window
on<Target extends typeof window, K extends keyof WindowEventMap>(
  target: Target,
  event: K,
  fn: (_: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void
```

> 注：`EventMapFor<Target>` 会根据传入的目标自动推导事件类型；对非标准 `EventTarget` 时为 `Record<string, Event>`。

#### 返回值

- **on**: 绑定事件监听器。
- **stop**: 取消通过本 hook 绑定的所有事件监听器。

## 行为说明

- **默认目标**：当只传入事件名时，目标为 `document.body`（向后兼容旧用法）。
- **自动清理**：在组件销毁（`onBeforeUnmount` / `onScopeDispose`）时自动移除已绑定的监听。
- **手动停止**：调用 `stop()` 可立即移除本次实例绑定的所有监听。
- **事件选项**：`options` 透传给 `addEventListener`（如 `passive`、`once`、`capture` 等）。

## 使用示例

### 监听 window 与 document

```ts
const { on } = useListenEvent();

on(window, "resize", () => {
  console.log("window resize");
});

on(document, "visibilitychange", () => {
  console.log("document visibilitychange");
});
```

### 监听指定 HTMLElement

```ts
const { on, stop } = useListenEvent();
const btn = document.querySelector("#btn") as HTMLButtonElement;

on(btn, "click", (e) => {
  console.log("button clicked");
});

// 某些场景下主动清理
stop();
```

### 只触发一次 / 使用 passive

```ts
const { on } = useListenEvent();

on(
  document,
  "keydown",
  (e) => {
    console.log("first keydown only");
  },
  { once: true },
);

on(
  "touchmove",
  (e) => {
    // 默认目标 document.body
  },
  { passive: true },
);
```

## 注意事项

- **目标存活性**：请确保传入的 `EventTarget` 在监听周期内有效。
- **类型提示**：为 `HTMLElement`/`document`/`window` 提供完善的事件类型推导。
- **作用域内清理**：若在 `effectScope` 中使用，也会自动在 `onScopeDispose` 时清理。

## 源码位置

- **Hook 文件**：`src/packages/hooks/useListenEvent.ts`
