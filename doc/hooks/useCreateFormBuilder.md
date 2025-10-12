# useCreateFormBuilder Hook

用于创建表单构建器的 Vue 3 Composition API Hook。

## 基础用法

```typescript
import { EFormComponentType } from '@/packages/components/c-form/core/constants/enum'
import { useCreateFormBuilder } from '@/packages/components/c-form'

const { formBuilder } = useCreateFormBuilder<{
  username: string
  email: string
}>([
  {
    tag: EFormComponentType.INPUT,
    label: '用户名',
    prop: 'username',
    attrs: { placeholder: '请输入用户名' }
  },
  {
    tag: EFormComponentType.INPUT,
    label: '邮箱',
    prop: 'email',
    attrs: { placeholder: '请输入邮箱' }
  }
])
```

## 动态表单构建

```typescript
import { EFormComponentType } from '@/packages/components/c-form/core/constants/enum'
import { useDynamicCreateFormBuilder } from '@/packages/components/c-form'

const { formBuilder } = useDynamicCreateFormBuilder<{
  searchKey: [string, string]
}>(({ formData }) => {
  return [
    {
      tag: EFormComponentType.GROUP_SELECT_INPUT,
      label: '搜索',
      prop: 'searchKey',
      attrs: {
        placeholder: formData.searchKey?.[1] === 'type1' ? '请输入类型1' : '请输入类型2'
      }
    }
  ]
})
```

## API

### useCreateFormBuilder

创建静态表单构建器。

#### 参数

| 参数   | 说明           | 类型                      | 默认值 |
| ------ | -------------- | ------------------------- | ------ |
| fields | 表单项配置数组 | (IFormItem \| FormItem)[] | []     |
| config | 表单配置       | ICreateFormBuilderConfig  | {}     |

#### 返回值

| 属性        | 说明           | 类型        |
| ----------- | -------------- | ----------- |
| formBuilder | 表单构建器实例 | FormBuilder |

### useDynamicCreateFormBuilder

创建动态表单构建器。

#### 参数

| 参数             | 说明                 | 类型                                       | 默认值 |
| ---------------- | -------------------- | ------------------------------------------ | ------ |
| getDynamicFields | 动态获取表单项的函数 | (formBuilder) => (IFormItem \| FormItem)[] | -      |
| config           | 表单配置             | ICreateFormBuilderConfig                   | {}     |

#### 返回值

| 属性        | 说明           | 类型        |
| ----------- | -------------- | ----------- |
| formBuilder | 表单构建器实例 | FormBuilder |

## 配置选项

### ICreateFormBuilderConfig

| 参数            | 说明            | 类型    | 默认值 |
| --------------- | --------------- | ------- | ------ |
| isAutoInit      | 是否自动初始化  | boolean | true   |
| useRowLayout    | 是否使用行布局  | boolean | true   |
| elRowAttrs      | el-row 属性     | object  | {}     |
| modelValue      | 表单数据        | object  | {}     |
| className       | 表单类名        | string  | -      |
| startLoading    | 是否开启loading | boolean | true   |
| initialFormData | 初始表单数据    | object  | {}     |
| baseTableRef    | 关联的表格引用  | Ref     | -      |

## 使用示例

### 基础表单

```typescript
import { EFormComponentType } from '@/packages/components/c-form/core/constants/enum'

const { formBuilder } = useCreateFormBuilder([
  {
    tag: EFormComponentType.INPUT,
    label: '用户名',
    prop: 'username',
    attrs: { 
      placeholder: '请输入用户名',
      required: true 
    }
  },
  {
    tag: EFormComponentType.SELECT,
    label: '角色',
    prop: 'role',
    attrs: {
      options: [
        { label: '管理员', value: 'admin' },
        { label: '用户', value: 'user' }
      ]
    }
  }
])
```

### 带配置的表单

