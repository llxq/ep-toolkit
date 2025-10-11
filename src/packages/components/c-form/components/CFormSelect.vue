<script setup lang="ts">
import type { ICFormSelectAttrs } from "@/packages/components/c-form/core/types/formItemAttrs.ts";
import type { TEvent } from "@/packages/components/c-form/core/types/shared.ts";
import {
  type ICFormComponentModelValueEmit,
  useCFormComponentModelValue,
} from "@/packages/components/c-form/hooks/useCFormComponentModelValue.ts";
import { useCFormComponentOptions } from "@/packages/components/c-form/hooks/useCFormComponentOptions.ts";
import { useGetPureAttrs } from "@/packages/components/c-form/hooks/useGetPureAttrs.ts";
import { computed } from "vue";

defineOptions({
  name: "CFormSelect",
});

interface ICFormSelectProps extends ICFormSelectAttrs {
  on?: TEvent;
}

const props = withDefaults(defineProps<ICFormSelectProps>(), {
  on: () => ({}),
  options: () => [],
  reserveKeyword: true,
  showArrow: true,
});

const emit = defineEmits<ICFormComponentModelValueEmit>();

const { parseOptions, loadingOptions } = useCFormComponentOptions(props);

const { value } = useCFormComponentModelValue(props, emit);

const [selectAttrs] = useGetPureAttrs(props, ["on", "options", "modelValue"]);

const selectWidth = computed(() => props.width || "100%");
</script>

<template>
  <el-select
    v-bind="selectAttrs"
    v-model="value"
    :loading="loadingOptions"
    v-on="on"
  >
    <el-option
      v-for="item in parseOptions"
      :key="item.value"
      v-bind="item as any"
    />
  </el-select>
</template>

<style scoped lang="scss">
.el-select {
  --el-select-width: v-bind(selectWidth);

  :deep() {
    .el-tooltip__trigger {
      .el-select__selected-item {
        .el-tag.is-closable {
          .el-icon.el-tag__close {
            /* fix：修复下拉框多选的时候无法点击单个tag删除对应的选项 */
            z-index: 10;
          }
        }
      }
    }
  }
}
</style>
