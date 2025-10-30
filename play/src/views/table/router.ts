import type { TCustomRouterDefinition } from "@play/router/types";

export default [
  {
    path: "/table",
    component: () => import("./index.vue"),
    title: "表格",
    name: "Table",
  },
  {
    path: "/table/report",
    component: () => import("./report.vue"),
    title: "报表",
    name: "Report",
  },
] as TCustomRouterDefinition[];
