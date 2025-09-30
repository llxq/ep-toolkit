/**
 * 判断一个对象是否为 Promise
 * @param obj
 */
export const isPromise = <T>(obj: unknown): obj is Promise<T> =>
  obj instanceof Promise ||
  (typeof obj === "object" && typeof (obj as TObj).then === "function" && typeof (obj as TObj).catch === "function");
