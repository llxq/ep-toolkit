<script setup lang="tsx">
import { isAsyncComponent } from "@/helper/is.ts";
import { EFormEvent } from "@/packages/components/c-form/core/constants/enum.ts";
import type { FormBuilder } from "@/packages/components/c-form/core/FormBuilder.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import { getFormItemEvent } from "@/packages/components/c-form/helper/parse.ts";
import { calculateRemainingRowSpan } from "@/packages/components/c-form/helper/row.ts";
import { useCForm } from "@/packages/components/c-form/hooks/useCForm.ts";
import { vEllipsis } from "@/packages/directives/ellipsis.ts";
import type { ElForm } from "element-plus";
import { isFunction } from "lodash";
import {
  defineAsyncComponent,
  type DefineComponent,
  resolveDynamicComponent,
  type VNode,
  withDirectives,
} from "vue";

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
  /**
   * 不使用泛形组件，使用 any 兼容各类型的 formBuilder
   */
  formBuilder: FormBuilder<any>;
}>();

const { formConfigManager, config } = formBuilder;

const { formRef, collectionComponentParentRef, componentParentInstanceMap } =
  useCForm(formBuilder);

const renderFormItem = (formItem: FormItem) => {
  const { elFormItemAttrs, prop, label, className = "" } = formItem;
  const RenderComponent = (
    isAsyncComponent(formItem.getFormComponent)
      ? defineAsyncComponent({
          loader: formItem.getFormComponent,
          delay: 0,
        })
      : resolveDynamicComponent(formItem.getFormComponent)
  ) as DefineComponent;
  const isRowLayout = config.useRowLayout;
  return (
    <el-form-item
      key={prop}
      {...elFormItemAttrs}
      prop={prop}
      class={`${className} c-form__form-item`}
      ref={(currentRef: unknown) =>
        !isRowLayout && collectionComponentParentRef(currentRef, formItem)
      }
      v-slots={{
        label: () =>
          isFunction(label)
            ? label(formItem)
            : withDirectives(<span>{label}</span>, [[vEllipsis]]),
      }}
      data-prop={isRowLayout ? void 0 : formItem.prop}
      data-visible={
        isRowLayout
          ? void 0
          : formItem.getVisible(formBuilder.hiddenProps, formBuilder.formData)
      }
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
          class="c-form__col"
          {...formItem.elColAttrs}
          key={formItem.prop}
          span={formItem.span}
          style={formItem.style}
          data-prop={formItem.prop}
          data-visible={formItem.getVisible(
            formBuilder.hiddenProps,
            formBuilder.formData,
          )}
          ref={(currentRef: unknown) =>
            collectionComponentParentRef(currentRef, formItem)
          }
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
  getComponentParentInstance: (prop: string) => {
    return componentParentInstanceMap.value[prop];
  },
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
        :class="[
          'c-form__form',
          {
            'is-form-layout': !config.useRowLayout,
            'is-form-row-layout': config.useRowLayout,
          },
        ]"
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
    width: 100%;

    &.has-operation {
      display: flex;
      column-gap: 16px;

      .c-form__body {
        flex: 1;
      }
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

    &.is-form-row-layout {
      :deep() {
        .el-form-item__content {
          & > div {
            width: 100%;
          }

          .c-form-number-range__container {
            .el-input {
              flex: 1;
            }
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
