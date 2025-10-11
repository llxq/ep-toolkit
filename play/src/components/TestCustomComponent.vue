<script setup lang="ts">
defineOptions({
  name: "TestCustomComponent",
});

const modelValue = defineModel({
  type: String,
});

const { test } = defineProps<{
  test: string;
}>();
</script>

<template>
  <div style="display: flex; width: 100%">
    <el-input v-model="modelValue" :placeholder="test" />
  </div>
</template>
