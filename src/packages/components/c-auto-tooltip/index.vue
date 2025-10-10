<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "CAutoTooltip",
});

import { tooltipConfig } from "./cAutoTooltipState";

const triggerRef = ref({
  getBoundingClientRect() {
    return tooltipConfig.value.rect;
  },
});
</script>

<template>
  <el-tooltip
    v-model:visible="tooltipConfig.visible"
    :effect="tooltipConfig.effect"
    :placement="tooltipConfig.placement"
    trigger="hover"
    virtual-triggering
    :virtual-ref="triggerRef"
    popper-class="auto-tooltip"
    :raw-content="tooltipConfig.rawContent"
    :content="tooltipConfig.rawContent ? tooltipConfig.content : undefined"
    :enterable="tooltipConfig.enterable"
  >
    <template v-if="!tooltipConfig.rawContent" #content>
      <div
        :style="{
          maxWidth: tooltipConfig.tipWidth || undefined,
          wordBreak: 'break-all',
        }"
      >
        {{ tooltipConfig.content }}
      </div>
    </template>
  </el-tooltip>
</template>

<style lang="scss">
.auto-tooltip {
  --auto-tooltip-z-index: 9999;
  z-index: var(--auto-tooltip-z-index) !important;
}
</style>
