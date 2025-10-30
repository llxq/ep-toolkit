import type { TableBuilder } from "@/packages/components/c-table/core/TableBuilder.ts";
import type { ICTablePagination } from "@/packages/components/c-table/core/types/shared.ts";
import { epToolkitConfigService } from "@/packages/store/config/index.service.ts";
import { isFunction, merge, omit } from "lodash";
import { nextTick, watchEffect } from "vue";

export class TableDataStore<T extends TObj> {
  public data: T[] = [];
  public selectList: T[] = [];
  public loading = false;
  public pagination!: ICTablePagination;
  private stopEffect?: () => void;

  constructor(private tableBuilder: TableBuilder<T>) {}

  public init() {
    this.pagination = {
      current: 1,
      // 兜底 20
      size:
        this.tableBuilder.config.paginationProps?.pageSize ||
        epToolkitConfigService.tableConfig.paginationProps?.pageSize ||
        20,
      total: 0,
    };
  }

  public initPagination(pagination: Partial<ICTablePagination>) {
    this.pagination = {
      ...this.pagination,
      ...pagination,
    };
  }

  /**
   * 更新数据
   * @param data
   */
  public update(data: T[]) {
    this.data = data;
  }

  /**
   * 更新选中数据
   * @param data
   */
  public updateSelectList(data: T[]) {
    this.selectList = data;
  }

  /**
   * 更新分页
   * @param pagination
   * @private
   */
  public updatePagination(pagination: Partial<ICTablePagination>) {
    merge(this.pagination, pagination);
    return this.pagination;
  }

  /**
   * 加载数据
   * @param pagination
   * @private
   */
  private async loadData(
    pagination: ICTablePagination = this.pagination,
  ): Promise<void> {
    this.loading = true;
    try {
      const loadMethod = this.tableBuilder.config.loadMethod;
      if (isFunction(loadMethod)) {
        const { data, total, records, count } =
          (await loadMethod(omit(pagination, "total"))) ?? {};
        const result = data || records || [];
        const totalCount = Number(total || count || 0);
        const isEmptyTotal = !totalCount || isNaN(totalCount);
        if (!result.length && pagination.current > 1 && !isEmptyTotal) {
          /* 如果当前页码大于最大可分页数则将当前分页置为最大可分页数 */
          const maxPage = Math.ceil(totalCount / pagination.size);
          if (pagination.current > maxPage) {
            this.updatePagination({
              current: maxPage,
            });
            return this.loadData(pagination);
          }
        }
        this.update(result as T[]);
        this.updatePagination({
          total: isEmptyTotal ? 0 : totalCount,
        });
        await nextTick();
        this.tableBuilder.triggerEvent("loaded");
      } else {
        // 如果 loadMethods 未配置，则自动获取tableData数据
        this.stopEffect = watchEffect(() => {
          this.update(this.tableBuilder.config.tableData || []);
        });
      }
    } finally {
      this.loading = false;
    }
  }

  /**
   * 刷新 是否重置分页
   * @param resetPagination
   */
  public async refresh(resetPagination?: boolean) {
    if (resetPagination) {
      this.updatePagination({
        current: 1,
      });
    }
    await this.loadData(this.pagination);
  }

  public destroy() {
    this.stopEffect?.();
  }
}
