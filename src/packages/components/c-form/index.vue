<script setup lang="tsx">
import type { FormBuilder } from "@/packages/components/c-form/core/FormBuilder.ts";
import type { ElForm } from "element-plus";
import { ref } from "vue";

defineOptions({
  name: "CForm",
});

const { formBuilder } = defineProps<{
  /* 不使用泛形组件，使用 any 兼容各类型的 formBuilder */
  formBuilder: FormBuilder<any>;
}>();

const { formConfigManager, config } = formBuilder;

const baseFormRef = ref<InstanceType<typeof ElForm>>();

const RenderFormContent = () => {
  return <div>{JSON.stringify(formBuilder.formData)}</div>;
};
</script>

<template>
  <div :class="['c-form__container', config.className]">
    <div class="c-form__body">
      <el-form
        ref="baseFormRef"
        class="base-form__form"
        v-bind="formConfigManager.getFormAttrs"
        :model="formBuilder.formData"
        @submit.prevent
      >
        <RenderFormContent />
      </el-form>
    </div>
    <div class="c-form__operation" />
  </div>
</template>

<style scoped lang="scss">
.c-form__container {
  //
}
</style>
