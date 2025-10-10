<script setup lang="ts">
import CForm from "@/packages/components/c-form/index.vue";
import type { FormBuilder } from "@/packages/components/c-form/core/FormBuilder.ts";
import { nextTick, ref, watch, watchPostEffect } from "vue";
import { isHiddenNode } from "@/helper/html.ts";
import { useResizeObserver } from "@/packages/hooks";
import { isString } from "lodash";

defineOptions({
  name: "CSearchForm",
});

const emit = defineEmits<{
  change: TAllType;
}>();

const { formBuilder, expandDepth = 1 } = defineProps<{
  /* 不使用泛形组件，使用 any 兼容各类型的 formBuilder */
  formBuilder: FormBuilder<any>;
  /**
   * 展开几层搜索
   */
  expandDepth?: number;
}>();

const isExpand = ref(false);

const cFormRef = ref<InstanceType<typeof CForm>>();
const calcFieldsVisible = async () => {
  if (isHiddenNode(cFormRef.value?.formRef?.$el)) {
    return;
  }
  formBuilder.hiddenProps.clear();
  if (!isExpand.value) {
    await nextTick();
    // 第一个为最高位
    const topStack: [number, number] = [];
    // 距离
    const distance = 5;
    formBuilder.getShowFormItems.forEach((formItem) => {
      const { prop } = formItem;
      if (prop && isString(prop)) {
        const instance =
          formBuilder.formInstanceManager.getFormItemInstanceByProp(prop);
        if (instance) {
          const el = instance.$el;
          if (el) {
            const { top } = el.getBoundingClientRect() ?? {};
            if (!topStack.length) {
              topStack.push(top ?? 0);
              formBuilder.hiddenProps.delete(prop);
            } else {
              const [firstTop] = topStack;
              const hidden = Math.abs(top - firstTop) > distance;
              if (hidden) {
                formBuilder.hiddenProps.add(prop);
              } else {
                formBuilder.hiddenProps.delete(prop);
              }
            }
          }
        }
      }
    });
  }
};

watch(
  () =>
    formBuilder.formItems.map((m) => {
      return {
        visible: m.validateIsHidden(formBuilder.formData),
      };
    }),
  () => {
    void calcFieldsVisible();
  },
  { flush: "post", deep: true, immediate: true },
);

const { onResize } = useResizeObserver();
onResize(() => cFormRef.value?.$el, calcFieldsVisible);
</script>

<template>
  <CForm
    ref="cFormRef"
    :form-builder="formBuilder"
    @change="emit('change', $event)"
  ></CForm>
</template>

<style scoped lang="scss"></style>
