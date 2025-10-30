# CTable 表格组件

`CTable` 是一个基于 Element Plus 的 Table 组件封装的增强型表格组件，提供了更便捷的配置方式和更强大的功能。

## 特性

- 支持列配置化
- 内置分页功能
- 支持列的拖拽排序
- 支持自定义渲染
- 支持服务端分页
- 支持 Element Plus Table 的所有属性和事件

## 基本用法

```vue
<template>
  <div class="table-container">
    <CTable :table-builder="tableBuilder" :columns="columns" />
  </div>
</template>

<script setup lang="tsx">
import { useCreateTableBuilder } from "ep-toolkit";

// 列配置
const columns = [
  {
    type: "index",
    label: "序号",
  },
  {
    label: "ID",
    prop: "id",
    draggable: true,
  },
  {
    label: "名称",
    prop: "name",
    showOverflowTooltip: true,
  },
  {
    label: "操作",
    contentRender: (_, row) => (
      <>
        <el-button type="primary" link onClick={() => handleEdit(row)}>
          编辑
        </el-button>
        <el-button type="danger" link onClick={() => handleDelete(row)}>
          删除
        </el-button>
      </>
    ),
  },
];

// 创建表格构建器
const { tableBuilder } = useCreateTableBuilder(columns, {
  // 表格配置
  headerCellStyle: {
    background: "#fafafc",
  },
  // 加载数据方法
  loadMethod: async (pagination) => {
    // 模拟异步请求
    const data = await fetchData(pagination);
    return {
      data: data.list,
      total: data.total,
    };
  },
});

// 注册事件
const { registerEvent } = tableBuilder;
registerEvent("pagination:change", (pagination) => {
  console.log("分页变化:", pagination);
});
</script>
```

## 属性

### CTable 属性

| 参数         | 说明           | 类型              | 可选值 | 默认值 |
| ------------ | -------------- | ----------------- | ------ | ------ |
| tableBuilder | 表格构建器实例 | `TableBuilder`    | -      | -      |
| columns      | 列配置         | `ICTableColumn[]` | -      | []     |

### TableBuilder 配置项

通过 `useCreateTableBuilder` 创建表格构建器时，可以传入以下配置：

| 参数            | 说明                         | 类型                                                                 | 默认值            |
| --------------- | ---------------------------- | -------------------------------------------------------------------- | ----------------- | ---- |
| loadMethod      | 加载数据的方法               | `(pagination: IPagination) => Promise<{ data: T[], total: number }>` | -                 |
| data            | 静态数据                     | `T[]`                                                                | []                |
| pagination      | 分页配置                     | `boolean                                                             | IPagination`      | true |
| tableAttrs      | 表格属性                     | `Partial<TableProps<T>>`                                             | {}                |
| headerCellStyle | 表头样式                     | `CSSProperties`                                                      | -                 |
| rowKey          | 行数据的 Key                 | `string`                                                             | 'id'              |
| showPagination  | 是否显示分页                 | `boolean`                                                            | true              |
| pageSizes       | 每页显示个数选择器的选项设置 | `number[]`                                                           | [10, 20, 50, 100] |

### 列配置 (ICTableColumn)

| 参数                | 说明                           | 类型                                                                      | 默认值    |
| ------------------- | ------------------------------ | ------------------------------------------------------------------------- | --------- | --------- | ------ |
| type                | 列类型                         | `'selection'                                                              | 'index'   | 'expand'` | -      |
| label               | 列标题                         | `string`                                                                  | -         |
| prop                | 对应列内容的字段名             | `string`                                                                  | -         |
| width               | 列宽度                         | `string                                                                   | number`   | -         |
| minWidth            | 列最小宽度                     | `string                                                                   | number`   | -         |
| fixed               | 列是否固定在左侧或者右侧       | `'left'                                                                   | 'right'   | boolean`  | -      |
| align               | 列对齐方式                     | `'left'                                                                   | 'center'  | 'right'`  | 'left' |
| headerAlign         | 表头对齐方式                   | `'left'                                                                   | 'center'  | 'right'`  | -      |
| showOverflowTooltip | 当内容过长被隐藏时显示 tooltip | `boolean`                                                                 | false     |
| formatter           | 用来格式化内容                 | `(row: T, column: TableColumnCtx<T>, cellValue: any) => any`              | -         |
| contentRender       | 自定义渲染单元格内容           | `(scope: { row: T, column: TableColumnCtx<T>, $index: number }) => VNode` | -         |
| headerRender        | 自定义渲染表头内容             | `(scope: { column: TableColumnCtx<T>, $index: number }) => VNode`         | -         |
| draggable           | 是否可拖拽排序                 | `boolean`                                                                 | false     |
| hidden              | 是否隐藏列                     | `boolean`                                                                 | false     |
| sortable            | 是否可排序                     | `boolean                                                                  | 'custom'` | false     |
| sortMethod          | 自定义排序方法                 | `(a: T, b: T) => number`                                                  | -         |
| filters             | 数据过滤的选项                 | `{ text: string, value: any }[]`                                          | -         |
| filterMethod        | 数据过滤使用的方法             | `(value: any, row: T) => boolean`                                         | -         |
| children            | 多级表头                       | `ICTableColumn[]`                                                         | -         |

## 事件

### CTable 事件

CTable 组件支持所有 Element Plus Table 的原生事件，包括但不限于：

