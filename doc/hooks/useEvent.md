# useEvent

一个用于管理事件监听的 Vue Composition API 钩子函数，支持自动清理和类型安全的事件处理。

## 特性

- 自动清理事件监听器
- 支持 TypeScript 类型推断
- 同时支持现代和传统 API 风格
- 支持多种事件目标（HTMLElement, Document, Window）
- 支持事件委托选项（passive, once, capture 等）

## 基本用法

```typescript
import { useEvent } from "ep-toolkit";

// 在组件中使用
const { on, stop } = useEvent();

// 添加事件监听
const cleanup = on(
  document,
  "scroll",
  (e) => {
    console.log("文档滚动", e);
  },
  { passive: true },
);

// 手动移除单个事件监听
cleanup();

// 或者一次性移除所有事件监听
stop();
```

## 向后兼容用法

为了保持与旧代码的兼容性，`on` 方法也支持传统用法（默认绑定到 `document.body`）：

```typescript
const { on } = useEvent();

// 传统用法：自动绑定到 document.body
const cleanup = on("click", (e) => {
  console.log("点击事件", e);
});
```

## API

### `useEvent()`

返回一个包含以下方法的对象：

#### `on(target, event, handler, options?)`

添加一个事件监听器。

- `target`: `EventTarget` - 要监听的 DOM 元素或事件目标
- `event`: `string` - 事件名称
- `handler`: `(event: Event) => void` - 事件处理函数
- `options?`: `boolean | AddEventListenerOptions` - 可选的监听器选项

返回一个清理函数，调用该函数可以移除这个特定的事件监听器。

#### `on(event, handler, options?)` (传统用法)

向后兼容的用法，自动绑定到 `document.body`。

- `event`: `string` - 事件名称
- `handler`: `(event: Event) => void` - 事件处理函数
- `options?`: `boolean | AddEventListenerOptions` - 可选的监听器选项

#### `stop()`

移除所有通过此 `useEvent` 实例添加的事件监听器。

## 类型安全

`useEvent` 提供了完整的 TypeScript 类型支持，能够根据目标元素类型自动推断出正确的事件类型：

```typescript
// 自动推断出正确的 MouseEvent 类型
on(buttonElement, "click", (e) => {
  // e 被正确推断为 MouseEvent
  console.log(e.clientX, e.clientY);
});

// 对于 window 对象也能正确推断
on(window, "resize", (e) => {
  // e 被推断为 UIEvent
  console.log("窗口大小改变");
});
```

## 自动清理

当组件卸载时，所有通过 `useEvent` 添加的事件监听器都会自动被清理。你也可以手动调用 `stop()` 方法来清理所有事件监听器。

## 注意事项

- 在组件卸载时，所有事件监听器会自动清理
- 多次调用 `stop()` 是安全的
- 返回的清理函数可以安全地多次调用
- 如果目标元素不存在，`on` 方法会静默失败（返回一个空函数）

## 源码位置

- **Hook 文件**：`src/packages/hooks/useEvent.ts`
