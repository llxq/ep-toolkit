import { vEllipsis } from "@/packages/directives/ellipsis.ts";
import { vPasteTrim } from "@/packages/directives/paste-trim.ts";
import { vTrimEmoji } from "@/packages/directives/trim-emoji.ts";
import type { App, Plugin } from "vue";

/**
 * @description 初始化所有自定义指令
 */
export const initEpKitDirectives: Plugin = {
  install(app: App) {
    app.directive("ellipsis", vEllipsis);
    app.directive("paste-trim", vPasteTrim);
    app.directive("trim-emoji", vTrimEmoji);
  },
};
