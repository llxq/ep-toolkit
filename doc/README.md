# EP-Toolkit 文档

EP-Toolkit 是一个基于 Vue 3 和 Element Plus 的组件库，提供了丰富的表单组件、工具函数和 Hooks。

## 📚 文档目录

### 📦 组件文档

- [组件文档总览](./components/README.md) - 所有组件的详细文档
  - [C-Auto-Tooltip 自动提示组件](./components/c-auto-tooltip.md)
  - [C-Form 表单组件](./components/c-form.md)
  - [C-Search-Form 搜索表单组件](./components/c-search-form.md)
  - [C-Table 表格组件](./components/c-table.md)
  - [表单子组件](./components/form-components.md)

### 🔧 Hooks 文档

- [Hooks 文档总览](./hooks/README.md) - 所有 Hooks 的详细文档
  - [useCreateFormBuilder](./hooks/useCreateFormBuilder.md) - 表单构建器
  - [useAsyncLoader](./hooks/useAsyncLoader.md) - 异步加载优化
  - [useEvent](./hooks/useEvent.md) - 事件监听
  - [useOpenDialog](./hooks/useOpenDialog.md) - 弹框管理
  - [useResizeObserver](./hooks/useResizeObserver.md) - 元素大小监听

## 🚀 快速开始

### 安装

```bash
npm install ep-toolkit
```

### 基础使用

```vue
<template>
  <c-form :form-builder="formBuilder" />
</template>

<script setup>
import { EFormComponentType } from "ep-toolkit";
import { useCreateFormBuilder } from "ep-toolkit";

const { formBuilder } = useCreateFormBuilder([
  {
    tag: EFormComponentType.INPUT,
    label: "用户名",
    prop: "username",
    attrs: { placeholder: "请输入用户名" },
  },
]);
</script>
```

## 📖 使用指南

### 表单构建

EP-Toolkit 的核心是动态表单构建系统，通过 `useCreateFormBuilder` Hook 可以轻松创建复杂的表单：

```typescript
import { EFormComponentType } from "ep-toolkit";
import { useCreateFormBuilder } from "ep-toolkit";

const { formBuilder } = useCreateFormBuilder([
  {
    tag: EFormComponentType.INPUT,
    label: "用户名",
    prop: "username",
    attrs: { placeholder: "请输入用户名" },
  },
  {
    tag: EFormComponentType.SELECT,
    label: "角色",
    prop: "role",
    attrs: {
      options: [
        { label: "管理员", value: "admin" },
        { label: "用户", value: "user" },
      ],
    },
  },
]);
```

### 搜索表单

使用 `C-Search-Form` 组件创建搜索表单：

```vue
<template>
  <c-search-form
    :form-builder="searchFormBuilder"
    :auto-expand="true"
    :expand-depth="2"
  />
</template>
```

### 工具 Hooks

EP-Toolkit 提供了多个实用的 Hooks：

```typescript
// 异步加载优化
const [loading, execute] = useAsyncLoader();

// 事件监听
const { on, stops } = useEvent();

// 弹框管理
const { openDialog } = useOpenDialog();

// 元素大小监听
const { onResize } = useResizeObserver();
```

## 🎯 特性

- **动态表单构建** - 支持通过配置创建复杂的表单
- **TypeScript 支持** - 完整的类型定义和推导
- **Element Plus 集成** - 基于 Element Plus 构建，保持一致的 API
- **响应式设计** - 支持多种布局模式
- **丰富的组件** - 提供各种常用的表单组件
- **工具 Hooks** - 提供实用的 Composition API Hooks

## 📁 项目结构

### 源码结构

```
src/packages/
├── components/          # 组件
│   ├── c-auto-tooltip/ # 自动提示组件
│   ├── c-form/         # 表单组件
│   ├── c-search-form/ # 搜索表单组件
│   └── c-table/       # 表格组件
├── hooks/              # Hooks
│   ├── useAsyncLoader.ts
│   ├── useEvent.ts
│   ├── useOpenDialog.ts
│   └── useResizeObserver.ts
└── directives/         # 指令
```

### 文档结构

```
doc/
├── README.md           # 文档总览
├── components/         # 组件文档
│   ├── README.md      # 组件文档索引
│   ├── c-auto-tooltip.md
│   ├── c-form.md
│   ├── c-search-form.md
│   ├── c-table.md
│   └── form-components.md
└── hooks/             # Hooks 文档
    ├── README.md      # Hooks 文档索引
    ├── useCreateFormBuilder.md
    ├── useAsyncLoader.md
    ├── useEvent.md
    ├── useOpenDialog.md
    └── useResizeObserver.md
```

## 🔧 开发

### 环境要求

- Node.js >= 16
- Vue 3
- Element Plus

### 本地开发

```bash
# 克隆项目
git clone <repository-url>

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📝 更新日志

### v1.0.0

- 初始版本发布
- 支持动态表单构建
- 提供丰富的表单组件
- 集成多个实用 Hooks

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进 EP-Toolkit。

## 📄 许可证

MIT License
