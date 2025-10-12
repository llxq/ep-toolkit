# useListenEvent Hook

用于创建监听事件的 Vue 3 Composition API Hook。

## 基础用法

```typescript
import { useListenEvent } from '@/packages/hooks'

const { on, stops, listenElementRef } = useListenEvent<HTMLDivElement>()

// 监听点击事件
on('click', (event) => {
  console.log('点击了', event.target)
})

// 监听键盘事件
on('keydown', (event) => {
  console.log('按键', event.key)
})
```

## API

### useListenEvent

#### 泛型参数

| 参数 | 说明           | 类型        |
| ---- | -------------- | ----------- |
| T    | 监听的元素类型 | HTMLElement |

#### 返回值

| 参数             | 说明         | 类型                                                                                                          |
| ---------------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| on               | 添加事件监听 | (event: K, fn: (event: HTMLElementEventMap[K]) => void, options?: boolean \| AddEventListenerOptions) => void |
| stops            | 停止所有监听 | () => void                                                                                                    |
| listenElementRef | 监听元素引用 | Ref<T \| null>                                                                                                |

## 使用示例

### 基础事件监听

```typescript
const { on, stops } = useListenEvent<HTMLButtonElement>()

on('click', (event) => {
  console.log('按钮被点击')
})

on('mouseenter', (event) => {
  console.log('鼠标进入')
})

on('mouseleave', (event) => {
  console.log('鼠标离开')
})
```

### 在模板中使用

```vue
<template>
  <div ref="listenElementRef" class="container">
    <button>点击我</button>
  </div>
</template>

<script setup>
import { useListenEvent } from '@/packages/hooks'

const { on, stops } = useListenEvent<HTMLDivElement>()

on('click', (event) => {
  console.log('容器被点击', event.target)
})

on('scroll', (event) => {
  console.log('容器滚动')
})
</script>
```

### 带选项的事件监听

```typescript
const { on, stops } = useListenEvent<HTMLInputElement>()

// 监听输入事件，使用防抖
on('input', (event) => {
  console.log('输入内容', event.target.value)
}, { passive: true })

// 监听键盘事件，只触发一次
on('keydown', (event) => {
  console.log('按键', event.key)
}, { once: true })
```

### 停止监听

```typescript
const { on, stops } = useListenEvent<HTMLDivElement>()

on('click', () => console.log('点击1'))
on('click', () => console.log('点击2'))

// 停止所有监听
stops()
```

### 组件卸载时自动清理

```vue
<template>
  <div ref="listenElementRef">
    <button>按钮</button>
  </div>
</template>

<script setup>
import { useListenEvent } from '@/packages/hooks'

const { on } = useListenEvent<HTMLDivElement>()

on('click', (event) => {
  console.log('点击事件')
})

// 组件卸载时会自动清理所有监听器
</script>
```

### 监听特定元素

```vue
<template>
  <div>
    <button ref="buttonRef">按钮1</button>
    <button ref="buttonRef2">按钮2</button>
  </div>
</template>

<script setup>
import { useListenEvent } from '@/packages/hooks'

const buttonRef = ref<HTMLButtonElement>()
const buttonRef2 = ref<HTMLButtonElement>()

// 监听特定按钮
const { on: onButton1 } = useListenEvent<HTMLButtonElement>()
const { on: onButton2 } = useListenEvent<HTMLButtonElement>()

onButton1('click', () => console.log('按钮1被点击'))
onButton2('click', () => console.log('按钮2被点击'))
</script>
```

## 支持的事件类型

支持所有标准的 DOM 事件：

- 鼠标事件：`click`, `mousedown`, `mouseup`, `mousemove`, `mouseenter`, `mouseleave`
- 键盘事件：`keydown`, `keyup`, `keypress`
- 表单事件：`input`, `change`, `submit`, `focus`, `blur`
- 触摸事件：`touchstart`, `touchend`, `touchmove`
- 其他事件：`scroll`, `resize`, `load`, `unload`

## 特性

- 支持泛型，提供类型安全
- 自动清理事件监听器
- 支持事件选项配置
- 支持多个事件监听
- 组件卸载时自动清理

## 源码位置

- Hook 文件：`src/packages/hooks/useListenEvent.ts`

## 注意事项

1. 组件卸载时会自动清理所有监听器
2. 支持所有标准的 DOM 事件类型
3. 可以使用事件选项（如 `passive`, `once` 等）
4. 返回的 `listenElementRef` 需要在模板中使用 `ref` 属性绑定
