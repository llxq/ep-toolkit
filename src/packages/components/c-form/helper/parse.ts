import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import { isFunction } from "lodash";
import type { TEvent } from "@/packages/components/c-form/core/types/shared.ts";

/**
 * 将事件转换成 tsx 写法
 * @param event 事件集合
 */
export const convertEventToTsx = (event: TEvent) => {
  const convertEventName = (eventName: string) => {
    return `on${eventName[0].toUpperCase()}${eventName.slice(1)}`;
  };
  return Object.entries(event).reduce((result, [key, value]) => {
    result[convertEventName(key)] = value;
    return result;
  }, {} as TEvent);
};

/**
 * 处理事件处理函数，为了统一触发 change 事件。
 * @param formItem
 * @param changeCallBack
 */
export const getFormItemEvent = (
  formItem: FormItem,
  changeCallBack: (...args: TAllType[]) => void,
) => {
  const { on = {}, changeEvent = "change" } = formItem;
  return convertEventToTsx({
    ...on,
    [changeEvent]: (...args: Parameters<(typeof on)[typeof changeEvent]>) => {
      if (Reflect.has(on, changeEvent)) {
        const event = Reflect.get(on, changeEvent);
        if (isFunction(event)) {
          event(...args);
        }
      }
      changeCallBack(...args);
    },
  });
};
