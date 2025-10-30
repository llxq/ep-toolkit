import { merge, omit } from "lodash";
import type { ITableConfig } from "@/packages/components/c-table/core/types/tableConfig.ts";
import { epToolkitConfigService } from "@/packages/store/config/index.service.ts";

export class TableConfigManger<T extends TObj> {
  public config: ITableConfig<T> = {
    ...((epToolkitConfigService.tableConfig ?? {}) as ITableConfig<T>),
  };

  public get tableAttrs() {
    return omit(this.config, [
      "tableData",
      "loadMethod",
      "autoLoad",
      "hasPagination",
      "paginationPosition",
      "paginationProps",
      "fixedPagination",
      "draggableAttrs",
      "enableColumnSearch",
      "appendRender",
    ]);
  }

  /**
   * 初始化 config
   * @param config
   */
  public init(config?: ITableConfig<T>) {
    if (config) {
      this.config = merge(this.config, config);
    }
  }
}
