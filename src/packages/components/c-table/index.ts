import { withInstallComponent } from "@/helper/withInstall.ts";

import CTable from "./index.vue";
const installer = withInstallComponent(CTable, "CTable");
export { installer as default };
