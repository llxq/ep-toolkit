<script setup lang="ts">
import type { ICFormNumberRangeAttrs } from "@/packages/components/c-form/core/types/formItemAttrs.ts";
import type { TEvent } from "@/packages/components/c-form/core/types/shared.ts";
import {
  type ICFormComponentModelValueEmit,
  useCFormComponentModelValue,
} from "@/packages/components/c-form/hooks/useCFormComponentModelValue.ts";
import type { InputEmits } from "element-plus";
import { isFunction, omit } from "lodash";
import { computed, onBeforeUnmount } from "vue";

defineOptions({
  name: "CFormNumberRange",
});

interface IBaseNumberRangeProps extends ICFormNumberRangeAttrs {
  on?: TEvent & Partial<InputEmits>;
  modelValue: [(string | number)?, (string | number)?];
  disabled?: boolean;
}

const props = withDefaults(defineProps<IBaseNumberRangeProps>(), {
  separator: "至",
  on: () => ({}),
  modelValue: () => [],
  inputWidth: "120px",
});

const emit = defineEmits<
  ICFormComponentModelValueEmit &
    ((event: "change", value: [number?, number?]) => void)
>();

const { value: modelValueWrapper } =
  useCFormComponentModelValue<IBaseNumberRangeProps>(props, emit);

const getParseModelValue = () =>
  (modelValueWrapper.value?.map?.((m) => {
    const value = parseFloat(String(m));
    return isNaN(value) ? void 0 : value;
  }) ?? []) as [number?, number?];

const numberRangeOn = computed(() =>
  omit(props.on, ["focus", "input", "change"]),
);

const sendEvent = (key: keyof TEvent) => {
  if (Reflect.has(props.on, key)) {
    const event = Reflect.get(props.on, key);
    if (isFunction(event)) {
      event(modelValueWrapper.value);
    }
  }
};

/**
 * 用于优化切换最大最小值输入的时候不会触发多次change
 */
let changeTimer: TUndefinable<ReturnType<typeof setTimeout>>;

const clearChangeTimer = (): void => {
  if (changeTimer) {
    clearTimeout(changeTimer);
  }
  changeTimer = void 0;
};

const focusHandler = () => {
  clearChangeTimer();
  sendEvent("focus");
};

const getParseRegexp = () => {
  let regExpStr = "^\\d+$";
  if (props.precision) {
    regExpStr = `^\\d+(\\.)?(\\d{1,${props.precision}})?$`;
  }
  return new RegExp(regExpStr);
};

/* 保存上一次的正确输入结果 */
let originValue: [(string | number)?, (string | number)?] = [
  ...modelValueWrapper.value,
];
const updateModelValue = (
  value: [(string | number)?, (string | number)?],
): void => {
  originValue = [...value];
  emit("update:modelValue", [...value]);
};

const inputHandler = (value: string | number, index: number) => {
  if (typeof value !== "number" && !value) {
    originValue[index] = value;
    return;
  }
  const { min, max } = props;
  const modelValue: [(string | number)?, (string | number)?] = [
    ...modelValueWrapper.value,
  ];
  if (value && !getParseRegexp().test(value as string)) {
    /* 如果不符合规则，则回退为上一次正确的内容 */
    updateModelValue(originValue);
    return;
  }
  const numericValue = Number(value);
  // 是否小于最小值
  const isMin = typeof min !== "undefined" && numericValue < min;
  // 是否大于最大值
  const isMax = typeof max !== "undefined" && numericValue > max;
  if (isMax || isMin) {
    modelValue.splice(index, 1, isMax ? (max as number) : (min as number));
    updateModelValue(modelValue);
  } else {
    originValue[index] = value;
  }
};

const changeHandler = () => {
  /* 默认两百毫秒的校验，防止用户输入完之后第一个输入框之后想要去输入第二个输入框的时候触发 change */
  changeTimer = setTimeout(() => {
    sendEvent("change");
    emit("change", getParseModelValue());
  }, 200);
  // 处理最后一位是.的情况，并且将数据类型转换为 number
  updateModelValue(getParseModelValue());
};

onBeforeUnmount(() => {
  clearChangeTimer();
});
</script>

<template>
  <div class="c-form-number-range__container">
    <template v-for="item in [0, 1]" :key="item">
      <el-input
        v-bind="item === 0 ? minProps : maxProps"
        v-model="modelValueWrapper[item]"
        v-paste-trim
        :disabled="disabled"
        v-on="numberRangeOn"
        @focus="focusHandler"
        @change="changeHandler"
        @input="inputHandler($event, item)"
      />
      <div v-if="item === 0" class="c-form-number-range__separator">至</div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.c-form-number-range {
  &__container {
    display: flex;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid var(--el-input-border-color, var(--el-border-color));
    gap: 8px;

    &:hover {
      border-color: var(--el-border-color-hover);
    }

    &:focus-within {
      border-color: var(--el-color-primary);
    }

    :deep(.el-input) {
      --el-input-width: v-bind(inputWidth);
      --el-input-height: 30px;
    }

    :deep(.el-input__wrapper) {
      width: 100%;
      box-shadow: none;
      flex-grow: initial;
      border: none;
      position: relative;
      padding: 0;

      .el-input__suffix {
        position: absolute;
        right: 0;
        background-color: #fff;
        padding-right: 8px;
      }

      &:hover {
        background-color: transparent;
      }

      .el-input__inner {
        text-align: center;
      }
    }
  }
}
</style>
