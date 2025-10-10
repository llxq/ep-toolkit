<script setup lang="ts">
import { filterComponentEmptyProps } from "@/packages/components/c-form/core/helper/component.ts";
import type { ICFormRadioAttrs } from "@/packages/components/c-form/core/types/formItemAttrs.ts";
import type {
  TEvent,
  TOptions,
} from "@/packages/components/c-form/core/types/shared.ts";
import {
  type ICFormComponentModelValueEmit,
  useCFormComponentModelValue,
} from "@/packages/components/c-form/hooks/useCFormComponentModelValue.ts";
import { useCFormComponentOptions } from "@/packages/components/c-form/hooks/useCFormComponentOptions.ts";
import { type RadioProps } from "element-plus";
import { omit } from "lodash";
import { computed } from "vue";

defineOptions({
  name: "CFormRadio",
});

interface ICFormRadioProps extends ICFormRadioAttrs {
  on?: TEvent;
}

const props = withDefaults(defineProps<ICFormRadioProps>(), {
  on: () => ({}),
  options: () => [],
});

const emit = defineEmits<ICFormComponentModelValueEmit>();

const { parseOptions, loadingOptions } = useCFormComponentOptions(props);

const { value } = useCFormComponentModelValue(props, emit);

const radioGroupAttrs = computed(() =>
  filterComponentEmptyProps(omit(props, ["on", "options", "modelValue"])),
);

const radioAttrs = (item: TObj) =>
  filterComponentEmptyProps(
    omit(item as TOptions<RadioProps>[number], ["label", "leaf", "children"]),
  );
</script>

<template>
  <el-radio-group
    v-bind="radioGroupAttrs"
    v-model="value"
    v-loading="loadingOptions"
  >
    <slot>
      <el-radio
        v-for="item in parseOptions"
        :key="item.value"
        v-bind="radioAttrs(item)"
      >
        {{ item.label }}
      </el-radio>
    </slot>
  </el-radio-group>
</template>