- `select`: 当用户手动勾选数据行的 Checkbox 时触发
- `select-all`: 当用户手动勾选全选 Checkbox 时触发
- `selection-change`: 当选择项发生变化时触发
- `cell-mouse-enter`: 当单元格 hover 进入时触发
- `cell-mouse-leave`: 当单元格 hover 退出时触发
- `cell-contextmenu`: 当单元格被鼠标右键点击时触发
- `sort-change`: 当表格的排序条件发生变化时触发
- `filter-change`: 当表格的筛选条件发生变化时触发
- `row-click`: 当某一行被点击时触发
- `row-dblclick`: 当某一行被双击时触发
- `header-click`: 当某一列的表头被点击时触发
- `header-contextmenu`: 当某一列的表头被鼠标右键点击时触发
- `row-contextmenu`: 当某一行被鼠标右键点击时触发
- `expand-change`: 当用户对某一行展开或者关闭时触发
- `current-change`: 当表格的当前行发生变化时触发

### TableBuilder 事件

通过 `registerEvent` 方法注册事件：

```typescript
const { tableBuilder } = useCreateTableBuilder(columns, config);

// 注册分页变化事件
const unregister = tableBuilder.registerEvent(
  "pagination:change",
  (pagination) => {
    console.log("分页变化:", pagination);
    // 返回的函数用于取消事件监听
    // unregister();
  },
);
```

## 方法

### TableBuilder 方法

| 方法名                   | 说明                 | 参数                                                    | 返回值             |
| ------------------------ | -------------------- | ------------------------------------------------------- | ------------------ |
| `init`                   | 初始化表格           | `columns: ICTableColumn<T>[], config?: ITableConfig<T>` | `void`             |
| `initElTableInstance`    | 初始化表格实例       | `instance: TElTableRefInstance`                         | `void`             |
| `registerEvent`          | 注册事件             | `(eventName: CTableEventKeys, callback: TFunction)`     | 返回取消注册的函数 |
| `triggerEvent`           | 触发事件（内部使用） | `(eventName: CTableEventKeys, ...args: any[])`          | `void`             |
| `getTableRegisterEvents` | 获取表格注册的事件   | `emit: (eventName: E, ...args: any[]) => void`          | 事件处理对象       |
| `getPaginationEvents`    | 获取分页器事件       | `emit: (eventName: E, ...args: any[]) => void`          | 事件处理对象       |
| `updateTableData`        | 更新表格数据         | `data: T[]`                                             | `void`             |
| `updateSelectList`       | 更新选中数据         | `data: T[]`                                             | `void`             |
| `updatePagination`       | 更新分页配置         | `pagination: Partial<ICTablePagination>`                | `void`             |
| `refresh`                | 刷新表格数据         | `resetPagination?: boolean`                             | `Promise<void>`    |

## 插槽

CTable 组件完全兼容 Element Plus Table 组件的插槽系统，您可以使用以下插槽来自定义表格内容：

### 表格插槽

- `empty`: 当数据为空时显示的内容
- `append`: 插入至表格最后一行之后的内容
- `default`: 自定义默认内容

### 列插槽

列内容可以通过 `contentRender` 属性来自定义渲染，例如：

```typescript
const columns = [
  {
    label: '状态',
    prop: 'status',
    contentRender: (_, row) => (
      <el-tag type={row.status === 1 ? 'success' : 'danger'}>
        {row.status === 1 ? '启用' : '禁用'}
      </el-tag>
    )
  },
  {
    label: '操作',
    contentRender: (_, row) => (
      <>
        <el-button type="primary" link onClick={() => handleEdit(row)}>编辑</el-button>
        <el-button type="danger" link onClick={() => handleDelete(row)}>删除</el-button>
      </>
    )
  }
];
```

### 表头插槽

表头内容可以通过 `headerRender` 属性来自定义渲染：

```typescript
const columns = [
  {
    label: '状态',
    prop: 'status',
    headerRender: () => (
      <div>
        <span>状态</span>
        <el-tooltip content="状态说明" placement="top">
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    )
  }
];
```

## 示例

### 服务端分页

```typescript
const { tableBuilder } = useCreateTableBuilder(columns, {
  loadMethod: async (pagination) => {
    const { current, pageSize } = pagination;
    const { data } = await api.getList({
      page: current,
      pageSize,
    });

    return {
      data: data.list,
      total: data.total,
    };
  },
});
```

### 自定义表头

```typescript
const columns = [
  {
    label: '操作',
    headerRender: () => (
      <div>
        <span>操作</span>
        <el-tooltip content="这是操作列" placement="top">
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    ),
    contentRender: (_, row) => (
      <>
        <el-button type="primary" link onClick={() => handleEdit(row)}>编辑</el-button>
        <el-button type="danger" link onClick={() => handleDelete(row)}>删除</el-button>
      </>
    )
  }
];
```

### 可展开行

```typescript
const columns = [
  {
    type: 'expand',
    contentRender: (row) => (
      <div class="expand-content">
        <p>详情1: {row.detail1}</p>
        <p>详情2: {row.detail2}</p>
      </div>
    )
  },
  // 其他列...
];
```

## 注意事项

1. 使用 `loadMethod` 时，返回的数据结构需要包含 `data` 和 `total` 字段
2. 如果需要使用服务端排序或筛选，请确保在 `loadMethod` 中处理相应的参数
3. 列配置中的 `prop` 需要与数据中的字段名对应
4. 使用 `contentRender` 自定义渲染时，可以通过返回 `JSX.Element` 或 `VNode` 来实现复杂的渲染逻辑
