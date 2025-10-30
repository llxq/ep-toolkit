import type { RouteRecordRaw } from "vue-router";

export type TCustomRouterDefinition = Omit<
  RouteRecordRaw,
  "name" | "children"
> & {
  /**
   * 标题
   */
  title: string;
  /**
   * 路由名称 （不可重复）
   */
  name: string;
  /**
   * 子路由
   */
  children?: TCustomRouterDefinition[];
};
