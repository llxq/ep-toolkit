import "./assets/global.scss";
import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import epKit, { defineCustomCFormComponent } from "ep-kit";

defineCustomCFormComponent({
  __example__: {
    component: () => import("@play/components/TestCustomComponent.vue"),
    defaultPraseStrategy: (field) => field,
  },
});

createApp(App).use(epKit).use(ElementPlus).mount("#app");
