import { TableColumn } from "@/packages/components/c-table/core/model/TableColumn.ts";
import type { ICTableColumn } from "@/packages/components/c-table/core/types/tabColumn.ts";

export class TableColumnManager<T extends TObj> {
  public tableColumns: TableColumn<T>[] = [];

  /**
   * 初始化列
   * @param props
   */
  public init(props: ICTableColumn<T>[]) {
    this.tableColumns = props.map((column) => new TableColumn(column));
  }

  /**
   * 添加列
   * @param column
   */
  public add(column: TableColumn<T>) {
    this.tableColumns.push(column);
  }

  /**
   * 根据 prop 查找列
   * @param prop
   */
  public findColumnByProp(prop: string) {
    return this.tableColumns.find((column) => column.props.prop === prop);
  }
}
