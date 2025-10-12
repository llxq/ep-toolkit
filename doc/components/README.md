# 组件文档

EP-Toolkit 提供的所有 Vue 组件文档。

## 主要组件

### [C-Auto-Tooltip 自动提示组件](./c-auto-tooltip.md)
基于 Element Plus Tooltip 的自动提示组件，支持虚拟触发。

### [C-Form 表单组件](./c-form.md)
高级表单组件，支持动态表单构建和多种布局方式。

### [C-Search-Form 搜索表单组件](./c-search-form.md)
基于 C-Form 的搜索表单组件，支持自动展开/收起功能。

### [C-Table 表格组件](./c-table.md)
表格组件（当前为测试版本）。

## 表单子组件

### [表单子组件](./form-components.md)
所有可用的表单子组件，包括：

- **CFormInput** - 输入框组件
- **CFormSelect** - 选择器组件
- **CFormDate** - 日期选择器组件
- **CFormCascader** - 级联选择器组件
- **CFormRadio** - 单选框组组件
- **CFormNumberInput** - 数字输入框组件
- **CFormNumberRange** - 数字范围输入框组件
- **CFormSearchInput** - 搜索输入框组件
- **CFormDateRangeAndSelectGroup** - 日期范围选择器组合组件
- **CFormSelectInputGroup** - 选择器输入框组合组件

## 使用指南

### 基础表单构建

```vue
<template>
  <c-form :form-builder="formBuilder" />
</template>

<script setup>
import { EFormComponentType } from '@/packages/components/c-form/core/constants/enum'
import { useCreateFormBuilder } from '@/packages/components/c-form'

const { formBuilder } = useCreateFormBuilder([
  {
    tag: EFormComponentType.INPUT,
    label: '用户名',
    prop: 'username',
    attrs: { placeholder: '请输入用户名' }
  }
])
</script>
```

### 搜索表单

```vue
<template>
  <c-search-form 
    :form-builder="searchFormBuilder"
    :auto-expand="true"
  />
</template>
```

## 特性

- **动态表单构建** - 支持通过配置创建复杂的表单
- **TypeScript 支持** - 完整的类型定义和推导
- **Element Plus 集成** - 基于 Element Plus 构建，保持一致的 API
- **响应式设计** - 支持多种布局模式
- **丰富的组件** - 提供各种常用的表单组件

## 注意事项

1. 所有表单组件都基于 Element Plus 构建
2. 使用 FormBuilder 创建表单时，需要正确配置 formItems 数组
3. 组件支持 TypeScript，建议在 TypeScript 项目中使用
4. 部分组件依赖特定的指令（如 v-paste-trim）
5. 数字输入组件会自动进行数值验证和格式化
