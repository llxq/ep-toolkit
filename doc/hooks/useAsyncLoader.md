# useAsyncLoader Hook

用于优化异步加载体验的 Vue 3 Composition API Hook。

## 基础用法

```typescript
import { useAsyncLoader } from '@/packages/hooks'

const [loading, execute] = useAsyncLoader()

// 执行异步操作
execute(async () => {
  await fetchData()
})
```

## 全屏加载

```typescript
const [loading, execute] = useAsyncLoader(false, true)

execute(async () => {
  await heavyOperation()
})
```

## API

### useAsyncLoader

#### 参数

| 参数         | 说明           | 类型    | 默认值 |
| ------------ | -------------- | ------- | ------ |
| initialValue | 初始加载状态   | boolean | false  |
| isFull       | 是否为全屏加载 | boolean | false  |

#### 返回值

| 参数    | 说明     | 类型                                               |
| ------- | -------- | -------------------------------------------------- |
| loading | 加载状态 | Ref<boolean>                                       |
| execute | 执行函数 | (fn: () => Promise<void> \| void) => Promise<void> |

## 使用示例

### 基础异步操作

```typescript
const [loading, execute] = useAsyncLoader()

const fetchUserData = async () => {
  await execute(async () => {
    const response = await fetch('/api/users')
    const data = await response.json()
    // 处理数据
  })
}
```

### 等待加载完成

```typescript
const [loading, execute] = useAsyncLoader()

const handleSubmit = async () => {
  await execute(async () => {
    await submitForm()
  })
  
  // 加载完成后执行
  console.log('提交完成')
}
```

### 全屏加载

```typescript
const [loading, execute] = useAsyncLoader(false, true)

const loadHeavyData = async () => {
  await execute(async () => {
    // 执行耗时操作
    await processLargeData()
  })
}
```

### 在组件中使用

```vue
<template>
  <div>
    <el-button 
      :loading="loading" 
      @click="handleSubmit"
    >
      提交
    </el-button>
  </div>
</template>

<script setup>
import { useAsyncLoader } from '@/packages/hooks'

const [loading, execute] = useAsyncLoader()

const handleSubmit = async () => {
  await execute(async () => {
    // 提交逻辑
    await submitData()
  })
}
</script>
```

### 同步操作

```typescript
const [loading, execute] = useAsyncLoader()

// 也支持同步操作
execute(() => {
  // 同步操作
  processData()
})
```

## 特性

- 支持异步和同步操作
- 支持全屏加载效果
- 自动管理加载状态
- 返回 Promise，支持链式调用
- 自动处理加载状态的生命周期

## 源码位置

- Hook 文件：`src/packages/hooks/useAsyncLoader.ts`

## 注意事项

1. 全屏加载模式会显示 Element Plus 的 Loading 组件
2. 执行函数返回 Promise，可以等待操作完成
3. 支持同步和异步操作
4. 加载状态会自动管理，无需手动控制
