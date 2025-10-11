<script setup lang="ts">
import { handleLongMaxValue } from "@/helper/number.ts";
import type {
  ICFormSelectInputGroupAttrs,
  ISelectInputGroupOption,
} from "@/packages/components/c-form/core/types/formItemAttrs.ts";
import type {
  IStyle,
  TEvent,
} from "@/packages/components/c-form/core/types/shared.ts";
import { useCFormComponentModelValue } from "@/packages/components/c-form/hooks/useCFormComponentModelValue.ts";
import { useCFormComponentOptions } from "@/packages/components/c-form/hooks/useCFormComponentOptions.ts";
import { useGetPureAttrs } from "@/packages/components/c-form/hooks/useGetPureAttrs.ts";
import { CircleClose, Search } from "@element-plus/icons-vue";
import type { InputEmits } from "element-plus";
import { isObject, isString } from "lodash";
import { computed } from "vue";

defineOptions({
  name: "CFormSelectInputGroup",
});

const props = withDefaults(
  defineProps<
    ICFormSelectInputGroupAttrs & {
      on?: TEvent & Partial<InputEmits>;
      modelValue: [string?, string?];
    }
  >(),
  {
    changeOnSelect: false,
    /* select 的默认宽度 */
    selectWidth: "100px",
    modelValue: () => [],
    on: () => ({}),
    /* 默认选中第一个 */
    defaultSelectFirst: true,
    selectToFirst: false,
  },
);

const emit = defineEmits<{
  change: [[string?, string?]];
  suffixClick: [string];
  "update:modelValue": [string[]];
}>();

const { value: modelValueWrapper } = useCFormComponentModelValue<{
  modelValue: [string?, string?];
}>(props, emit);

const { parseOptions, loadingOptions } = useCFormComponentOptions(props, () => {
  if (props.defaultSelectFirst) {
    if (!modelValueWrapper.value?.length && parseOptions.value.length) {
      emit("update:modelValue", [
        "",
        (parseOptions.value[0]?.value as string) ?? "",
      ]);
    }
  }
});

const getCalcStyle: (width?: string, attr?: IStyle) => IStyle = (
  selectDefaultWidth,
  selectAttrs = {},
) => {
  if (!selectAttrs.style) {
    selectAttrs.style = {
      width: selectDefaultWidth,
    };
  } else {
    const style = selectAttrs.style;
    if (isString(style)) {
      selectAttrs.style = `width: ${selectDefaultWidth}; ${style}`;
    } else if (isObject(style)) {
      if (!style.width) {
        style.width = selectDefaultWidth;
      }
    }
  }
  return selectAttrs;
};

const selectAttrs = computed(() => {
  const _selectAttrs = getCalcStyle(props.selectWidth, props.selectAttrs);
  const defaultAttrs: Partial<ICFormSelectInputGroupAttrs> = {};
  return Object.assign(defaultAttrs, _selectAttrs);
});

const inputChangeEvent = () => {
  emit("change", modelValueWrapper.value);
};

const getInputPlaceholder = computed(() => {
  const option = parseOptions.value.find(
    (item) => item.value === modelValueWrapper.value[1],
  ) as ISelectInputGroupOption;
  return option?.placeholder ?? props.placeholder;
});

const getCurrentOptions = computed(
  () =>
    parseOptions.value.find(
      (item) => item.value === modelValueWrapper.value[1],
    ) as TUndefinable<ISelectInputGroupOption>,
);

const updateInputValue = (inputValue: string) => {
  const [, key] = modelValueWrapper.value;
  let parseValue = inputValue;
  if (getCurrentOptions.value?.type === "long") {
    parseValue = handleLongMaxValue(inputValue);
  }
  emit("update:modelValue", [parseValue, key || ""]);
};

const selectChangeEvent = () => {
  const originInputValue = modelValueWrapper.value[0];
  // 清空输入框的值
  updateInputValue("");
  /* 如果输入框的值不为空还是需要触发change的 */
  if (props.changeOnSelect || originInputValue) {
    inputChangeEvent();
  }
};

const [getInputProps] = useGetPureAttrs(props, [
  "modelValue",
  "placeholder",
  "options",
  "className",
]);

const clear = () => {
  updateInputValue("");
  inputChangeEvent();
};
</script>

<template>
  <el-input
    v-paste-trim
    :class="[
      'c-form-select-input-group',
      className || '',
      {
        'is-reverse': selectToFirst,
      },
    ]"
    v-bind="getInputProps"
    :model-value="modelValueWrapper[0]"
    :placeholder="getInputPlaceholder"
    :clearable="false"
    :maxlength="getCurrentOptions?.maxlength ?? getInputProps.maxlength"
    @update:model-value="updateInputValue"
    @change="inputChangeEvent"
  >
    <template #suffix>
      <div class="input_icons">
        <el-icon v-if="modelValueWrapper[0]" @click="clear">
          <CircleClose />
        </el-icon>
        <el-icon>
          <Search />
        </el-icon>
      </div>
    </template>
    <template #prepend>
      <el-select
        v-model="modelValueWrapper[1]"
        v-bind="selectAttrs"
        :disabled="selectAttrs.disabled ?? disabled"
        :loading="loadingOptions"
        @change="selectChangeEvent"
      >
        <el-option
          v-for="item in parseOptions"
          :key="item.value as string"
          v-bind="item as any"
        />
      </el-select>
    </template>
  </el-input>
</template>

<style scoped lang="scss">
.c-form-select-input-group {
  min-width: 280px;

  &.is-reverse {
    flex-direction: row-reverse;
    --el-input-border-radius: var(--el-border-radius-base);

    :deep(.el-input__wrapper),
    .base-date-range-and-select-group__date {
      border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base)
        0;
    }

    :deep(.el-select__wrapper) {
      border-radius: var(--el-border-radius-base) 0 0
        var(--el-border-radius-base);
      box-shadow:
        1px 1px 0 0 var(--el-border-color) inset,
        0 -1px 0 0 var(--el-border-color) inset;
    }
  }

  :deep(.el-input__wrapper) {
    width: 210px;

    .input_icons {
      display: flex;
      align-items: center;
      column-gap: 6px;
      cursor: pointer;

      .el-icon {
        cursor: pointer;
        color: #4e5969;
      }
    }

    & > input {
      width: 100%;
    }
  }
}
</style>
