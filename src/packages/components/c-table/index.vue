<script setup lang="ts">
defineOptions({
  name: "CTable",
});

const { test } = defineProps<{
  test: number;
}>();
</script>

<template>
  <div class="c-table__container">this is c-table {{ test }}</div>
</template>

<style scoped lang="scss">
.c-table__container {
  //
}
</style>
