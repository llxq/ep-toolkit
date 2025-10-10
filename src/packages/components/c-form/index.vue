<script setup lang="tsx">
import { EFormEvent } from "@/packages/components/c-form/core/constants/enum.ts";
import type { FormBuilder } from "@/packages/components/c-form/core/FormBuilder.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import { getFormItemEvent } from "@/packages/components/c-form/helper/parse.ts";
import { calculateRemainingRowSpan } from "@/packages/components/c-form/helper/row.ts";
import { useCForm } from "@/packages/components/c-form/hooks/useCForm.ts";
import { vEllipsis } from "@/packages/directives/ellipsis.ts";
import type { ElForm } from "element-plus";
import { isFunction } from "lodash";
import { type DefineComponent, type VNode, withDirectives } from "vue";

defineOptions({
  name: "CForm",
});

const slots = defineSlots<{
  operation: () => void;
  endFormItem: () => VNode;
}>();

const emit = defineEmits<{
  change: TAllType;
}>();

const { formBuilder } = defineProps<{
  /* 不使用泛形组件，使用 any 兼容各类型的 formBuilder */
  formBuilder: FormBuilder<any>;
}>();

const { formConfigManager, config } = formBuilder;

const { formRef, collectionRef } = useCForm(formBuilder);

const renderFormItem = (formItem: FormItem) => {
  const { elFormItemAttrs, prop, label, className } = formItem;
  const RenderComponent = formItem.getFormComponent as DefineComponent;
  return (
    <el-form-item
      key={prop}
      {...elFormItemAttrs}
      prop={prop}
      class={className}
      ref={(currentRef: unknown) => collectionRef(currentRef, formItem)}
      v-slots={{
        label: () =>
          isFunction(label)
            ? label(formItem)
            : withDirectives(<span>{label}</span>, [[vEllipsis]]),
      }}
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
    const renderFormItems = formBuilder.getShowFormItems.map(renderFormItem);
    if (slots.endFormItem) {
      renderFormItems.push(slots.endFormItem());
    }
    return renderFormItems;
  }
  // 拿到所有的 span,获取余数
  const remainder = calculateRemainingRowSpan(formBuilder.getShowFormItems);
  return (
    <el-row
      class="c-form__row"
      {...formConfigManager.getRowAttrs}
      style={config?.elRowAttrs?.style}
    >
      {formBuilder.getShowFormItems.map((formItem) => (
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
      {slots.endFormItem ? (
        <el-col span={remainder}>{slots.endFormItem()}</el-col>
      ) : null}
    </el-row>
  );
};

defineExpose({
  formRef,
});
</script>

<template>
  <div
    :class="[
      'c-form__container',
      config.className,
      { 'has-operation': !!slots.operation },
    ]"
  >
    <div v-loading="!formBuilder.isInit" class="c-form__body">
      <el-form
        v-if="formBuilder.isInit"
        ref="formRef"
        :class="['c-form__form', { 'is-form-layout': !config.useRowLayout }]"
        v-bind="formConfigManager.getFormAttrs"
        :model="formBuilder.formData"
        @submit.prevent
      >
        <FormContentComponent />
      </el-form>
    </div>
    <div class="c-form__operation">
      <slot name="operation"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-form {
  &__container {
    &.has-operation {
      display: flex;
      column-gap: 16px;
    }
  }

  &__row {
    width: 100%;
  }

  &__form {
    &.is-form-layout {
      display: flex;
      column-gap: 24px;
      flex-wrap: wrap;

      :deep() {
        .el-input {
          --el-input-width: 180px;
        }

        .el-date-editor.el-input__wrapper {
          --el-date-editor-width: 355px;
        }

        .base-number-input__container {
          .el-input {
            --el-input-width: 180px;
          }
        }
      }
    }

    :deep() {
      .el-cascader__tags {
        width: calc(100% - 36px);
        flex-wrap: nowrap;
      }

      .el-cascader {
        .el-tag.is-closable {
          max-width: 86px;
        }
      }
    }
  }
}
</style>
