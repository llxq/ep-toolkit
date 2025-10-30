import type { AsyncComponentLoader, Component } from "vue";

/**
 * 判断一个对象是否为 Promise
 * @param obj
 */
export const isPromise = <T>(obj: unknown): obj is Promise<T> =>
  obj instanceof Promise ||
  (typeof obj === "object" &&
    typeof (obj as TObj).then === "function" &&
    typeof (obj as TObj).catch === "function");

/**
 * 判断一个值是否为异步组件
 * @param value
 */
export const isAsyncComponent = <T extends Component>(
  value: unknown,
): value is AsyncComponentLoader<T> => typeof value === "function";

/**
 * 判断列的值是否为空
 * @param value
 */
export const isEmptyCellValue = (value: unknown): value is undefined =>
  typeof value === "undefined" ||
  (typeof value === "object" && value === null) ||
  value === "";
