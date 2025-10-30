const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null);
  return ((str: string) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  }) as T;
};

const camelizeRE = /-\w/g;
/**
 * 转换为驼峰写法
 * @see https://github.com/vuejs/core/blob/main/packages/shared/src/general.ts
 */
export const camelize = cacheStringFunction((str: string): string =>
  str.replace(camelizeRE, (c) => c.slice(1).toUpperCase()),
);

type AnyObject = Record<string, any>;

/**
 * 将对象的所有键名转换为驼峰式
 * @param obj 需要转换的对象
 * @returns 转换后的新对象
 */
export const camelizeObject = <T extends AnyObject>(obj: T): T => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => camelizeObject(item)) as unknown as T;
  }

  return Object.keys(obj).reduce((result, key) => {
    const camelKey = camelize(key);
    const value = obj[key];
    result[camelKey] =
      value && typeof value === "object"
        ? camelizeObject(value as AnyObject)
        : value;
    return result;
  }, {} as AnyObject) as T;
};

/**
 * 首字母大写
 * @see https://github.com/vuejs/core/blob/main/packages/shared/src/general.ts
 */
const capitalize: <T extends string>(str: T) => Capitalize<T> =
  cacheStringFunction(<T extends string>(str: T) => {
    return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
  });

/**
 * 将事件转换为vue事件
 * @see https://github.com/vuejs/core/blob/main/packages/shared/src/general.ts
 */
export const toVueEventKey: <T extends string>(
  str: T,
) => T extends "" ? "" : `on${Capitalize<T>}` = cacheStringFunction(
  <T extends string>(str: T) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s as T extends "" ? "" : `on${Capitalize<T>}`;
  },
);
