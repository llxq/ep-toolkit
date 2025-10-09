import { tooltipConfig } from "@/packages/components/c-auto-tooltip/cAutoTooltipState.ts";
import type { Directive, DirectiveBinding } from "vue";

export type TEllipsisElement = HTMLElement & {
  _mouseenterHandler?: (event: MouseEvent) => void;
  _mouseleaveHandler?: (event: MouseEvent) => void;
};
export type TEllipsisDirective = Directive<TEllipsisElement, string>;
export type TEllipsisBinding = DirectiveBinding<
  | string
  | {
      content?: string;
      line?: number;
      tipWidth?: string;
      rawContent?: boolean;
      enterable?: boolean;
    },
  "dark" | "light" | "top" | "bottom" | "left" | "right"
>;

/**
 * 移入显示tooltip
 * @example
 * 1. ```<div v-ellipsis>我是一个超长文本</div>```
 * 超出设定宽度，鼠标经过时，展示tooltip，内容为元素内文本内容，不超出则不展示
 * 2. ```<div v-ellipsis.light.bottom>我是一个超长文本</div>```
 * 设置tooltip样式，颜色为light，位置为bottom。默认为dark top
 * 3. ```<div v-ellipsis="{ tipWidth: '300px'}">我是一个超长文本</div>```
 * 设置tooltip宽度为300px。默认为auto
 * 4. ```<div v-ellipsis="{ content: '我是一个超长文本2'}">我是一个超长文本</div>```
 * 自定义tooltip内容
 * 5. ```<div v-ellipsis="{ line : 2}">我是一个超长文本</div>```
 * 设置元素超出2行后再溢出隐藏，默认1行
 */
export const vEllipsis: TEllipsisDirective = (
  el: TEllipsisElement,
  binding: TEllipsisBinding,
) => {
  if (el._mouseenterHandler) {
    el.removeEventListener("mouseenter", el._mouseenterHandler, false);
  }
  if (el._mouseleaveHandler) {
    el.removeEventListener("mouseleave", el._mouseleaveHandler, false);
  }

  el.style.overflow = "hidden";
  el.style.textOverflow = "ellipsis";
  el.style.wordBreak = "break-all";

  let line = 1;
  if (typeof binding.value === "object") {
    binding.value.line && (line = binding.value.line);
  }
  if (line > 1) {
    el.style.display = "-webkit-box";
    el.style.webkitBoxOrient = "vertical";
    el.style.webkitLineClamp = String(line);
  } else {
    el.style.whiteSpace = "nowrap";
  }

  el.addEventListener("mouseenter", () => {
    if (
      el.scrollWidth > el.clientWidth ||
      (line > 1 && el.scrollHeight > el.clientHeight)
    ) {
      tooltipConfig.value.rect = el.getBoundingClientRect();
      let content = "";
      if (typeof binding.value === "object") {
        binding.value.content && (content = binding.value.content);
        tooltipConfig.value.tipWidth = binding.value.tipWidth || undefined;
        tooltipConfig.value.rawContent = Boolean(binding.value.rawContent);
        tooltipConfig.value.enterable = binding.value.enterable ?? true;
      } else {
        content = binding.value;
      }
      if (tooltipConfig.value.rawContent) {
        content = el.outerHTML;
      }
      tooltipConfig.value.content = content || el.textContent || "";
      tooltipConfig.value.visible = true;
      // reset to dark
      tooltipConfig.value.effect = "dark";
      if (binding.modifiers.light) {
        tooltipConfig.value.effect = "light";
      }
      if (binding.modifiers.top) {
        tooltipConfig.value.placement = "top";
      }
      if (binding.modifiers.bottom) {
        tooltipConfig.value.placement = "bottom";
      }
      if (binding.modifiers.left) {
        tooltipConfig.value.placement = "left";
      }
      if (binding.modifiers.right) {
        tooltipConfig.value.placement = "right";
      }
    }
  });
  el.addEventListener("mouseleave", () => {
    if (
      el.scrollWidth > el.clientWidth ||
      (line > 1 && el.scrollHeight > el.clientHeight)
    ) {
      tooltipConfig.value.visible = false;
    }
  });
};
