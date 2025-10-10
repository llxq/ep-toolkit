import "./assets/global.scss";
import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import epKit from "ep-kit";

createApp(App).use(epKit).use(ElementPlus).mount("#app");
