import "./assets/global.scss";
import "highlight.js/styles/atom-one-dark.css";
import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import { getDynamicRouters } from "./router";

import epKit, { defineCustomCFormComponent, useAsyncLoader } from "ep-toolkit";
import { store } from "@play/store";

defineCustomCFormComponent({
  __example__: {
    component: () => import("@play/components/TestCustomComponent.vue"),
    defaultPraseStrategy: (field) => field,
  },
});

const app = createApp(App).use(store).use(epKit).use(ElementPlus, {
  locale: zhCn,
});

const [loading] = useAsyncLoader(true, true);
const bootstrap = async () => {
  const router = await getDynamicRouters();
  app.use(router);
  loading.value = false;
};

bootstrap().then(() => {
  app.mount("#app");
});
