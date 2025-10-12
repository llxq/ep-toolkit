# C-Search-Form 搜索表单组件

基于 C-Form 的搜索表单组件，支持自动展开/收起功能。

## 基础用法

```vue
<template>
  <c-search-form 
    :form-builder="searchFormBuilder"
    :auto-expand="true"
    :expand-depth="2"
    @change="handleSearchChange"
  >
    <template #operation>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </template>
  </c-search-form>
</template>

<script setup>
import { EFormComponentType } from '@/packages/components/c-form/core/constants/enum'
import { useCreateFormBuilder } from '@/packages/components/c-form'

const { formBuilder: searchFormBuilder } = useCreateFormBuilder([
  {
    tag: EFormComponentType.INPUT,
    label: '关键词',
    prop: 'keyword',
    attrs: { placeholder: '请输入关键词' }
  },
  {
    tag: EFormComponentType.SELECT,
    label: '状态',
    prop: 'status',
    attrs: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  }
])
</script>
```

## Props

| 参数        | 说明              | 类型        | 默认值 |
| ----------- | ----------------- | ----------- | ------ |
| formBuilder | 表单构建器实例    | FormBuilder | -      |
| autoExpand  | 是否自动展开/收起 | boolean     | true   |
| expandDepth | 展开几层搜索      | number      | 1      |

## Events

| 事件名 | 说明               | 回调参数   |
| ------ | ------------------ | ---------- |
| change | 搜索条件变化时触发 | (formData) |

## Slots

| 插槽名      | 说明           |
| ----------- | -------------- |
| operation   | 操作按钮区域   |
| expand      | 展开/收起按钮  |
| endFormItem | 表单项结束插槽 |

## 完整示例

以下是一个包含所有组件类型的搜索表单完整示例：

```vue
<template>
  <c-search-form 
    :form-builder="searchFormBuilder"
    :auto-expand="true"
    :expand-depth="2"
    @change="handleSearchChange"
  >
    <template #operation>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="export">导出</el-button>
    </template>
  </c-search-form>
</template>

<script setup>
import { EFormComponentType } from '@/packages/components/c-form/core/constants/enum'
import { createFormItem } from '@/packages/components/c-form/core/helper/createFormItem'
import { useCreateFormBuilder } from '@/packages/components/c-form'

// 选项数据
const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
  { label: '待审核', value: 2 }
]

const typeOptions = [
  { label: '类型A', value: 'typeA' },
  { label: '类型B', value: 'typeB' },
  { label: '类型C', value: 'typeC' }
]

const cascaderOptions = [
  {
    value: 'beijing',
    label: '北京',
    children: [
      {
        value: 'beijing-city',
        label: '北京市'
      }
    ]
  },
  {
    value: 'shanghai',
    label: '上海',
    children: [
      {
        value: 'shanghai-city',
        label: '上海市'
      }
    ]
  }
]

const { formBuilder: searchFormBuilder } = useCreateFormBuilder([
  // 基础搜索字段
  createFormItem({
    tag: EFormComponentType.INPUT,
    label: '关键词',
    prop: 'keyword',
    attrs: {
      placeholder: '请输入关键词'
    },
    span: 8
  }),
  
  createFormItem({
    tag: EFormComponentType.SELECT,
    label: '状态',
    prop: 'status',
    attrs: {
      options: statusOptions,
      placeholder: '请选择状态'
    },
    span: 8
  }),
  
  createFormItem({
    tag: EFormComponentType.DATE,
    label: '创建日期',
    prop: 'createDate',
    attrs: {
      placeholder: '请选择日期',
      type: 'date'
    },
    span: 8
  }),
  
  // 日期范围搜索
  createFormItem({
    tag: EFormComponentType.DATE_RANGE,
    label: '时间范围',
    prop: 'dateRange',
    attrs: {
      placeholder: '请选择时间范围'
    },
    span: 12
  }),
  
  // 数字范围搜索
  createFormItem({
    tag: EFormComponentType.NUMBER_RANGE,
    label: '价格范围',
    prop: 'priceRange',
    attrs: {
      min: 0,
      max: 10000,
      precision: 2,
      separator: '至'
    },
    span: 12
  }),
  
  // 级联选择搜索
  createFormItem({
    tag: EFormComponentType.CASCADER,
    label: '地区',
    prop: 'region',
    attrs: {
      options: cascaderOptions,
      placeholder: '请选择地区'
    },
    span: 12
  }),
  
  // 搜索输入框
  createFormItem({
    tag: EFormComponentType.SEARCH_INPUT,
    label: '搜索内容',
    prop: 'searchContent',
    attrs: {
      placeholder: '请输入搜索内容'
    },
    span: 12
  }),
  
  // 下拉筛选组合
  createFormItem({
    tag: EFormComponentType.GROUP_SELECT_INPUT,
    label: '搜索条件',
    prop: 'searchCondition',
    attrs: {
      options: typeOptions
    },
    span: 12
  }),
  
  // 日期范围与下拉选择组合
  createFormItem({
    tag: EFormComponentType.DATE_RANGE_AND_SELECT_GROUP,
    label: '时间类型',
    prop: 'timeType',
    attrs: {
      options: typeOptions
    },
    span: 12
  }),
  
  // 单选框组
  createFormItem({
    tag: EFormComponentType.RADIO,
    label: '优先级',
    prop: 'priority',
    attrs: {
      options: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' }
      ]
    },
    span: 12
  }),
  
  // 开关搜索
  createFormItem({
    tag: EFormComponentType.SWITCH,
    label: '是否重要',
    prop: 'isImportant',
    span: 12
  }),
  
  // 数字输入
  createFormItem({
    tag: EFormComponentType.NUMBER_INPUT,
    label: '最小数量',
    prop: 'minQuantity',
    attrs: {
      min: 0,
      precision: 0
    },
    span: 12
  })
], {
  useRowLayout: true,
  // 搜索表单通常不需要验证规则
  rules: {}
})

// 搜索事件
const handleSearchChange = (formData) => {
  console.log('搜索条件变化:', formData)
}

// 执行搜索
const search = () => {
  const searchData = searchFormBuilder.getFormatData()
  console.log('执行搜索:', searchData)
  // 这里可以调用搜索 API
}

// 重置搜索条件
const reset = () => {
  searchFormBuilder.reset()
  console.log('搜索条件已重置')
}

// 导出数据
const export = () => {
  const searchData = searchFormBuilder.getFormatData()
  console.log('导出数据:', searchData)
  // 这里可以调用导出 API
}
</script>
```

