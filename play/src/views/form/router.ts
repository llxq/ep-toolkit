import type { TCustomRouterDefinition } from "@play/router/types";

export default [
  {
    path: "/form",
    component: () => import("./index.vue"),
    title: "表单",
    name: "Form",
  },
  {
    path: "/form/search-form",
    component: () => import("./SearchForm.vue"),
    title: "搜索表单",
    name: "SearchForm",
  },
] as TCustomRouterDefinition[];
