import { computed, type WritableComputedRef } from "vue";

interface ICFormComponentModelValueProps {
  /* 为了其他组件继承使用 */
  modelValue: any;
}

/* 为了其他组件继承使用 */
export type ICFormComponentModelValueEmit<T = any> = (
  event: "update:modelValue",
  value: T,
) => void;

export const useCFormComponentModelValue = <
  T extends ICFormComponentModelValueProps,
>(
  props: T,
  emit: ICFormComponentModelValueEmit,
) => {
  const value: WritableComputedRef<T["modelValue"]> = computed({
    get() {
      return props.modelValue;
    },
    set(_value) {
      emit("update:modelValue", _value);
    },
  });

  return {
    value,
  };
};
