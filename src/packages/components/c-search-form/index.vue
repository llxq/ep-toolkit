<script setup lang="tsx">
import { isHiddenNode } from "@/helper/html.ts";
import { EFormEvent } from "@/packages/components/c-form/core/constants/enum.ts";
import type { FormBuilder } from "@/packages/components/c-form/core/FormBuilder.ts";
import CForm from "@/packages/components/c-form/index.vue";
import { useResizeObserver } from "@/packages/hooks";
import { epToolkitConfigService } from "@/packages/store/config/index.service.ts";
import { ArrowDownBold, Refresh, Search } from "@element-plus/icons-vue";
import { isString } from "lodash";
import { nextTick, ref, type VNode, watch } from "vue";

defineOptions({
  name: "CSearchForm",
});

defineSlots<{
  operation: () => void;
  expand: () => void;
  endFormItem: () => VNode;
}>();

const emit = defineEmits<{
  change: TAllType;
}>();

const {
  formBuilder,
  autoExpand = true,
  expandDepth = 1,
} = defineProps<{
  /**
   * 不使用泛形组件，使用 any 兼容各类型的 formBuilder
   */
  formBuilder: FormBuilder<any>;
  /**
   * 是否自动展开/收起，如果该值设置为了 false，则 expandDepth 无效
   * @default true
   */
  autoExpand?: boolean;
  /**
   * 展开几层搜索，只有大于1的时候才会处理，否则都默认为1
   */
  expandDepth?: number;
}>();

const isExpand = ref(false);
const showExpand = ref(false);

const cFormRef = ref<InstanceType<typeof CForm>>();
const calcFieldsVisible = async () => {
  formBuilder.hiddenProps.clear();
  if (!autoExpand) {
    return;
  }
  if (isHiddenNode(cFormRef.value?.formRef?.$el)) {
    return;
  }
  await nextTick();
  showExpand.value = true;
  const topStack: [number, number] = [] as unknown as [number, number];
  const distance = 5;
  let level = 1;
  formBuilder.getShowFormItems.forEach((formItem) => {
    const { prop } = formItem;
    if (prop && isString(prop)) {
      const instance = cFormRef.value?.getComponentParentInstance?.(prop);
      if (instance) {
        const el = instance.$el;
        if (el) {
          const { top } = el.getBoundingClientRect() ?? {};
          if (!topStack.length) {
            topStack.push(top ?? 0);
          } else {
            // 只有大于1的时候才会处理，否则都默认为1
            if (expandDepth > 1) {
              const [firstTop, endTop] = topStack;
              if (Math.abs(top - (endTop || firstTop)) > distance) {
                if (level++ < expandDepth) {
                  topStack.splice(1, 0, top);
                } else {
                  formBuilder.hiddenProps.add(prop);
                }
              }
            } else {
              const [firstTop] = topStack;
              Math.abs(top - firstTop) > distance &&
                formBuilder.hiddenProps.add(prop);
            }
          }
        }
      }
    }
  });
  if (!formBuilder.hiddenProps.size) {
    showExpand.value = false;
  }
};

watch(
  () => [formBuilder.formItems, autoExpand, expandDepth],
  () => {
    void calcFieldsVisible();
  },
  { flush: "post", deep: true, immediate: true },
);

const { onResize } = useResizeObserver();
onResize(() => cFormRef.value?.$el, calcFieldsVisible);

const toggleExpand = () => {
  isExpand.value = !isExpand.value;
};

const search = () => {
  formBuilder.emit(EFormEvent.SEARCH);
};

const reset = () => {
  // 是否触发查询
  formBuilder.reset(
    epToolkitConfigService.formConfig?.resetTriggerQuery ? void 0 : "change",
  );
};
</script>

<template>
  <div class="c-search-form__container">
    <CForm
      ref="cFormRef"
      :class="['c-search-form', { 'is-not-expand': !isExpand }]"
      :form-builder="formBuilder"
      @change="emit('change', $event)"
    >
      <template #operation>
        <slot name="expand">
          <div
            v-if="autoExpand && showExpand"
            :class="['c-search-form__toggle-expand', { 'is-expand': isExpand }]"
            @click="toggleExpand"
          >
            <el-icon>
              <ArrowDownBold />
            </el-icon>
            {{ isExpand ? "收起" : "展开" }}
          </div>
        </slot>
      </template>
      <template #endFormItem>
        <slot name="endFormItem"></slot>
      </template>
    </CForm>
    <div class="c-search-form__operation">
      <slot name="operation" v-bind="{ search, reset }">
        <el-button type="primary" :icon="Search" @click="search">
          查询
        </el-button>
        <el-button
          class="c-search-form__reset-btn"
          :icon="Refresh"
          @click="reset"
        >
          重置
        </el-button>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-search-form {
  --c-search-form-expand-btn-color: #4e5969;

  &.is-not-expand {
    :deep() {
      .el-col,
      .c-form__form-item {
        &[data-visible="false"] {
          display: none;
        }
      }
    }
  }

  &__toggle-expand {
    width: max-content;
    display: flex;
    align-items: center;
    height: 32px;
    column-gap: 6px;
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;
    color: var(--c-search-form-expand-btn-color);
    user-select: none;

    .el-icon {
      transition: all 0.3s ease-in-out;
    }
  }

  &__operation {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 8px;
    width: 100%;

    .el-button {
      width: 80px;
    }
  }

  &__reset-btn {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }
}
</style>
