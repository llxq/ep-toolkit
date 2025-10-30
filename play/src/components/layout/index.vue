<script lang="ts" setup>
import LayoutSlider from "@play/components/layout/LayoutSlider.vue";
import DocView from "../DocView.vue";

defineOptions({
  name: "Layout",
});
</script>

<template>
  <div class="layout">
    <el-container class="layout__container">
      <el-aside width="200px" class="layout__aside">
        <LayoutSlider />
      </el-aside>
      <el-main class="layout__main">
        <DocView>
          <router-view />
        </DocView>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.layout {
  &__container {
    height: 100vh;
    width: 100vw;
    background-color: #fff;
  }

  &__main {
    padding-bottom: 16px;
    overflow: auto;
  }
}
</style>
