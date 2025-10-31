import type { IEpToolkitConfig } from "@/packages/store/config/index.type.ts";
import { merge, omit } from "lodash";

/**
 * ⚠️ 配置服务需要在最开始的注册
 * 配置服务
 */
class EpToolkitConfigService {
  private config: IEpToolkitConfig = {
    formConfig: {
      useRowLayout: true,
      resetTriggerQuery: true,
    },
    tableConfig: {
      autoLoad: true,
      showOverflowTooltip: true,
      columnEmptyRender: () => "-",
      /**
       * @description 默认的表格数据的 key
       */
      rowKey: "id",
      /**
       * 默认分页参数
       */
      paginationProps: {
        layout: "total, prev, pager, next, sizes",
        pageSize: 20,
        pageSizes: [10, 20, 50, 100],
      },
      /**
       * 默认显示分页
       */
      hasPagination: true,
      /**
       * 分页默认显示在左侧
       */
      paginationPosition: "left",
      /**
       * 是否启用列搜索
       */
      enableColumnSearch: false,
    },
  };

  public get fullTableConfig() {
    return this.config.tableConfig;
  }

  public get tableConfig() {
    return omit(this.config.tableConfig, [
      "tableEmptyRender",
      "columnEmptyRender",
    ]);
  }

  public get formConfig() {
    return this.config.formConfig;
  }

  public provide(config: IEpToolkitConfig) {
    this.config = merge(this.config, config);
  }
}

export const epToolkitConfigService = new EpToolkitConfigService();
