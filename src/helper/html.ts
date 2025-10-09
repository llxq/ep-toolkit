import { nextTick } from "vue";

/**
 * 派发一个 input 事件
 * @param inputElement
 */
export const triggerEvent = (inputElement: HTMLInputElement) => {
  inputElement.dispatchEvent(new Event("input", { bubbles: true }));
};

/**
 * 处理粘贴事件
 * @param inputElement
 * @param event
 * @param formatFnc 格式化函数
 */
export const formatPasteText = (
  inputElement: HTMLInputElement,
  event: Event,
  formatFnc: (text: string) => string,
) => {
  event.preventDefault();
  const pastedText =
    (
      Reflect.get(event, "clipboardData") ||
      Reflect.get(window, "clipboardData")
    )?.getData("text/plain") || "";
  if (!pastedText) {
    return;
  }
  const formattedText = formatFnc(pastedText);
  if (document.execCommand) {
    document.execCommand("insertText", false, formattedText);
  } else {
    const { selectionStart, selectionEnd, value } = inputElement;
    const valueLength = value.length;
    if (valueLength) {
      inputElement.value =
        value.substring(0, selectionStart ?? 0) +
        formattedText +
        value.substring(selectionEnd ?? valueLength);
      const newCursorPosition = (selectionStart ?? 0) + formattedText.length;
      nextTick().then(() => {
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    } else {
      inputElement.value = formattedText;
    }
    // trigger input event
    triggerEvent(inputElement);
  }
};
