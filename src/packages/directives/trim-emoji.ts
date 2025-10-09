import { formatPasteText, triggerEvent } from "@/helper/html.ts";
import { trimEmoji } from "@/helper/string.ts";
import { type Directive } from "vue";

type TCustomElement = HTMLElement & {
  _handlePaste?: (event: Event) => void;
  _handleInput?: (event: Event) => void;
};

/**
 * @description 自定义指令 v-trim-emoji：用于过滤emoji
 * @param {Object} el - 指令绑定的元素
 * @example
 * <el-input v-model="text" v-trim-emoji />
 */
export const vTrimEmoji: Directive<TCustomElement, string> = {
  created(el: TCustomElement) {
    const inputElement = (el.querySelector(".el-input__wrapper > input") ||
      el) as HTMLInputElement;

    const handleInput = () => {
      const originalValue = inputElement.value;
      const newValue = trimEmoji(originalValue);

      if (originalValue !== newValue) {
        // 保存光标位置
        const start = inputElement.selectionStart;
        const end = inputElement.selectionEnd;
        inputElement.value = newValue;
        const diff = originalValue.length - newValue.length;
        if (start && end) {
          inputElement.setSelectionRange(start - diff, end - diff);
        }
        triggerEvent(inputElement);
      }
    };
    inputElement.addEventListener("input", handleInput);
    el._handleInput = handleInput;

    const handlePaste = (event: Event) => {
      formatPasteText(inputElement, event, trimEmoji);
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
    if (el._handleInput) {
      inputElement.removeEventListener("input", el._handleInput);
      delete el._handleInput;
    }
  },
};
