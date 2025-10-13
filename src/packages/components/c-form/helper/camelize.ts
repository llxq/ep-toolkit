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
export const camelize: (str: string) => string = cacheStringFunction(
  (str: string): string =>
    str.replace(camelizeRE, (c) => c.slice(1).toUpperCase()),
);
