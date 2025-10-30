<script setup lang="ts">
import {
  EFormComponentType,
  createCustomCFormItem,
  createFormItem,
  useCreateFormBuilder,
} from "ep-toolkit";
import TestCustomComponent from "@play/components/TestCustomComponent.vue";
import { repeatFormItems } from "@play/utils/array.ts";
import { ATTRS_OPTIONS, CASCADER_OPTIONS } from "@play/utils/options.ts";

defineOptions({
  name: "TestForm",
});

const { useRowLayout = true, expandDepth = 1 } = defineProps<{
  useRowLayout?: boolean;
  expandDepth?: number;
}>();

const { formBuilder } = useCreateFormBuilder(
  repeatFormItems<TObj>(
    [
      createFormItem({
        tag: EFormComponentType.INPUT,
        label: "input",
        prop: "input",
        attrs: {
          placeholder: "input",
        },
        defaultValue: "input",
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.SELECT,
        label: "select",
        prop: "select",
        attrs: {
          options: ATTRS_OPTIONS,
        },
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.DATE,
        label: "date",
        prop: "date",
        attrs: {
          placeholder: "date",
        },
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.DATE_RANGE,
        label: "date_range",
        prop: "date_range",
        attrs: {
          placeholder: "date",
        },
        defaultValue: ["2022-01-01 00:00:00", "2022-01-02 23:59:59"],
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.SWITCH,
        label: "switch",
        prop: "switch",
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.GROUP_SELECT_INPUT,
        label: "group_select_input",
        prop: "group_select_input",
        attrs: {
          options: ATTRS_OPTIONS,
        },
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.SEARCH_INPUT,
        label: "search_input",
        prop: "search_input",
        attrs: {
          placeholder: "search_input",
        },
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.CASCADER,
        label: "cascader",
        prop: "cascader",
        attrs: {
          placeholder: "cascader",
          options: CASCADER_OPTIONS,
        },
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.NUMBER_RANGE,
        label: "number_range",
        prop: "number_range",
        attrs: {
          separator: "至",
          precision: 2,
        },
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.NUMBER_INPUT,
        label: "number_input",
        prop: "number_input",
        attrs: {
          precision: 2,
        },
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.DATE_RANGE_AND_SELECT_GROUP,
        label: "date_range_and_select_group",
        prop: "date_range_and_select_group",
        attrs: {
          options: ATTRS_OPTIONS,
        },
        span: 8,
      }),
      createFormItem({
        tag: EFormComponentType.RADIO,
        label: "radio",
        prop: "radio",
        attrs: {
          options: ATTRS_OPTIONS,
        },
        span: 8,
      }),
      createCustomCFormItem({
        tag: TestCustomComponent,
        label: "test_custom_component",
        prop: "test_custom_component",
        attrs: {
          test: "test_custom_component",
        },
        span: 8,
      }),
    ],
    1,
  ),
  {
    useRowLayout,
    labelWidth: 100,
  },
);

formBuilder.onChange(() => {
  // eslint-disable-next-line
  console.log(formBuilder.getFormatData());
});
</script>

<template>
  <div class="search-form__container">
    <CSearchForm
      :form-builder="formBuilder"
      :expand-depth="expandDepth"
    ></CSearchForm>
  </div>
</template>

<style scoped lang="scss">
.search-form__container {
  padding: 16px 24px;
}
</style>
