<script setup lang="ts">
import type { ICFormNumberInputAttrs } from "@/packages/components/c-form/core/types/formItemAttrs.ts";
import type { TEvent } from "@/packages/components/c-form/core/types/shared.ts";
import {
  type ICFormComponentModelValueEmit,
  useCFormComponentModelValue,
} from "@/packages/components/c-form/hooks/useCFormComponentModelValue.ts";
import { useGetPureAttrs } from "@/packages/components/c-form/hooks/useGetPureAttrs.ts";
import { omit } from "lodash";
import { computed } from "vue";

defineOptions({
  name: "CFormNumberInput",
});

export interface ICFormNumberInputProps
  extends Omit<ICFormNumberInputAttrs, "modelValue"> {
  on?: TEvent;
  modelValue: number | string | null | undefined;
}

const props = withDefaults(defineProps<ICFormNumberInputProps>(), {
  on: () => ({}),
  modelValue: "",
  clearable: true,
  min: 0,
});
const emit = defineEmits<
  ICFormComponentModelValueEmit &
    ((e: "change", value: number | string) => void)
>();
const { value } = useCFormComponentModelValue(props, emit);

const [bindProps] = useGetPureAttrs(props, [
  "on",
  "modelValue",
  "precision",
  "max",
  "min",
]);

let originValue = props.modelValue as string | number;
const updateModelValue = (newValue: number | string): void => {
  let _val = newValue;
  if (isNaN(Number(_val))) {
    _val = originValue;
  }
  if (originValue !== _val) {
    originValue = _val;
  }
  value.value = originValue;
};

const getParseRegexp = () => {
  let regExpStr = "^\\d+$";
  if (props.precision) {
    regExpStr = `^\\d+(\\.)?(\\d{1,${props.precision}})?$`;
  }
  return new RegExp(regExpStr);
};

const changeHandler = () => {
  updateModelValue(parseFloat(originValue as string));
  props.on?.change?.(originValue);
  emit("change", originValue);
};

const inputHandler = (_value: string | number) => {
  /* 如果 _value 为空，并且不为 required 则直接返回 */
  if (typeof _value !== "number" && !_value) {
    updateModelValue(_value);
    return;
  }
  const { min, max } = props;
  if (_value && !getParseRegexp().test(_value as string)) {
    /* 如果不符合规则，则回退为上一次正确的内容 */
    updateModelValue(originValue);
    return;
  }
  const numericValue = Number(_value);
  // 是否小于最小值
  const isMin = typeof min !== "undefined" && numericValue < min;
  // 是否大于最大值
  const isMax = typeof max !== "undefined" && numericValue > max;
  updateModelValue(isMax ? max : isMin ? min : _value);
  props.on?.input?.(originValue);
};

const bindOn = computed(() => omit(props.on, ["change", "input"]));
</script>

<template>
  <el-input
    v-bind="bindProps"
    v-model="value"
    v-paste-trim
    class="c-form-number-input"
    v-on="bindOn"
    @input="inputHandler"
    @change="changeHandler"
  >
    <template #suffix>
      <slot name="suffix" />
    </template>
  </el-input>
</template>

<style scoped lang="scss">
.c-form-number-input {
  .el-input__suffix {
    .el-input__suffix-inner {
      flex-direction: row-reverse;
      gap: 6px;
    }
  }
}
</style>
