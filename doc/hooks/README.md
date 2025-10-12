# Hooks 文档

EP-Toolkit 提供的所有 Vue 3 Composition API Hooks 文档。

## 表单相关 Hooks

### [useCreateFormBuilder](./useCreateFormBuilder.md)
用于创建表单构建器的 Hook，支持静态和动态表单构建。

```typescript
import { useCreateFormBuilder } from '@/packages/components/c-form'

const { formBuilder } = useCreateFormBuilder([
  {
    tag: 'input',
    label: '用户名',
    prop: 'username',
    attrs: { placeholder: '请输入用户名' }
  }
])
```

## 工具 Hooks

### [useAsyncLoader](./useAsyncLoader.md)
用于优化异步加载体验的 Hook，支持全屏加载效果。

```typescript
import { useAsyncLoader } from '@/packages/hooks'

const [loading, execute] = useAsyncLoader()

execute(async () => {
  await fetchData()
})
```

### [useListenEvent](./useListenEvent.md)
用于创建监听事件的 Hook，支持自动清理。

```typescript
import { useListenEvent } from '@/packages/hooks'

const { on, stops } = useListenEvent<HTMLDivElement>()

on('click', (event) => {
  console.log('点击了', event.target)
})
```

### [useOpenDialog](./useOpenDialog.md)
用于通过函数式方式打开弹框的 Hook。

```typescript
import { useOpenDialog } from '@/packages/hooks'

const { openDialog } = useOpenDialog()

const result = await openDialog(MyDialogComponent, {
  title: '确认操作'
})
```

### [useResizeObserver](./useResizeObserver.md)
用于监听元素宽高变化的 Hook，支持 ResizeObserver 和降级方案。

```typescript
import { useResizeObserver } from '@/packages/hooks'

const { onResize, stopResize } = useResizeObserver()

onResize(elementRef, (entry) => {
  console.log('元素大小变化', entry.contentRect)
})
```

## 使用指南

### 基础用法

```typescript
// 导入需要的 Hook
import { useAsyncLoader, useListenEvent } from '@/packages/hooks'

// 在组件中使用
const [loading, execute] = useAsyncLoader()
const { on, stops } = useListenEvent<HTMLButtonElement>()

// 监听事件
on('click', () => {
  execute(async () => {
    await fetchData()
  })
})
```

### 组合使用

```typescript
import { 
  useAsyncLoader, 
  useListenEvent, 
  useOpenDialog 
} from '@/packages/hooks'

const [loading, execute] = useAsyncLoader()
const { on } = useListenEvent<HTMLButtonElement>()
const { openDialog } = useOpenDialog()

on('click', async () => {
  await execute(async () => {
    const result = await openDialog(ConfirmDialog, {
      title: '确认操作'
    })
    console.log('用户确认', result)
  })
})
```

## 特性

- **TypeScript 支持** - 完整的类型定义和推导
- **自动清理** - 组件卸载时自动清理资源
- **组合式 API** - 基于 Vue 3 Composition API
- **灵活配置** - 支持多种配置选项
- **性能优化** - 内置性能优化机制

## 注意事项

1. 所有 Hooks 都基于 Vue 3 Composition API
2. 支持 TypeScript 类型推导
3. 组件卸载时会自动清理资源
4. 建议在 setup 函数中使用
5. 支持组合使用多个 Hooks
