# 表单子组件

本文档介绍所有可用的表单子组件，这些组件通常与 C-Form 或 C-Search-Form 配合使用。

## 组件列表

- [CFormInput 输入框](#cforminput-输入框)
- [CFormSelect 选择器](#cformselect-选择器)
- [CFormDate 日期选择器](#cformdate-日期选择器)
- [CFormCascader 级联选择器](#cformcascader-级联选择器)
- [CFormRadio 单选框组](#cformradio-单选框组)
- [CFormNumberInput 数字输入框](#cformnumberinput-数字输入框)
- [CFormNumberRange 数字范围输入框](#cformnumberrange-数字范围输入框)
- [CFormSearchInput 搜索输入框](#cformsearchinput-搜索输入框)
- [CFormDateRangeAndSelectGroup 日期范围选择器组合](#cformdaterangeandselectgroup-日期范围选择器组合)
- [CFormSelectInputGroup 选择器输入框组合](#cformselectinputgroup-选择器输入框组合)

---

## CFormInput 输入框

基于 Element Plus Input 的输入框组件。

### 基础用法

```vue
<template>
  <c-form-input v-model="value" placeholder="请输入内容" />
</template>
```

### 特性

- 支持所有 Element Plus Input 属性
- 自动粘贴去空格
- 支持插槽透传

### 源码位置

- 组件文件：`src/packages/components/c-form/components/CFormInput.vue`

---

## CFormSelect 选择器

基于 Element Plus Select 的选择器组件，支持选项动态加载。

### 基础用法

```vue
<template>
  <c-form-select 
    v-model="value" 
    :options="options"
    placeholder="请选择"
  />
</template>

<script setup>
const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' }
]
</script>
```

### Props

| 参数           | 说明           | 类型    | 默认值 |
| -------------- | -------------- | ------- | ------ |
| options        | 选项数据       | Array   | []     |
| width          | 选择器宽度     | string  | 100%   |
| reserveKeyword | 是否保留关键字 | boolean | true   |
| showArrow      | 是否显示箭头   | boolean | true   |

### 特性

- 支持选项动态加载
- 支持多选
- 支持搜索过滤
- 支持选项分组

### 源码位置

- 组件文件：`src/packages/components/c-form/components/CFormSelect.vue`

---

## CFormDate 日期选择器

基于 Element Plus DatePicker 的日期选择器组件。

### 基础用法

```vue
<template>
  <c-form-date 
    v-model="date"
    type="date"
    placeholder="选择日期"
  />
</template>
```

### Props

| 参数                | 说明                        | 类型    | 默认值 |
| ------------------- | --------------------------- | ------- | ------ |
| autoAddSeconds      | 是否自动加上秒              | boolean | true   |
| useDefaultTimeToDay | 是否使用一天的开始/结束时间 | boolean | true   |
| showNow             | 是否显示"现在"按钮          | boolean | true   |

### 特性

- 支持多种日期类型
- 支持日期范围选择
- 支持时间选择
- 自动格式化时间

### 源码位置

- 组件文件：`src/packages/components/c-form/components/CFormDate.vue`

---

## CFormCascader 级联选择器

基于 Element Plus Cascader 的级联选择器组件。

### 基础用法

```vue
<template>
  <c-form-cascader 
    v-model="value"
    :options="cascaderOptions"
    placeholder="请选择"
  />
</template>

<script setup>
const cascaderOptions = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州'
      }
    ]
  }
]
</script>
```

### Props

| 参数    | 说明           | 类型   | 默认值 |
| ------- | -------------- | ------ | ------ |
| options | 级联数据       | Array  | []     |
| width   | 选择器宽度     | string | 100%   |
| props   | 级联选择器配置 | Object | {}     |

### 特性

- 支持多选
- 支持懒加载
- 支持搜索
- 支持自定义节点内容

### 源码位置

- 组件文件：`src/packages/components/c-form/components/CFormCascader.vue`

---

## CFormRadio 单选框组

基于 Element Plus Radio 的单选框组组件。

### 基础用法

```vue
<template>
  <c-form-radio 
    v-model="value"
    :options="radioOptions"
  />
</template>

<script setup>
const radioOptions = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' }
]
</script>
```

### Props

| 参数    | 说明       | 类型  | 默认值 |
| ------- | ---------- | ----- | ------ |
| options | 单选项数据 | Array | []     |

### 特性

- 支持选项动态加载
- 支持按钮样式
- 支持禁用状态

### 源码位置

- 组件文件：`src/packages/components/c-form/components/CFormRadio.vue`

---

## CFormNumberInput 数字输入框

专门用于数字输入的表单组件。

### 基础用法

```vue
<template>
  <c-form-number-input 
    v-model="number"
    :min="0"
    :max="100"
    :precision="2"
  />
</template>
```

### Props

| 参数      | 说明       | 类型    | 默认值 |
| --------- | ---------- | ------- | ------ |
| precision | 小数位数   | number  | -      |
| max       | 最大值     | number  | -      |
| min       | 最小值     | number  | 0      |
| clearable | 是否可清空 | boolean | true   |

### 特性

- 自动数字验证
- 支持精度控制
- 支持范围限制
- 自动格式化输入

### 源码位置

- 组件文件：`src/packages/components/c-form/components/CFormNumberInput.vue`

---

## CFormNumberRange 数字范围输入框

用于输入数字范围的组件。

### 基础用法

```vue
<template>
  <c-form-number-range 
    v-model="range"
    :min="0"
    :max="1000"
    separator="至"
  />
</template>
```

### Props

| 参数       | 说明       | 类型   | 默认值  |
| ---------- | ---------- | ------ | ------- |
| min        | 最小值     | number | -       |
| max        | 最大值     | number | -       |
| precision  | 小数位数   | number | -       |
| separator  | 分隔符     | string | "至"    |
| inputWidth | 输入框宽度 | string | "120px" |

### 特性

- 支持范围验证
- 自定义分隔符
- 防抖处理
- 自动格式化

### 源码位置

- 组件文件：`src/packages/components/c-form/components/CFormNumberRange.vue`

---

## CFormSearchInput 搜索输入框

带搜索图标的输入框组件。

### 基础用法

```vue
<template>
  <c-form-search-input 
    v-model="keyword"
    placeholder="请输入搜索关键词"
    @change="handleSearch"
  />
</template>
```

### 特性

- 内置搜索图标
- 支持清空功能
- 自动粘贴去空格
- 支持所有 Input 属性

### 源码位置

- 组件文件：`src/packages/components/c-form/components/CFormSearchInput.vue`

---

## CFormDateRangeAndSelectGroup 日期范围选择器组合

日期范围选择器与下拉选择器的组合组件。

### 基础用法

```vue
<template>
  <c-form-date-range-and-select-group 
    v-model="dateRange"
    :options="selectOptions"
    select-width="120px"
  />
</template>

<script setup>
const dateRange = ['2023-01-01', '2023-01-31', 'type1']
const selectOptions = [
  { label: '类型1', value: 'type1' },
  { label: '类型2', value: 'type2' }
]
</script>
```

### Props

| 参数                      | 说明                 | 类型    | 默认值  |
| ------------------------- | -------------------- | ------- | ------- |
| options                   | 下拉选项             | Array   | []      |
| selectWidth               | 下拉框宽度           | string  | "100px" |
| disabledSelectByEmptyData | 数据为空时禁用下拉框 | boolean | true    |
| selectToFirst             | 下拉框是否在前       | boolean | false   |
| defaultSelectFirst        | 默认选中第一项       | boolean | false   |
| whenEmptyDateClearSelect  | 日期为空时清空选择   | boolean | false   |

### 特性

- 日期与选择器联动
- 支持位置调整
- 支持禁用控制
- 自动数据同步

### 源码位置

- 组件文件：`src/packages/components/c-form/components/CFormDateRangeAndSelectGroup.vue`

---

## CFormSelectInputGroup 选择器输入框组合

下拉选择器与输入框的组合组件。

### 基础用法

```vue
<template>
  <c-form-select-input-group 
    v-model="selectInput"
    :options="options"
    placeholder="请输入"
  />
</template>

<script setup>
const selectInput = ['inputValue', 'selectValue']
const options = [
  { 
    label: '选项1', 
    value: 'option1',
    placeholder: '请输入选项1相关内容',
    maxlength: 50,
    type: 'text'
  }
]
</script>
```

### Props

| 参数               | 说明                 | 类型    | 默认值  |
| ------------------ | -------------------- | ------- | ------- |
| options            | 下拉选项             | Array   | []      |
| selectWidth        | 下拉框宽度           | string  | "100px" |
| changeOnSelect     | 选择时是否触发change | boolean | false   |
| defaultSelectFirst | 默认选中第一项       | boolean | true    |
| selectToFirst      | 下拉框是否在前       | boolean | false   |

### 特性

- 选择器与输入框联动
- 支持动态占位符
- 支持输入限制
- 支持长整型输入

### 源码位置

- 组件文件：`src/packages/components/c-form/components/CFormSelectInputGroup.vue`

---

## 使用示例

### 在表单中使用

```vue
<template>
  <c-form :form-builder="formBuilder" />
</template>

<script setup>
import { useCreateFormBuilder } from '@/packages/components/c-form'

const { formBuilder } = useCreateFormBuilder([
  {
    tag: 'input',
    label: '用户名',
    prop: 'username',
    attrs: { placeholder: '请输入用户名' }
  },
  {
    tag: 'select',
    label: '状态',
    prop: 'status',
    attrs: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  },
  {
    tag: 'date',
    label: '创建时间',
    prop: 'createTime',
    attrs: { type: 'date' }
  }
])
</script>
```

## 注意事项

1. 所有表单组件都基于 Element Plus 构建
2. 支持 TypeScript 类型推导
3. 部分组件依赖特定指令（如 v-paste-trim）
4. 数字输入组件会自动进行数值验证和格式化
5. 日期组件支持多种格式，建议根据实际需求选择合适的日期类型
