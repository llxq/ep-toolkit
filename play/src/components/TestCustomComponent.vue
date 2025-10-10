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
    {{ test }}
    <el-input v-model="modelValue" />
  </div>
</template>
