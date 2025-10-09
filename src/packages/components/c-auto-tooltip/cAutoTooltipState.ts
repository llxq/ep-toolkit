import { ref } from "vue";

export interface IEllipsisTooltipConfig {
  visible: boolean;
  content: string;
  rect: DOMRect;
  effect: "dark" | "light";
  placement: "top" | "bottom" | "left" | "right";
  tipWidth?: string;
  rawContent?: boolean;
  enterable?: boolean;
}

export const tooltipConfig = ref<IEllipsisTooltipConfig>({
  visible: false,
  content: "",
  rect: {} as DOMRect,
  effect: "dark",
  placement: "top",
  rawContent: false,
  enterable: true,
});

/**
 * 更新 ellipsis 的 tooltipConfig
 * @param config
 */
export const updateEllipsisTooltipConfig = (
  config: Partial<IEllipsisTooltipConfig>,
) => {
  tooltipConfig.value = {
    ...tooltipConfig.value,
    ...config,
  };
};
