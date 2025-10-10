import dayjs, { type ManipulateType } from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const DEFAULT_FORMAT = "YYYY-MM-DD HH:mm:ss";

/**
 * 获取指定时间的一天的开始/结束时间
 * @param date
 * @param format
 */
export const getAppointDateRange = (
  date: TUndefinable<string>,
  format = DEFAULT_FORMAT,
): string[] =>
  [dayjs(date).startOf("day"), dayjs(date).endOf("day")].map((m) =>
    m.format(format),
  );

/**
 * 获取今天的一天的开始/结束时间
 * @param format
 */
export const getCurrentDateRange = (format = DEFAULT_FORMAT): string[] =>
  getAppointDateRange(void 0, format);

/**
 * 将秒数格式化为mm:ss。小于1秒的部分算1秒
 * @param second
 */
export function formatSecond(second: string | number) {
  return dayjs
    .duration(Math.ceil(Number(second) || 0), "seconds")
    .format("mm:ss");
}

/**
 * 将时间转换为 时:分:秒
 * @param seconds
 * @param format
 */
export const formatSeconds = (seconds: number, format = "HH:mm:ss"): string => {
  const date = new Date(seconds * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const secondsValue = date.getUTCSeconds();

  return format
    .replace("HH", hours.toString().padStart(2, "0"))
    .replace("mm", minutes.toString().padStart(2, "0"))
    .replace("ss", secondsValue.toString().padStart(2, "0"));
};

/**
 * 获取距离当前几天的时间
 * @param days
 * @param format
 * @param type
 * @return Array<string>
 */
export const getDaysRange = (
  days: number,
  format = DEFAULT_FORMAT,
  type: ManipulateType = "day",
): string[] =>
  [dayjs().subtract(days, type), dayjs()].map((m) => m.format(format));

/**
 * 获取距离当前几天的时间，并且时分秒从0到59
 * @example
 * ```typescript
 * getRecentDateRange(3); // ['2025-08-19 00:00:00', '2025-08-19 23:59:59']
 * ```
 * @param days
 * @param format
 * @param type
 * @return Array<string>
 */
export const getRecentDateRange = (
  days: number,
  format = DEFAULT_FORMAT,
  type: ManipulateType = "day",
): string[] =>
  [dayjs().subtract(days, type).startOf("day"), dayjs().endOf("day")].map((m) =>
    m.format(format).padStart(10, "0"),
  );

/**
 * 判断当前时间是否大于现在
 * @param time
 */
export const isAfterNow = (time: Date): boolean => time.getTime() > Date.now();
