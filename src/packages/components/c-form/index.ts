import { withInstallComponent } from "@/helper/withInstall.ts";

import CForm from "./index.vue";
const installer = withInstallComponent(CForm, "CForm");
export { installer as default };
