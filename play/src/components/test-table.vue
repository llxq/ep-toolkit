<script setup lang="ts">
defineOptions({
  name: "TestTable",
});
</script>

<template>
  <div class="test-table__container">
    <c-table :test="1" />
  </div>
</template>

<style scoped lang="scss">
.test-table__container {
  //
}
</style>
