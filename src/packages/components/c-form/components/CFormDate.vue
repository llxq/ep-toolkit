<script setup lang="ts">
import type { ICFormDateAttrs } from "@/packages/components/c-form/core/types/formItemAttrs.ts";
import type { TEvent } from "@/packages/components/c-form/core/types/shared.ts";
import {
  type ICFormComponentModelValueEmit,
  useCFormComponentModelValue,
} from "@/packages/components/c-form/hooks/useCFormComponentModelValue.ts";
import { useGetPureAttrs } from "@/packages/components/c-form/hooks/useGetPureAttrs.ts";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { computed } from "vue";

defineOptions({
  name: "CFormDate",
});

export interface ICFormDateProps extends ICFormDateAttrs {
  on?: TEvent;
}

const props = withDefaults(defineProps<ICFormDateProps>(), {
  on: () => ({}),
  autoAddSeconds: true,
  /* 默认选择时间的时候从开始时间的 00:00 到结束时间的 23:59 */
  useDefaultTimeToDay: true,
  showNow: true,
});

const emit = defineEmits<
  ICFormComponentModelValueEmit &
    ((event: "change", value?: string[] | string) => void)
>();

const { value } = useCFormComponentModelValue(props, emit);

const [getDateAttr] = useGetPureAttrs(props, [
  "on",
  "modelValue",
  "defaultTime",
  "autoAddSeconds",
  "useDefaultTimeToDay",
  "shortcuts",
  "popperClass",
]);

const getDefaultTime = computed(() => {
  /* 设置 defaultTime 为 00:00 到 23:59 */
  if (props.useDefaultTimeToDay) {
    return [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)];
  }
  return void 0;
});

/**
 * 格式化时间
 * @param date
 * @param isEnd 是否为结束始时间
 */
const formatDate = (date?: string, isEnd?: boolean) => {
  if (!date) {
    return date;
  }
  const formatter = props.format || "";
  const newDate = dayjs(date).format(formatter);
  if (props.autoAddSeconds && formatter === "YYYY-MM-DD HH:mm") {
    return `${newDate}:${isEnd ? "59" : "00"}`;
  }
  return newDate;
};

const getDateEvent = computed(() => ({
  ...props.on,
  "update:modelValue": (_value?: string[] | string) => {
    const parseValue = _value ?? "";
    if (Array.isArray(parseValue)) {
      const [start, end] = parseValue;
      emit("update:modelValue", [formatDate(start), formatDate(end, true)]);
    } else {
      emit("update:modelValue", formatDate(parseValue, true));
    }
  },
  /* clear 事件会触发 emit */
  change: debounce(() => {
    emit("change", value.value as string[] | string);
  }),
}));
</script>

<template>
  <el-date-picker
    v-bind="getDateAttr"
    :popper-class="`z-base-date-popper ${props.popperClass || ''}`"
    :model-value="value"
    :default-time="getDefaultTime as any"
    v-on="getDateEvent"
  />
</template>
