<script lang="ts" setup>
import { CaretTop, CopyDocument, Switch } from "@element-plus/icons-vue";
import { copyText } from "ep-toolkit";
import { ref, watchEffect } from "vue";
import { useMenuStore } from "@play/store/menu";
import { useRoute, useRouter } from "vue-router";
import hljs from "highlight.js";
import { ElMessage } from "element-plus";

defineOptions({
  name: "DocView",
});

const router = useRoute();
const { push } = useRouter();
const menuStore = useMenuStore();

const code = ref<string>("");
const showCode = ref(false);

watchEffect(async () => {
  const currentMenuItem = menuStore.findMenuItem(router.path);
  if (!currentMenuItem) {
    // 默认跳转第一个
    const category = menuStore.menuList[0];
    await push({
      path: category.menu[0].path,
    });
    return;
  }
  if (currentMenuItem?.codePath) {
    showCode.value = false;
    const currentCode = menuStore.menuCodeMap[currentMenuItem.codePath];
    const result = hljs.highlight(currentCode, { language: "typescript" });
    code.value = result.value;
  }
});

/**
 * 允许通过的键
 */
const allowKeys = [
  {
    key: "a",
    ctrl: true,
  },
  {
    key: "c",
    ctrl: true,
  },
  {
    key: "r",
    ctrl: true,
  },
  {
    // 向上箭头
    key: "arrowup",
    ctrl: false,
  },
  {
    // 向下箭头
    key: "arrowdown",
    ctrl: false,
  },
  {
    // 向左箭头
    key: "arrowleft",
    ctrl: false,
  },
  {
    // 向右箭头
    key: "arrowright",
    ctrl: false,
  },
];

const disableKeydown = (event: KeyboardEvent) => {
  const currentKey = event.key.toLowerCase();
  if (
    allowKeys.some((item) =>
      item.ctrl
        ? item.key === currentKey && (event.ctrlKey || event.metaKey)
        : item.key === currentKey,
    )
  ) {
    return;
  }
  event.preventDefault();
};

const disableInput = (e: Event) => {
  e.preventDefault();
};

const copy = async () => {
  const currentMenuItem = menuStore.findMenuItem(router.path)!;
  const currentCode = menuStore.menuCodeMap[currentMenuItem.codePath!];
  await copyText(currentCode);
  ElMessage({
    message: "复制成功",
    type: "success",
    plain: true,
  });
};

const toggleCode = () => {
  showCode.value = !showCode.value;
};
</script>

<template>
  <div class="doc-view__container">
    <div class="doc-view__content">
      <slot></slot>
    </div>
    <div class="doc-view__code">
      <div
        :class="[
          'doc-view__code__operation',
          {
            'is-show-code': showCode,
          },
        ]"
      >
        <el-tooltip content="显示源代码" placement="top">
          <div class="icon-button" @click="toggleCode">
            <el-icon><Switch /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="复制源代码" placement="top">
          <div class="icon-button" @click="copy">
            <el-icon><CopyDocument /></el-icon>
          </div>
        </el-tooltip>
      </div>
      <div
        v-if="showCode"
        class="doc-view__code__content"
        contenteditable
        @keydown="disableKeydown"
        @paste="disableInput"
        @drop="disableInput"
      >
        <!-- eslint-disable-next-line -->
        <pre><code class="language-typescript" v-html="code"></code></pre>
      </div>
    </div>
    <div v-if="showCode" class="doc-view__footer">
      <el-button type="info" link @click="toggleCode">
        <el-icon>
          <CaretTop />
        </el-icon>
        隐藏源代码
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.doc-view {
  &__container {
    height: 100%;
    width: 100%;
    overflow: auto;
  }

  &__code {
    margin-top: 36px;
    border: 1px solid #ddd;

    &__operation {
      padding: 10px;
      display: flex;
      justify-content: flex-start;
      column-gap: 8px;

      .icon-button {
        cursor: pointer;
        width: 24px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;

        &:hover {
          color: #409eff;
        }
      }

      &.is-show-code {
        border-bottom: 1px solid #ddd;
      }
    }

    &__content {
      padding: 0 12px;
      outline: none;
    }
  }

  &__footer {
    text-align: center;
    padding: 14px;

    .el-button {
      outline: none;

      .el-icon {
        margin-right: 6px;
      }
    }
  }
}
</style>
