<script lang="ts" setup>
import { useMenuStore } from "@play/store/menu";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "LayoutSlider",
});

const menuStore = useMenuStore();
const route = useRoute();
const router = useRouter();

const isActive = (path: string) => {
  return route.path === path;
};

const updateRoute = (path: string) => {
  if (!isActive(path)) {
    router.push(path);
  }
};
</script>

<template>
  <div v-if="menuStore.menuList.length" class="layout-slider__container">
    <div
      v-for="item in menuStore.menuList"
      :key="item.category"
      class="layout-slider__category"
    >
      <div class="layout-slider__category__title">{{ item.category }}</div>

      <div
        v-for="subItem in item.menu"
        :key="subItem.path"
        class="layout-slider__menu"
        :class="{ 'is-active': isActive(subItem.path) }"
        @click="updateRoute(subItem.path)"
      >
        {{ subItem.title }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-slider {
  &__container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 24px 0;
    background-color: #fff;
    border-right: 1px solid #e2e8f0;
    box-sizing: border-box;
  }

  &__category {
    font-size: 18px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 0 24px;
  }

  &__menu {
    padding: 8px 24px 8px 32px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--el-color-text-regular);
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }

    &.is-active {
      color: var(--el-color-primary);
      font-weight: 500;
      background-color: #eff6ff;
    }
  }

  &__category__title {
    padding-bottom: 16px;
  }
}

/* Custom scrollbar */
.layout-slider__container::-webkit-scrollbar {
  width: 4px;
}

.layout-slider__container::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.layout-slider__container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}
</style>
