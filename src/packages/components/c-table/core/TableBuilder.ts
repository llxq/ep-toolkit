import type { TElTableRefInstance } from "@/helper/type.ts";
import type { CTableEventKeys } from "@/packages/components/c-table/core/constants/event.ts";
import { TableColumnManager } from "@/packages/components/c-table/core/model/TableColumnManager.ts";
import { TableConfigManger } from "@/packages/components/c-table/core/model/TableConfigManger.ts";
import { TableDataStore } from "@/packages/components/c-table/core/model/TableDataStore.ts";
import { TableEventManager } from "@/packages/components/c-table/core/model/TableEventManager.ts";
import { TableInstanceManager } from "@/packages/components/c-table/core/model/TableInstanceManager.ts";
import type {
  ICTablePagination,
  TFunction,
} from "@/packages/components/c-table/core/types/shared.ts";
import type { ICTableColumn } from "@/packages/components/c-table/core/types/tabColumn.ts";
import type { ITableConfig } from "@/packages/components/c-table/core/types/tableConfig.ts";

/**
 * 表格构造器 用于构造表格scheme和表格的各个事件等处理。
 * XXX 目前所有的实例都是暴漏出去的，后续可能会调整为私有的
 */
export class TableBuilder<T extends TObj = any> {
  public tableEventManager = new TableEventManager();
  public get events() {
    return this.tableEventManager.events;
  }

  public tableColumnManager = new TableColumnManager<T>();
  public get showColumns() {
    return this.tableColumnManager.tableColumns.filter((it) => !it.isHidden);
  }
  public get starDraggable() {
    return this.showColumns.some((column) => Boolean(column.props.draggable));
  }

  public tableConfigManager = new TableConfigManger<T>();
  public get config() {
    return this.tableConfigManager.config;
  }
  public get tableAttrs() {
    return this.tableConfigManager.tableAttrs;
  }

  public tableDataStore: TableDataStore<T>;
  public get data() {
    return this.tableDataStore.data;
  }
  public set data(data: T[]) {
    this.tableDataStore.update(data);
  }
  public get pagination() {
    return this.tableDataStore.pagination;
  }
  public get loading() {
    return this.tableDataStore.loading;
  }
  public get selectList() {
    return this.tableDataStore.selectList;
  }

  private _instanceManager = new TableInstanceManager();
  public get elTableInstance() {
    return this._instanceManager.instance;
  }

  // 如果不传递 columns 则默认不会初始化
  constructor(columns?: ICTableColumn<T>[], config?: ITableConfig<T>) {
    if (columns) {
      this.init(columns, config);
    }
    this.tableDataStore = new TableDataStore<T>(this);
  }

  public init(columns: ICTableColumn<T>[], config?: ITableConfig<T>) {
    if (!Array.isArray(columns)) {
      throw new Error("columns must be an array.");
    }
    this.tableColumnManager.init(columns);
    this.tableConfigManager.init(config);
    this.tableDataStore.init();
  }

  /**
   * 初始化表格实例
   * @param instance
   */
  public initElTableInstance(instance: TElTableRefInstance) {
    this._instanceManager.setInstance(instance);
  }

  /**
   * 注册事件
   * @param eventName 事件名称
   * @param callback 因为目前类型问题，这里暂时只能使用通用回调类型
   */
  public registerEvent(eventName: CTableEventKeys, callback: TFunction) {
    return this.tableEventManager.register(eventName, callback);
  }

  /**
   * 触发事件 主要给内部使用，不建议外部使用
   * @param eventName
   * @param args
   */
  public triggerEvent(eventName: CTableEventKeys, ...args: any[]) {
    this.tableEventManager.trigger(eventName, ...args);
  }

  /**
   * 获取事件
   * @param emit
   */
  public getTableRegisterEvents<E extends string>(
    emit: (eventName: E, ...args: any[]) => void,
  ) {
    return this.tableEventManager.getTableRegisterEvents<E>(emit);
  }

  /**
   * 分页器触发的事件
   */
  public getPaginationEvents<E extends string>(
    emit: (eventName: E, ...args: any[]) => void,
  ) {
    return this.tableEventManager.getPaginationEvents<E>(emit);
  }

  /**
   * 更新表格数据
   * @param data
   */
  public updateTableData(data: T[]) {
    this.tableDataStore.update(data);
  }

  /**
   * 更新选中数据
   * @param data
   */
  public updateSelectList(data: T[]) {
    this.tableDataStore.updateSelectList(data);
  }

  public updatePagination(pagination: Partial<ICTablePagination>) {
    return this.tableDataStore.updatePagination(pagination);
  }

  /**
   * 刷新
   * @param resetPagination 是否重置分页
   */
  public async refresh(resetPagination?: boolean) {
    await this.tableDataStore.refresh(resetPagination);
  }
}