### 示例说明

这个搜索表单示例展示了所有可用的组件类型在搜索场景中的应用：

1. **基础搜索字段** - 关键词、状态、日期等常用搜索条件
2. **范围搜索** - 日期范围、数字范围等区间搜索
3. **级联搜索** - 地区等层级数据的搜索
4. **组合搜索** - 下拉选择与输入框的组合搜索
5. **特殊搜索** - 开关、单选框等特殊搜索条件

### 搜索表单特点

- **自动展开/收起** - 根据屏幕宽度自动调整显示的表单项
- **响应式布局** - 支持不同屏幕尺寸的适配
- **多层级控制** - 可以控制展开的表单项层级
- **内置操作** - 提供搜索、重置、导出等常用操作
- **灵活配置** - 支持自定义操作按钮和表单项

## 特性

- 支持自动展开/收起
- 支持响应式布局调整
- 支持多层级展开控制
- 内置搜索和重置按钮

## 自动展开功能

### 基础展开

```vue
<template>
  <c-search-form 
    :form-builder="formBuilder"
    :auto-expand="true"
    :expand-depth="1"
  />
</template>
```

### 多层级展开

```vue
<template>
  <c-search-form 
    :form-builder="formBuilder"
    :auto-expand="true"
    :expand-depth="3"
  />
</template>
```

### 禁用自动展开

```vue
<template>
  <c-search-form 
    :form-builder="formBuilder"
    :auto-expand="false"
  />
</template>
```

## 自定义操作按钮

```vue
<template>
  <c-search-form :form-builder="formBuilder">
    <template #operation>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="export">导出</el-button>
    </template>
  </c-search-form>
</template>
```

## 源码位置

- 组件文件：`src/packages/components/c-search-form/index.vue`
- 依赖组件：`src/packages/components/c-form/index.vue`

## 相关组件

- [C-Form 表单组件](./c-form.md)
- [表单子组件](./form-components.md)

## 注意事项

1. 自动展开功能基于表单项的位置计算
2. 支持响应式布局调整
3. 内置搜索和重置功能
4. 支持自定义操作按钮
