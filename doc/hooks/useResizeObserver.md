# useResizeObserver Hook

用于监听元素宽高变化的 Vue 3 Composition API Hook，支持 ResizeObserver 和降级方案。

## 基础用法

```typescript
import { useResizeObserver } from '@/packages/hooks'

const { onResize, stopResize } = useResizeObserver()

// 监听元素大小变化
onResize(elementRef, (entry) => {
  console.log('元素大小变化', entry.contentRect)
})
```

## API

### useResizeObserver

#### 返回值

| 参数       | 说明     | 类型                                                                                                                    |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| onResize   | 开始监听 | (target: T \| Ref<T> \| (() => T \| Ref<T>), callBack: (entry: ResizeObserverEntry \| DOMRectReadOnly) => void) => void |
| stopResize | 停止监听 | () => void                                                                                                              |

## 使用示例

### 基础用法

```vue
<template>
  <div ref="containerRef" class="resizable-container">
    可调整大小的容器
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useResizeObserver } from '@/packages/hooks'

const containerRef = ref<HTMLDivElement>()

const { onResize, stopResize } = useResizeObserver()

onResize(containerRef, (entry) => {
  console.log('容器大小变化', {
    width: entry.contentRect.width,
    height: entry.contentRect.height
  })
})
</script>
```

### 使用函数获取元素

```vue
<template>
  <div ref="containerRef">
    内容
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useResizeObserver } from '@/packages/hooks'

const containerRef = ref<HTMLDivElement>()

const { onResize } = useResizeObserver()

// 使用函数获取元素
onResize(() => containerRef, (entry) => {
  console.log('大小变化', entry.contentRect)
})
</script>
```

### 响应式元素引用

```vue
<template>
  <div ref="containerRef" v-if="show">
    动态显示的内容
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useResizeObserver } from '@/packages/hooks'

const containerRef = ref<HTMLDivElement>()
const show = ref(true)

const { onResize } = useResizeObserver()

// 响应式监听
onResize(() => containerRef, (entry) => {
  if (entry) {
    console.log('元素大小', entry.contentRect)
  }
})
</script>
```

### 手动控制监听

```vue
<template>
  <div>
    <div ref="containerRef" class="resizable">
      可调整大小的内容
    </div>
    <button @click="startListening">开始监听</button>
    <button @click="stopListening">停止监听</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useResizeObserver } from '@/packages/hooks'

const containerRef = ref<HTMLDivElement>()
const { onResize, stopResize } = useResizeObserver()

const startListening = () => {
  onResize(containerRef, (entry) => {
    console.log('开始监听大小变化', entry.contentRect)
  })
}

const stopListening = () => {
  stopResize()
}
</script>
```

### 处理多个元素

```vue
<template>
  <div>
    <div ref="container1" class="container">容器1</div>
    <div ref="container2" class="container">容器2</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useResizeObserver } from '@/packages/hooks'

const container1 = ref<HTMLDivElement>()
const container2 = ref<HTMLDivElement>()

const { onResize: onResize1 } = useResizeObserver()
const { onResize: onResize2 } = useResizeObserver()

onResize1(container1, (entry) => {
  console.log('容器1大小变化', entry.contentRect)
})

onResize2(container2, (entry) => {
  console.log('容器2大小变化', entry.contentRect)
})
</script>
```

### 实际应用场景

```vue
<template>
  <div ref="chartContainer" class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useResizeObserver } from '@/packages/hooks'

const chartContainer = ref<HTMLDivElement>()
const chartCanvas = ref<HTMLCanvasElement>()

const { onResize } = useResizeObserver()

const resizeChart = (entry) => {
  const { width, height } = entry.contentRect
  if (chartCanvas.value) {
    chartCanvas.value.width = width
    chartCanvas.value.height = height
    // 重新绘制图表
    drawChart()
  }
}

onResize(chartContainer, resizeChart)

const drawChart = () => {
  // 绘制图表逻辑
}
</script>
```

## 降级支持

当浏览器不支持 ResizeObserver 时，会自动降级为使用 `window.resize` 事件：

```typescript
// 自动检测并降级
const { onResize } = useResizeObserver()

onResize(elementRef, (entry) => {
  // 在支持 ResizeObserver 的浏览器中，entry 是 ResizeObserverEntry
  // 在不支持的浏览器中，entry 是 DOMRectReadOnly
  console.log('大小变化', entry)
})
```

## 特性

- 支持 ResizeObserver API
- 自动降级到 window.resize 事件
- 支持响应式元素引用
- 自动清理监听器
- 支持函数式元素获取
- 组件卸载时自动停止监听

## 源码位置

- Hook 文件：`src/packages/hooks/useResizeObserver.ts`

## 注意事项

1. 组件卸载时会自动停止监听
2. 支持 ResizeObserver 的浏览器会优先使用 ResizeObserver
3. 不支持时会降级为 window.resize 事件
4. 元素必须存在才会开始监听
5. 支持动态元素引用
