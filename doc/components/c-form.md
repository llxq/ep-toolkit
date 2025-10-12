# C-Form 表单组件

基于 Element Plus Form 的高级表单组件，支持动态表单构建和多种布局方式。

## 基础用法

```vue
<template>
  <c-form :form-builder="formBuilder" @change="handleChange">
    <template #operation>
      <el-button type="primary">提交</el-button>
    </template>
  </c-form>
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

## Props

| 参数        | 说明           | 类型        | 默认值 |
| ----------- | -------------- | ----------- | ------ |
| formBuilder | 表单构建器实例 | FormBuilder | -      |

## Events

| 事件名 | 说明               | 回调参数   |
| ------ | ------------------ | ---------- |
| change | 表单数据变化时触发 | (formData) |

## Slots

| 插槽名      | 说明           |
| ----------- | -------------- |
| operation   | 操作按钮区域   |
| endFormItem | 表单项结束插槽 |

## 完整示例

以下是一个包含所有组件类型的完整示例：

```vue
<template>
  <c-form :form-builder="formBuilder" @change="handleChange">
    <template #operation>
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button @click="reset">重置</el-button>
    </template>
  </c-form>
</template>

<script setup>
import { EFormComponentType } from '@/packages/components/c-form/core/constants/enum'
import { createFormItem } from '@/packages/components/c-form/core/helper/createFormItem'
import { useCreateFormBuilder } from '@/packages/components/c-form'

// 选项数据
const selectOptions = [
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' }
]

const cascaderOptions = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州'
      },
      {
        value: 'ningbo',
        label: '宁波'
      }
    ]
  }
]

const { formBuilder } = useCreateFormBuilder([
  // 输入框
  createFormItem({
    tag: EFormComponentType.INPUT,
    label: '用户名',
    prop: 'username',
    attrs: {
      placeholder: '请输入用户名'
    },
    span: 12
  }),
  
  // 下拉选择器
  createFormItem({
    tag: EFormComponentType.SELECT,
    label: '角色',
    prop: 'role',
    attrs: {
      options: selectOptions,
      placeholder: '请选择角色'
    },
    span: 12
  }),
  
  // 日期选择器
  createFormItem({
    tag: EFormComponentType.DATE,
    label: '创建日期',
    prop: 'createDate',
    attrs: {
      placeholder: '请选择日期',
      type: 'date'
    },
    span: 12
  }),
  
  // 日期范围选择器
  createFormItem({
    tag: EFormComponentType.DATE_RANGE,
    label: '日期范围',
    prop: 'dateRange',
    attrs: {
      placeholder: '请选择日期范围'
    },
    defaultValue: ['2023-01-01', '2023-12-31'],
    span: 12
  }),
  
  // 开关
  createFormItem({
    tag: EFormComponentType.SWITCH,
    label: '是否启用',
    prop: 'enabled',
    span: 12
  }),
  
  // 单选框组
  createFormItem({
    tag: EFormComponentType.RADIO,
    label: '性别',
    prop: 'gender',
    attrs: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    },
    span: 12
  }),
  
  // 搜索输入框
  createFormItem({
    tag: EFormComponentType.SEARCH_INPUT,
    label: '关键词',
    prop: 'keyword',
    attrs: {
      placeholder: '请输入搜索关键词'
    },
    span: 12
  }),
  
  // 级联选择器
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
  
  // 数字输入框
  createFormItem({
    tag: EFormComponentType.NUMBER_INPUT,
    label: '年龄',
    prop: 'age',
    attrs: {
      min: 0,
      max: 120,
      precision: 0
    },
    span: 12
  }),
  
  // 数字范围输入框
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
  
  // 下拉筛选组合
  createFormItem({
    tag: EFormComponentType.GROUP_SELECT_INPUT,
    label: '搜索条件',
    prop: 'searchCondition',
    attrs: {
      options: selectOptions
    },
    span: 12
  }),
  
  // 日期范围与下拉选择组合
  createFormItem({
    tag: EFormComponentType.DATE_RANGE_AND_SELECT_GROUP,
    label: '时间类型',
    prop: 'timeType',
    attrs: {
      options: selectOptions
    },
    span: 12
  })
], {
  useRowLayout: true,
  rules: {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    role: [
      { required: true, message: '请选择角色', trigger: 'change' }
    ]
  }
})

// 表单变化事件
const handleChange = (formData) => {
  console.log('表单数据变化:', formData)
}

// 重置表单
const reset = () => {
  formBuilder.reset()
}

// 提交表单
const submit = async () => {
  try {
    await formBuilder.validate()
    const formData = formBuilder.getFormatData()
    console.log('提交数据:', formData)
    // 这里可以调用 API 提交数据
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>
```

### 示例说明

这个完整示例展示了所有可用的表单组件类型：

1. **输入框 (INPUT)** - 基础文本输入
2. **下拉选择器 (SELECT)** - 单选下拉框
3. **日期选择器 (DATE)** - 单个日期选择
4. **日期范围选择器 (DATE_RANGE)** - 日期范围选择
5. **开关 (SWITCH)** - 布尔值开关
6. **单选框组 (RADIO)** - 单选按钮组
7. **搜索输入框 (SEARCH_INPUT)** - 带搜索图标的输入框
8. **级联选择器 (CASCADER)** - 多级联动选择
9. **数字输入框 (NUMBER_INPUT)** - 数字输入，支持精度控制
10. **数字范围输入框 (NUMBER_RANGE)** - 数字范围输入
11. **下拉筛选组合 (GROUP_SELECT_INPUT)** - 下拉选择器与输入框组合
12. **日期范围与下拉选择组合 (DATE_RANGE_AND_SELECT_GROUP)** - 日期范围与下拉选择器组合

### 关键特性

- **布局控制**: 使用 `span` 属性控制表单项宽度（12 = 50%, 24 = 100%）
- **表单验证**: 通过 `rules` 配置验证规则
- **默认值**: 使用 `defaultValue` 设置初始值
- **属性配置**: 通过 `attrs` 传递组件特定属性
- **事件处理**: 支持表单变化、重置、提交等事件

## 特性

- 支持动态表单构建
- 支持行布局和列布局
- 支持表单验证
- 支持异步组件加载
- 支持表单项显示/隐藏控制

## 布局模式

### 行布局（默认）

```vue
<template>
  <c-form :form-builder="formBuilder" />
</template>
```

### 列布局

```vue
<template>
  <c-form :form-builder="formBuilder" />
</template>

<script setup>
const { formBuilder } = useCreateFormBuilder(formItems, {
  useRowLayout: false
})
</script>
```

## 源码位置

- 组件文件：`src/packages/components/c-form/index.vue`
- 核心逻辑：`src/packages/components/c-form/core/FormBuilder.ts`
- 类型定义：`src/packages/components/c-form/core/types/`

## 相关组件

- [C-Search-Form 搜索表单组件](./c-search-form.md)
- [表单子组件](./form-components.md)

## 注意事项

1. 使用前需要先创建 FormBuilder 实例
2. 支持 TypeScript 类型推导
3. 支持动态表单项显示/隐藏
4. 支持异步组件加载
