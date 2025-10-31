<script setup lang="ts">
import { useEvent } from "@/packages/hooks";
import { ArrowDown, ArrowUp, CloseBold } from "@element-plus/icons-vue";
import { ElInput } from "element-plus";
import { debounce } from "lodash";
import { computed, nextTick, onMounted, ref } from "vue";

const { count } = defineProps<{
  count: number;
}>();

const emit = defineEmits<{
  find: [string, number];
  hidden: [];
}>();

const currentIndex = ref(0);

const keyword = ref("");

const showSearchInput = ref(false);

const inputRef = ref<InstanceType<typeof ElInput>>();

const { on } = useEvent();

const update = (index: number) => {
  currentIndex.value = index;
  emit("find", keyword.value, index);
};

const find = debounce(() => {
  update(0);
}, 500);

const prev = () => {
  const index = currentIndex.value > 0 ? currentIndex.value - 1 : count - 1;
  update(index);
};

const next = () => {
  const index = currentIndex.value + 1 < count ? currentIndex.value + 1 : 0;
  update(index);
};

const show = async () => {
  showSearchInput.value = true;
  await nextTick();
  inputRef.value?.focus();
};

const hidden = () => {
  showSearchInput.value = false;
  keyword.value = "";
  currentIndex.value = 0;
  emit("hidden");
};

const getShowIndex = computed(() => {
  if (!count) {
    return 0;
  }
  return currentIndex.value + 1;
});

onMounted(() => {
  on("keydown", (event) => {
    const target = event.target as HTMLElement;
    const isInputTrigger = inputRef.value?.$el?.contains?.(target);
    const { key, metaKey, ctrlKey } = event;
    switch (key) {
      case "f":
        if (metaKey || ctrlKey) {
          event.preventDefault();
          show();
        }
        break;
      case "Escape":
        hidden();
        break;
      case "ArrowUp":
        isInputTrigger && event.preventDefault();
        prev();
        break;
      case "ArrowDown":
        isInputTrigger && event.preventDefault();
        next();
        break;
    }
  });
});
</script>

<template>
  <Teleport to="body">
    <div v-if="showSearchInput" class="c-table__column-search">
      <el-input
        ref="inputRef"
        v-model="keyword"
        placeholder="请输入搜索关键字"
        @input="find"
        @keydown.enter="next"
      >
        <template #append>
          <div class="c-table__column-search__count">
            {{ getShowIndex }}/{{ count }}
          </div>
          <div class="c-table__column-search__icon">
            <el-icon :class="count ? 'is-active' : 'is-disable'" @click="prev">
              <ArrowUp />
            </el-icon>
            <el-icon :class="count ? 'is-active' : 'is-disable'" @click="next">
              <ArrowDown />
            </el-icon>
            <el-icon @click="hidden"><CloseBold /></el-icon>
          </div>
        </template>
      </el-input>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.c-table__column-search {
  --table-search-z-index: 99999;
  position: absolute;
  top: 8px;
  right: 355px;
  z-index: var(--table-search-z-index);
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;

  .el-input {
    border-radius: var(--el-input-border-radius);
    height: 50px;
    width: 370px;

    :deep() {
      .el-input__wrapper {
        box-shadow: unset;

        .el-input__inner {
          color: #000;
        }
      }

      .el-input-group__append {
        background-color: #fff;
        box-shadow: unset;
        padding: 0 16px;
        user-select: none;

        .c-table__column-search__count {
          padding-right: 16px;
          color: #000;
          font-size: 12px;
        }

        .c-table__column-search__icon {
          background-color: transparent;
          display: flex;
          align-items: center;
          position: relative;
          gap: 16px;
          padding-left: 16px;

          &:after {
            content: "";
            position: absolute;
            width: 1px;
            height: 26px;
            left: 0;
            background-color: #ddd;
          }

          .el-icon {
            cursor: pointer;
          }

          .is-active {
            color: #000;
          }

          .is-disable {
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>
