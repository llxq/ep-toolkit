<script setup lang="ts">
import { EFormComponentType } from "@/packages/components/c-form/core/constants/enum.ts";
import { createCustomCFormItem } from "@/packages/components/c-form/core/helper/createCustomCFormItem.ts";
import { createFormItem } from "@/packages/components/c-form/core/helper/createFormItem.ts";
import { useCreateFormBuilder } from "@/packages/components/c-form/core/hooks/useCreateFormBuilder.ts";
import TestCustomComponent from "@play/components/TestCustomComponent.vue";

defineOptions({
  name: "TestForm",
});

const { formBuilder } = useCreateFormBuilder<{ test: string }>(
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
      tag: EFormComponentType.SEARCH_INPUT,
      label: "test2",
      prop: "test2",
      attrs: {
        placeholder: "test2",
      },
      defaultValue: "test2",
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.GROUP_SELECT_INPUT,
      label: "test3",
      prop: "test3",
      attrs: {
        options: [
          {
            label: "option1",
            value: "option1",
            type: "long",
          },
          {
            label: "option2",
            value: "option2",
            maxlength: 10,
          },
        ],
      },
      span: 8,
    }),
    createFormItem({
      tag: EFormComponentType.NUMBER_RANGE,
      label: "test4",
      prop: "test4",
      attrs: {
        // placeholder: "test4",
        precision: 2,
      },
      // defaultValue: 123,
      span: 8,
    }),
    createCustomCFormItem({
      tag: TestCustomComponent,
      label: "test5",
      prop: "test5",
      attrs: {
        test: "test",
      },
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.SELECT,
      label: "test6",
      prop: "test6",
      attrs: {
        options: [
          {
            label: "option1",
            value: "option1",
            type: "long",
          },
          {
            label: "option2",
            value: "option2",
            maxlength: 10,
          },
        ],
      },
      span: 8,
    }),
  ],
  { useRowLayout: true },
);

formBuilder.onChange(() => {
  // eslint-disable-next-line
  console.log(formBuilder.getFormatData());
});

const reset = () => {
  formBuilder.reset();
};
</script>

<template>
  <CForm :form-builder="formBuilder">
    <template #operation> 123 </template>
    <template #endFormItem> asdfasdf </template>
  </CForm>
  <el-button type="primary" @click="reset">重置</el-button>
</template>

<style scoped lang="scss">
.test-form__container {
  //
}
</style>
