<script setup lang="ts">
import { filterComponentEmptyProps } from "@/packages/components/c-form/core/helper/component.ts";
import type { TEvent } from "@/packages/components/c-form/core/types/shared.ts";
import {
  type ICFormComponentModelValueEmit,
  useCFormComponentModelValue,
} from "@/packages/components/c-form/hooks/useCFormComponentModelValue.ts";
import type { InputEmits, InputProps } from "element-plus";
import { computed } from "vue";
import { CircleClose, Search } from "@element-plus/icons-vue";
import { omit } from "lodash";

defineOptions({
  name: "CFormSearchInput",
});

export interface ICFormSearchInputProps extends InputProps {
  on?: TEvent & Partial<InputEmits>;
}

const props = withDefaults(defineProps<ICFormSearchInputProps>(), {
  on: () => ({}),
  validateEvent: true,
});

const emit = defineEmits<
  ICFormComponentModelValueEmit & {
    (event: "suffixClick"): void;
    (event: "change", value: string): void;
  }
>();

const { value } = useCFormComponentModelValue(props, emit);

const inputAttrs = computed(() =>
  filterComponentEmptyProps(omit(props, ["on", "modelValue"])),
);

const updateValue = (_value: string) => {
  emit("update:modelValue", _value);
  emit("change", _value);
};

const clear = () => {
  emit("update:modelValue", "");
  emit("change", "");
};
</script>

<template>
  <el-input
    v-bind="inputAttrs"
    v-model="value"
    v-paste-trim
    :clearable="false"
    class="c-form-search-input"
    v-on="props.on"
    @change="updateValue"
  >
    <template #suffix>
      <div class="input_icons">
        <el-icon v-if="value" @click="clear"><CircleClose /></el-icon>
        <el-icon>
          <Search />
        </el-icon>
      </div>
    </template>
  </el-input>
</template>

<style scoped lang="scss">
.c-form-search-input {
  :deep(.el-input__wrapper) {
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
  }
}
</style>
