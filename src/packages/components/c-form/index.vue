<script setup lang="tsx">
import type { FormBuilder } from "@/packages/components/c-form/core/FormBuilder.ts";
import type { ElForm } from "element-plus";
import { type DefineComponent, ref } from "vue";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import { getFormItemEvent } from "@/packages/components/c-form/helper/parse.ts";
import { EFormEvent } from "@/packages/components/c-form/core/constants/enum.ts";

defineOptions({
  name: "CForm",
});

const emit = defineEmits<{
  change: any;
}>();

const { formBuilder } = defineProps<{
  /* 不使用泛形组件，使用 any 兼容各类型的 formBuilder */
  formBuilder: FormBuilder<any>;
}>();

const { formConfigManager, config } = formBuilder;

const cFormRef = ref<InstanceType<typeof ElForm>>();

const renderFormItem = (formItem: FormItem) => {
  const { elFormItemAttrs, prop, label, className } = formItem;
  const RenderComponent = formItem.getFormComponent as DefineComponent;
  return (
    <el-form-item
      key={prop}
      {...elFormItemAttrs}
      prop={prop}
      label={label}
      class={className}
    >
      <RenderComponent
        {...formItem.attrs}
        {...getFormItemEvent(formItem, (...args) => {
          formBuilder.emit(EFormEvent.CHANGE);
          emit("change", ...args);
        })}
        v-model={formBuilder.formData[prop]}
      ></RenderComponent>
    </el-form-item>
  );
};
const FormContentComponent = () => {
  if (!config.useRowLayout) {
    return formBuilder.getShowColumns.map(renderFormItem);
  }
  return (
    <el-row
      class="c-form__row"
      {...formConfigManager.getRowAttrs}
      style={config?.elRowAttrs?.style}
    >
      {formBuilder.getShowColumns.map((formItem) => (
        <el-col
          {...formItem.elColAttrs}
          key={formItem.prop}
          span={formItem.span}
          style={formItem.style}
          data-prop={formItem.prop}
          data-visible={formItem.visible}
        >
          {renderFormItem(formItem)}
        </el-col>
      ))}
    </el-row>
  );
};
</script>

<template>
  <div :class="['c-form__container', config.className]">
    <div class="c-form__body">
      <el-form
        ref="cFormRef"
        class="c-form__form"
        v-bind="formConfigManager.getFormAttrs"
        :model="formBuilder.formData"
        @submit.prevent
      >
        <FormContentComponent />
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