```typescript
const { formBuilder } = useCreateFormBuilder(formItems, {
  useRowLayout: false,
  className: 'custom-form',
  elRowAttrs: {
    gutter: 20
  }
})
```

### 关联表格的表单

```typescript
const tableRef = ref()

const { formBuilder } = useCreateFormBuilder(formItems, {
  baseTableRef: tableRef
})

// 表单变化时自动刷新表格
formBuilder.onChange(() => {
  console.log('表单数据变化，表格将自动刷新')
})
```

### 动态表单

```typescript
import { EFormComponentType } from '@/packages/components/c-form/core/constants/enum'

const { formBuilder } = useDynamicCreateFormBuilder<{
  type: string
  config: any
}>(({ formData }) => {
  const items = [
    {
      tag: EFormComponentType.SELECT,
      label: '类型',
      prop: 'type',
      attrs: {
        options: [
          { label: '类型1', value: 'type1' },
          { label: '类型2', value: 'type2' }
        ]
      }
    }
  ]
  
  // 根据类型动态添加配置项
  if (formData.type === 'type1') {
    items.push({
      tag: EFormComponentType.INPUT,
      label: '配置1',
      prop: 'config',
      attrs: { placeholder: '请输入配置1' }
    })
  } else if (formData.type === 'type2') {
    items.push({
      tag: EFormComponentType.DATE,
      label: '配置2',
      prop: 'config',
      attrs: { type: 'date' }
    })
  }
  
  return items
})
```

## 源码位置

- Hook 文件：`src/packages/components/c-form/core/hooks/useCreateFormBuilder.ts`
- 相关类型：`src/packages/components/c-form/core/types/formProps.ts`

## 组件类型

### EFormComponentType 枚举

可用的表单组件类型：

| 类型                                             | 说明                       | 对应组件                    |
| ------------------------------------------------ | -------------------------- | --------------------------- |
| `EFormComponentType.INPUT`                       | 输入框                     | el-input                    |
| `EFormComponentType.SELECT`                      | 下拉框                     | base-select                 |
| `EFormComponentType.DATE`                        | 日期选择器                 | el-date-picker              |
| `EFormComponentType.DATE_RANGE`                  | 日期范围                   | date-range                  |
| `EFormComponentType.SWITCH`                      | 开关                       | el-switch                   |
| `EFormComponentType.RADIO`                       | 单选框                     | base-radio                  |
| `EFormComponentType.GROUP_SELECT_INPUT`          | 下拉筛选组合               | group-select-input          |
| `EFormComponentType.SEARCH_INPUT`                | 搜索框                     | base-search-input           |
| `EFormComponentType.CASCADER`                    | 级联下拉                   | el-cascader                 |
| `EFormComponentType.NUMBER_RANGE`                | 数字区间                   | number-range                |
| `EFormComponentType.DATE_RANGE_AND_SELECT_GROUP` | 日期时间区间和下拉选择组合 | date-range-and-select-group |
| `EFormComponentType.NUMBER_INPUT`                | 数字框                     | number-input                |

### 自定义组件

除了预定义的组件类型，还支持自定义组件：

```typescript
import MyCustomComponent from './MyCustomComponent.vue'

const { formBuilder } = useCreateFormBuilder([
  {
    tag: MyCustomComponent, // 直接传入组件
    label: '自定义组件',
    prop: 'custom',
    attrs: { /* 组件属性 */ }
  },
  {
    tag: 'div', // 或者使用字符串标签
    label: 'HTML 元素',
    prop: 'html',
    attrs: { style: { color: 'red' } }
  }
])
```

## 注意事项

1. 泛型参数必须传递，否则无法推导类型
2. 动态表单中如果使用了 formData，需要使用 useDynamicCreateFormBuilder
3. 支持与表格组件联动，表单变化时自动刷新表格
4. 支持 TypeScript 类型推导和检查
5. 使用 `EFormComponentType` 枚举可以获得更好的类型提示
6. 支持自定义组件和 HTML 元素
