<script setup lang="ts">
import { computed, useSlots } from "vue";

defineOptions({
  name: "CFormInput",
});

/**
 * 用于屏蔽打包类型报错
 */
const slots = useSlots() as unknown as Record<string, unknown>;

const slotKeys = computed<string[]>(() => Object.keys(slots));
</script>

<template>
  <el-input v-paste-trim class="base-input">
    <template v-for="name in slotKeys" #[name]>
      <slot :name="name" />
    </template>
  </el-input>
</template>
