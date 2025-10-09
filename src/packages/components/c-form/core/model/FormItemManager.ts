import { createFormItem } from "@/packages/components/c-form/core/helper/createFormItem.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import type { IFormItem } from "@/packages/components/c-form/core/types/formProps.ts";
import { sortBy } from "lodash";

/**
 * 表单项管理
 */
export class FormItemManager<T extends TObj> {
  /**
   * 表单项
   */
  public formItems: FormItem<T>[] = [];

  public init(props: (IFormItem<T> | FormItem<T>)[]): FormItem<T>[] {
    this.formItems = props.map(createFormItem);
    return this.formItems;
  }

  public destroy(): void {
    this.formItems.forEach((it) => it.destroy());
    this.formItems = [];
  }

  /**
   * 获取当前可展示的列数据
   * @param formData
   * @param hiddenProps
   */
  public getShowColumns(formData: T, hiddenProps: Set<string>): FormItem<T>[] {
    this.formItems.forEach((column) => column.initFormItemVisible(hiddenProps));
    return sortBy(
      this.formItems.filter((column) => column.validateIsHidden(formData)),
      "sort",
    );
  }
}
