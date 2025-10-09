<script setup lang="ts">
import { EFormComponentType } from "@/packages/components/c-form/core/constants/enum.ts";
import { createFormItem } from "@/packages/components/c-form/core/helper/createFormItem.ts";
import { useCreateFormBuilder } from "@/packages/components/c-form/core/hooks/useCreateFormBuilder.ts";

defineOptions({
  name: "TestForm",
});

const { formBuilder } = useCreateFormBuilder<{ test: string; test2: string }>(
  [
    createFormItem({
      tag: EFormComponentType.INPUT,
      label: "test",
      prop: "test",
      attrs: {
        placeholder: "test",
      },
      defaultValue: "test",
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.INPUT,
      label: "test2",
      prop: "test2",
      attrs: {
        placeholder: "test2",
      },
      defaultValue: "test2",
      span: 12,
    }),
  ],
  { useRowLayout: true },
);

formBuilder.onChange(() => {
  // eslint-disable-next-line
  console.log("is change");
});
</script>

<template>
  <CForm :form-builder="formBuilder" />
</template>

<style scoped lang="scss">
.test-form__container {
  //
}
</style>
