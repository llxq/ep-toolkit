<script setup lang="ts">
import {
  EFormComponentType,
  createCustomCFormItem,
  createFormItem,
  useCreateFormBuilder,
} from "ep-toolkit";
import { ATTRS_OPTIONS, CASCADER_OPTIONS } from "@play/utils/options";
import { ElMessage } from "element-plus";
import TestCustomComponent from "@play/components/TestCustomComponent.vue";

defineOptions({
  name: "PlayForm",
});

const { useRowLayout = true } = defineProps<{
  useRowLayout?: boolean;
}>();

const { formBuilder } = useCreateFormBuilder(
  [
    createFormItem({
      tag: EFormComponentType.INPUT,
      label: "input",
      prop: "input",
      attrs: {
        placeholder: "input",
      },
      defaultValue: "input",
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.SELECT,
      label: "select",
      prop: "select",
      attrs: {
        options: ATTRS_OPTIONS,
      },
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.DATE,
      label: "date",
      prop: "date",
      attrs: {
        placeholder: "date",
      },
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.DATE_RANGE,
      label: "date_range",
      prop: "date_range",
      attrs: {
        placeholder: "date",
      },
      defaultValue: ["2022-01-01 00:00:00", "2022-01-02 23:59:59"],
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.SWITCH,
      label: "switch",
      prop: "switch",
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.GROUP_SELECT_INPUT,
      label: "group_select_input",
      prop: "group_select_input",
      attrs: {
        options: ATTRS_OPTIONS,
      },
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.SEARCH_INPUT,
      label: "search_input",
      prop: "search_input",
      attrs: {
        placeholder: "search_input",
      },
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.CASCADER,
      label: "cascader",
      prop: "cascader",
      attrs: {
        placeholder: "cascader",
        options: CASCADER_OPTIONS,
      },
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.NUMBER_RANGE,
      label: "number_range",
      prop: "number_range",
      attrs: {
        separator: "至",
        precision: 2,
      },
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.NUMBER_INPUT,
      label: "number_input",
      prop: "number_input",
      attrs: {
        precision: 2,
      },
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.DATE_RANGE_AND_SELECT_GROUP,
      label: "date_range_and_select_group",
      prop: "date_range_and_select_group",
      attrs: {
        options: ATTRS_OPTIONS,
      },
      span: 12,
    }),
    createFormItem({
      tag: EFormComponentType.RADIO,
      label: "radio",
      prop: "radio",
      attrs: {
        options: ATTRS_OPTIONS,
      },
      span: 12,
    }),
    createCustomCFormItem({
      tag: TestCustomComponent,
      label: "test_custom_component",
      prop: "test_custom_component",
      attrs: {
        test: "test_custom_component",
      },
      span: 12,
    }),
    createCustomCFormItem({
      tag: "__example__",
      label: "example",
      prop: "example",
      attrs: {
        test: "example",
      },
      span: 12,
    }),
    {
      tag: "div",
      label: "div",
      prop: "div",
      attrs: {
        style: {
          width: "100%",
          height: "20px",
          background: "red",
        },
      },
      span: 12,
    },
  ],
  {
    useRowLayout,
    rules: {
      cascader: [{ required: true, message: "test", trigger: "blur" }],
    },
    labelPosition: "top",
  },
);

formBuilder.onChange(() => {
  // eslint-disable-next-line
  console.log(formBuilder.getFormatData());
});

const reset = () => {
  formBuilder.reset();
};

const submit = async () => {
  await formBuilder.validate();
  ElMessage.success("提交成功");
};
</script>

<template>
  <div class="play-form__container">
    <CForm :form-builder="formBuilder">
      <template #operation>operation</template>
      <template #endFormItem>end form item</template>
    </CForm>
    <el-button plain type="primary" @click="reset">重置</el-button>
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>

<style scoped lang="scss">
.play-form__container {
  padding: 16px 24px;
}
</style>
