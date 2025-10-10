import { getCurrentDateRange, getRecentDateRange } from "@/helper/date";

export const DATE_SHORTCUTS = [
  {
    text: "今日",
    value: () => getCurrentDateRange(),
  },
  {
    text: "近3天",
    value: () => getRecentDateRange(3),
  },
  {
    text: "近5天",
    value: () => getRecentDateRange(5),
  },
  {
    text: "近7天",
    value: () => getRecentDateRange(7),
  },
  {
    text: "近15天",
    value: () => getRecentDateRange(15),
  },
  {
    text: "近一个月",
    value: () => getRecentDateRange(1, void 0, "month"),
  },
  {
    text: "近三个月",
    value: () => getRecentDateRange(3, void 0, "month"),
  },
  {
    text: "近六个月",
    value: () => getRecentDateRange(6, void 0, "month"),
  },
  {
    text: "近一年",
    value: () => getRecentDateRange(12, void 0, "month"),
  },
];
