<script setup lang="ts">
/**
 * 因为使用 el-button 在表格行中内容无法自动换行
 */
defineOptions({
  name: "CTableLinkButton",
});

const emit = defineEmits<{
  click: [MouseEvent];
}>();
</script>

<template>
  <div class="c-table-link-button" @click="(e) => emit('click', e)">
    <slot name="default"></slot>
  </div>
</template>

<style scoped lang="scss">
.c-table-link-button {
  cursor: pointer;
  color: var(--el-color-primary);
  min-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: #4080ff;
  }
}
</style>
