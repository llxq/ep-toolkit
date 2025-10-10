<script setup lang="ts">
import CFormDate, {
  type ICFormDateProps,
} from "@/packages/components/c-form/components/CFormDate.vue";
import { filterComponentEmptyProps } from "@/packages/components/c-form/core/helper/component.ts";
import type { ICFormDateRangeAndSelectGroupAttrs } from "@/packages/components/c-form/core/types/formItemAttrs.ts";
import {
  type ICFormComponentModelValueEmit,
  useCFormComponentModelValue,
} from "@/packages/components/c-form/hooks/useCFormComponentModelValue.ts";
import { useCFormComponentOptions } from "@/packages/components/c-form/hooks/useCFormComponentOptions.ts";
import { computed, nextTick } from "vue";
import { cloneDeep, isEqual, omit } from "lodash";

defineOptions({
  name: "CFormDateRangeAndSelectGroup",
});

type TModelValue = [string?, string?, TAllType?];

export interface ICFormDateRangeAndSelectGroupProps
  extends ICFormDateRangeAndSelectGroupAttrs,
    Omit<ICFormDateProps, "modelValue"> {
  /* 分别表示：startTime, endTime, selectValue */
  modelValue: TModelValue;
}

const props = withDefaults(defineProps<ICFormDateRangeAndSelectGroupProps>(), {
  modelValue: () => [],
  selectWidth: "100px",
  disabledSelectByEmptyData: true,
  selectToFirst: false,
  defaultSelectFirst: false,
  whenEmptyDateClearSelect: false,
});

const emit = defineEmits<
  ICFormComponentModelValueEmit &
    ((event: "change", value: TModelValue) => void)
>();

const getDateProps = computed(() =>
  filterComponentEmptyProps(omit(props, ["options", "on", "modelValue"])),
);

const { value } =
  useCFormComponentModelValue<ICFormDateRangeAndSelectGroupProps>(props, emit);

const { parseOptions, loadingOptions } = useCFormComponentOptions(props, () => {
  if (props.defaultSelectFirst) {
    if (!value.value?.length && parseOptions.value.length) {
      emit("update:modelValue", [
        "",
        "",
        (parseOptions.value[0]?.value as string) ?? "",
      ]);
    }
  }
});

const emitChange = () => {
  nextTick().then(() => {
    emit("change", value.value);
  });
};

const selectModelValue = computed({
  get() {
    return props.modelValue[2];
  },
  set(selectValue) {
    const [startTime, endTime] = props.modelValue;
    value.value = [startTime, endTime, selectValue] as TModelValue;
    if (startTime && endTime) {
      emitChange();
    }
  },
});

const dateModelValue = computed({
  get() {
    return props.modelValue.slice(0, 2);
  },
  set(dateValue: TNullable<[string, string]>) {
    const preValue = cloneDeep(value.value);
    const selectValue =
      props.whenEmptyDateClearSelect && !dateValue ? "" : value.value?.[2];
    const parseDataValue = dateValue || ["", ""];
    const newValue = [...parseDataValue, selectValue];
    value.value = newValue as TModelValue;
    if (!isEqual(preValue, newValue)) {
      emitChange();
    }
  },
});

const isDisabledSelect = computed(() => {
  if (!props.disabledSelectByEmptyData) {
    return false;
  }
  const [startTime, endTime] = props.modelValue;
  return !startTime || !endTime;
});

const getSelectAttrs = computed(() => ({
  clearable: false,
  ...(props.selectOptions ?? {}),
  ...(props.selectAttrs ?? {}),
}));
</script>

<template>
  <div
    :class="[
      'c-form-date-range-and-select-group__container',
      {
        'is-reverse': selectToFirst,
      },
    ]"
  >
    <div class="c-form-date-range-and-select-group__date">
      <CFormDate
        v-model="dateModelValue as Array<string>"
        v-bind="getDateProps"
      />
    </div>
    <div class="c-form-date-range-and-select-group__select">
      <el-select
        v-model="selectModelValue"
        v-bind="getSelectAttrs ?? {}"
        :style="{ width: selectWidth }"
        :disabled="isDisabledSelect ?? disabled"
        :clearable="false"
        :loading="loadingOptions"
      >
        <el-option
          v-for="item in parseOptions"
          :key="item.value as string"
          v-bind="item as any"
        />
      </el-select>
    </div>
  </div>
</template>

<style scoped lang="scss">
.c-form-date-range-and-select-group {
  &__container {
    display: flex;

    :deep(.el-input__wrapper) {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }

    :deep(.el-select__wrapper) {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      box-shadow:
        -1px 1px 0 0 var(--el-border-color) inset,
        0 -1px 0 0 var(--el-border-color) inset;
      --el-text-color-regular: var(--app-primary-text-color);
    }

    &.is-reverse {
      flex-direction: row-reverse;
      --el-input-border-radius: var(--el-border-radius-base);

      :deep(.el-input__wrapper),
      .c-form-date-range-and-select-group__date {
        border-radius: 0 var(--el-border-radius-base)
          var(--el-border-radius-base) 0;
      }

      :deep(.el-select__wrapper) {
        border-radius: var(--el-border-radius-base) 0 0
          var(--el-border-radius-base);
        box-shadow:
          1px 1px 0 0 var(--el-border-color) inset,
          0 -1px 0 0 var(--el-border-color) inset;
      }
    }
  }

  &__select {
    .el-select {
      --el-fill-color-blank: #f5f7fa;
    }
  }
}
</style>
