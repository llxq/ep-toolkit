import { TABLE_DRAGGABLE_CLASS } from "@/packages/components/c-table/core/constants/vNode.tsx";
import type { ICTableColumn } from "@/packages/components/c-table/core/types/tabColumn.ts";
import { isFunction, omit } from "lodash";

export class TableColumn<T extends TObj> {
  public props: ICTableColumn<T>;

  constructor(props: ICTableColumn<T>) {
    this.props = props;
  }

  public get isHidden() {
    return Boolean(
      isFunction(this.props.hidden)
        ? this.props.hidden(this.props)
        : this.props.hidden,
    );
  }

  public get tableColumnAttrs() {
    return omit(this.props, [
      "contentRender",
      "renderToOptions",
      "headerRender",
      "hidden",
      "emptyValue",
      "onClick",
      "emptyClick",
      "renderToEmpty",
      "draggable",
      "className",
    ]);
  }

  public get className() {
    return `${this.props.className ?? ""}${this.props.draggable ? ` ${TABLE_DRAGGABLE_CLASS}` : ""}`;
  }
}
