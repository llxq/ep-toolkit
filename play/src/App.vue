<script setup lang="ts">
import TestForm from "@play/components/test-form.vue";
import TestSearchForm from "@play/components/test-search-form.vue";
</script>

<template>
  <el-divider content-position="center">
    c-search-form【useRowLayout】[展示两行】
  </el-divider>
  <test-search-form :expand-depth="2" />
  <el-divider content-position="center">
    c-search-form【not useRowLayout】【展示一行】
  </el-divider>
  <test-search-form :use-row-layout="false" />
  <el-divider content-position="center">c-form</el-divider>
  <test-form />
  <CAutoTooltip />
</template>

<style scoped lang="scss"></style>
