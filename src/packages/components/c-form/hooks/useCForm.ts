import type { FormBuilder } from "@/packages/components/c-form/core/FormBuilder.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import type { ElForm } from "element-plus";
import {
  type ComponentPublicInstance,
  onBeforeUnmount,
  ref,
  watch,
  watchPostEffect,
} from "vue";

export const useCForm = (formBuilder: FormBuilder) => {
  const formRef = ref<InstanceType<typeof ElForm>>();

  const componentParentInstanceMap = ref<TObj<string, ComponentPublicInstance>>(
    {},
  );
  const collectionComponentParentRef = (_ref: unknown, field: FormItem) => {
    const { prop } = field;
    if (prop) {
      Reflect.set(componentParentInstanceMap.value, prop, _ref);
    }
  };

  const stopWatch = watch(
    () => formBuilder.getShowFormItems,
    () => {
      if (formRef.value) {
        formBuilder.formInstanceManager.init(formRef);
      }
    },
    { flush: "post", deep: true },
  );

  const stopEffect = watchPostEffect(() => {
    if (formRef.value) {
      formBuilder.formInstanceManager.init(formRef);
    }
  });

  onBeforeUnmount(() => {
    stopWatch();
    stopEffect();
  });

  return {
    formRef,
    collectionComponentParentRef,
    componentParentInstanceMap,
  };
};
