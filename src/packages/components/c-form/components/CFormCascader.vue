<script setup lang="ts">
import { filterComponentEmptyProps } from "@/packages/components/c-form/core/helper/component.ts";
import type { ICFormCascaderAttrs } from "@/packages/components/c-form/core/types/formItemAttrs.ts";
import {
  type ICFormComponentModelValueEmit,
  useCFormComponentModelValue,
} from "@/packages/components/c-form/hooks/useCFormComponentModelValue.ts";
import { useCFormComponentOptions } from "@/packages/components/c-form/hooks/useCFormComponentOptions.ts";
import type { CascaderValue } from "element-plus";
import type { CascaderProps } from "element-plus/es/components/cascader-panel/src/types";
import type { CascaderEmits } from "element-plus/lib/components";
import { cloneDeep, isEqual, omit } from "lodash";
import { computed, nextTick } from "vue";

defineOptions({
  name: "CFormCascader",
});

const props = withDefaults(
  defineProps<
    ICFormCascaderAttrs & { on?: Partial<CascaderEmits>; props?: CascaderProps }
  >(),
  {
    on: () => ({}),
    options: () => [],
    showAllLevels: true,
    validateEvent: true,
    persistent: true,
    props: () => ({}),
  },
);

const emit = defineEmits<
  ICFormComponentModelValueEmit &
    ((event: "change", value?: CascaderValue) => void)
>();

const { parseOptions, loadingOptions } = useCFormComponentOptions(props);

const { value } = useCFormComponentModelValue(props, emit);

const cascaderOn = computed(() => omit(props.on, ["blur", "change"]));

const cascaderAttrs = computed(() =>
  filterComponentEmptyProps(omit(props, ["on", "options", "modelValue"])),
);

const emitChange = () => {
  emit("change", value.value as CascaderValue);
};

let preValue: TUndefinable<CascaderValue>;
const visibleChange = async (visible: boolean) => {
  if (!visible) {
    await nextTick();
    if (!isEqual(preValue, value.value)) {
      emitChange();
    }
    preValue = void 0;
  } else {
    preValue = cloneDeep(value.value as CascaderValue);
  }
  props.on.visibleChange?.(visible);
};

const cascaderWidth = computed(() => props.width || "100%");

const updateByEvent = (eventName: string, _value: unknown) => {
  const event = Reflect.get(props.on, eventName) as (
    ...args: unknown[]
  ) => void;
  if (event) {
    event(_value);
  }
  emitChange();
  preValue = cloneDeep(
    props.props.multiple ? (_value ?? []) : _value,
  ) as CascaderValue;
};
</script>

<template>
  <el-cascader
    v-model="value"
    :loading="loadingOptions"
    v-bind="cascaderAttrs"
    :options="parseOptions"
    v-on="cascaderOn"
    @visible-change="visibleChange"
    @clear="updateByEvent('clear', $event)"
    @remove-tag="updateByEvent('removeTag', $event)"
  >
    <template v-if="$slots.default" #default="{ node, data }">
      <slot name="default" v-bind="{ node, data }" />
    </template>
  </el-cascader>
</template>

<style lang="scss">
.el-cascader {
  width: v-bind(cascaderWidth);
}
</style>
