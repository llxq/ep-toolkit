<script setup lang="ts">
import { EFormComponentType } from "@/packages/components/c-form/core/constants/enum.ts";
import { createFormItem } from "@/packages/components/c-form/core/helper/createFormItem.ts";
import { useCreateFormBuilder } from "@/packages/components/c-form/core/hooks/useCreateFormBuilder.ts";

defineOptions({
  name: "TestForm",
});

const { formBuilder } = useCreateFormBuilder([
  createFormItem({
    tag: EFormComponentType.INPUT,
    label: "test",
    prop: "searchKey",
    attrs: {
      placeholder: "?",
    },
  }),
]);
</script>

<template>
  <CForm :form-builder="formBuilder" />
</template>

<style scoped lang="scss">
.test-form__container {
  //
}
</style>
