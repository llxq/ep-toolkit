# C-Auto-Tooltip 自动提示组件

基于 Element Plus Tooltip 的自动提示组件，支持虚拟触发。

## 基础用法

```vue
<template>
  <c-auto-tooltip />
</template>
```

## 特性

- 支持虚拟触发
- 可配置提示内容、位置、效果等
- 支持原始内容渲染
- 可设置提示框宽度

## 技术实现

该组件通过 `tooltipConfig` 状态管理提示框的显示状态和配置，使用虚拟触发方式实现自动提示功能。

## 源码位置

- 组件文件：`src/packages/components/c-auto-tooltip/index.vue`
- 状态管理：`src/packages/components/c-auto-tooltip/cAutoTooltipState.ts`

## 注意事项

该组件主要用于内部状态管理，通常不直接使用，而是通过其他组件或工具函数来调用。
