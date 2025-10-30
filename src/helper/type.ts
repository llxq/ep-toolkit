import type { ElTable } from "element-plus";
import type { h, Ref, VNode } from "vue";
import type { JSX } from "vue/jsx-runtime";

/**
 * 通用的渲染返回类型
 */
export type TRenderReturnType =
  | TAllType
  | TAllType<JSX.Element | VNode | HTMLElement>;

/**
 * 通用的渲染函数
 */
export type TRenderFunction = (_: typeof h) => TRenderReturnType;

/**
 * el table 的实例
 */
export type TElTableInstance = InstanceType<typeof ElTable>;
export type TElTableRefInstance = Ref<TElTableInstance>;
