import { withInstallComponent } from "@/helper/withInstall.ts";

import CSearchForm from "./index.vue";
const installer = withInstallComponent(CSearchForm, "CSearchForm");
export { installer as default };
