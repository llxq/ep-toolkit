# useOpenDialog Hook

用于通过函数式方式打开弹框的 Vue 3 Composition API Hook。

## 基础用法

```typescript
import { useOpenDialog } from '@/packages/hooks'

const { openDialog, closeDialog } = useOpenDialog()

// 打开弹框
const handleOpenDialog = async () => {
  try {
    const result = await openDialog(MyDialogComponent, {
      title: '确认操作',
      content: '是否确认执行此操作？'
    })
    console.log('用户确认', result)
  } catch (error) {
    console.log('用户取消', error)
  }
}
```

## API

### useOpenDialog

#### 返回值

| 参数                        | 说明                   | 类型                                               |
| --------------------------- | ---------------------- | -------------------------------------------------- |
| openDialog                  | 打开弹框               | (loader, props?, closeId?, options?) => Promise<V> |
| closeDialog                 | 关闭弹框               | (id?, notCloseBeforeAllInstance?) => void          |
| openDialogIgnoreRouteChange | 忽略路由变化的打开弹框 | (loader, props?, closeId?, options?) => Promise<V> |

### openDialog

#### 参数

| 参数    | 说明       | 类型                         | 默认值 |
| ------- | ---------- | ---------------------------- | ------ |
| loader  | 组件加载器 | AsyncComponentLoader<T> \| T | -      |
| props   | 组件属性   | Partial<PropsOf<T>>          | {}     |
| closeId | 关闭标识   | TNumberOrString              | -      |
| options | 弹框选项   | IOpenDialogOptions           | {}     |

#### 返回值

| 类型       | 说明             |
| ---------- | ---------------- |
| Promise<V> | 弹框关闭时的结果 |

### IOpenDialogOptions

| 参数                      | 说明                     | 类型    | 默认值 |
| ------------------------- | ------------------------ | ------- | ------ |
| notCloseBeforeRouteChange | 路由变化时不自动关闭弹框 | boolean | false  |

## 使用示例

### 基础弹框

```vue
<!-- MyDialog.vue -->
<template>
  <el-dialog v-model="visible" title="确认操作" @close="handleClose">
    <p>是否确认执行此操作？</p>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['dialog:confirm', 'dialog:cancel'])

const visible = ref(true)

const handleConfirm = () => {
  emit('dialog:confirm', { message: '操作成功' })
}

const handleCancel = () => {
  emit('dialog:cancel')
}

const handleClose = () => {
  visible.value = false
}
</script>
```

```typescript
// 使用弹框
import MyDialog from './MyDialog.vue'

const { openDialog } = useOpenDialog()

const showDialog = async () => {
  try {
    const result = await openDialog(MyDialog, {
      title: '确认操作'
    })
    console.log('用户确认', result)
  } catch (error) {
    console.log('用户取消')
  }
}
```

### 异步组件弹框

```typescript
const { openDialog } = useOpenDialog()

const showAsyncDialog = async () => {
  try {
    const result = await openDialog(() => import('./AsyncDialog.vue'), {
      title: '异步弹框'
    })
    console.log('异步弹框结果', result)
  } catch (error) {
    console.log('异步弹框取消')
  }
}
```

### 手动关闭弹框

```typescript
const { openDialog, closeDialog } = useOpenDialog()

const showDialog = async () => {
  const dialogId = 'my-dialog'
  
  try {
    const result = await openDialog(MyDialog, {
      title: '手动关闭弹框'
    }, dialogId)
    console.log('弹框结果', result)
  } catch (error) {
    console.log('弹框取消')
  }
  
  // 2秒后手动关闭
  setTimeout(() => {
    closeDialog(dialogId)
  }, 2000)
}
```

### 忽略路由变化

```typescript
const { openDialogIgnoreRouteChange } = useOpenDialog()

const showPersistentDialog = async () => {
  try {
    const result = await openDialogIgnoreRouteChange(MyDialog, {
      title: '持久化弹框'
    })
    console.log('弹框结果', result)
  } catch (error) {
    console.log('弹框取消')
  }
}
```

### 带参数的弹框

```vue
<!-- UserDialog.vue -->
<template>
  <el-dialog v-model="visible" :title="title">
    <p>用户信息：{{ userInfo.name }}</p>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps<{
  title: string
  userInfo: {
    name: string
    email: string
  }
}>()

const emit = defineEmits(['dialog:confirm', 'dialog:cancel'])

const visible = ref(true)

const handleConfirm = () => {
  emit('dialog:confirm', { user: props.userInfo })
}

const handleCancel = () => {
  emit('dialog:cancel')
}
</script>
```

```typescript
// 使用带参数的弹框
const { openDialog } = useOpenDialog()

const showUserDialog = async () => {
  try {
    const result = await openDialog(UserDialog, {
      title: '用户详情',
      userInfo: {
        name: '张三',
        email: 'zhangsan@example.com'
      }
    })
    console.log('用户信息', result)
  } catch (error) {
    console.log('用户取消')
  }
}
```

## 事件系统

弹框组件需要支持以下事件：

### 必需事件

- `dialog:confirm` - 确认事件
- `dialog:cancel` - 取消事件

### 事件示例

```vue
<template>
  <el-dialog v-model="visible" @dialog:confirm="handleConfirm" @dialog:cancel="handleCancel">
    <!-- 弹框内容 -->
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['dialog:confirm', 'dialog:cancel'])

const handleConfirm = (data) => {
  emit('dialog:confirm', data)
}

const handleCancel = () => {
  emit('dialog:cancel')
}
</script>
```

## 特性

- 支持同步和异步组件
- 支持 Promise 链式调用
- 自动处理路由变化
- 支持手动关闭
- 支持组件属性传递
- 自动清理弹框实例

## 源码位置

- Hook 文件：`src/packages/hooks/useOpenDialog.ts`

## 注意事项

1. 弹框组件必须支持 `dialog:confirm` 和 `dialog:cancel` 事件
2. 路由变化时会自动关闭弹框（除非使用 `openDialogIgnoreRouteChange`）
3. 支持异步组件加载
4. 弹框关闭时会自动清理 DOM 和事件监听器
5. 必须在 Vue 组件的 setup 函数中使用
