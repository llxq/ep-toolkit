import { formatPasteText } from "@/helper/html.ts";
import { type Directive } from "vue";

type TCustomElement = HTMLElement & {
  _handlePaste?: (event: Event) => void;
};

/**
 * @description 自定义指令 v-paste-trim：用于过滤粘贴内容前后空格
 * @param {Object} el - 指令绑定的元素
 * @example
 * <el-input v-model="text" v-paste-trim /> // 只过滤首尾空格
 */
export const vPasteTrim: Directive<TCustomElement, string> = {
  created(el: TCustomElement) {
    const inputElement = (el.querySelector(".el-input__wrapper > input") ||
      el) as HTMLInputElement;
    const handlePaste = (event: Event) => {
      formatPasteText(inputElement, event, (pastedText: string) =>
        pastedText.trim(),
      );
    };
    inputElement.addEventListener("paste", handlePaste);
    el._handlePaste = handlePaste;
  },
  unmounted(el: TCustomElement) {
    const inputElement = el.querySelector("input") || el;
    if (el._handlePaste) {
      inputElement.removeEventListener("paste", el._handlePaste);
      delete el._handlePaste;
    }
  },
};
