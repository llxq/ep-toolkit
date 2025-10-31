import type { TRenderFunction } from "@/helper/type.ts";
import { isFunction } from "lodash";
import { h } from "vue";

/**
 * 通用的渲染函数组件
 * @param render
 * @constructor
 */
export const RenderComponent = (render?: TRenderFunction) =>
  isFunction(render) ? render(h) : null;
