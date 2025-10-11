import { createFormItem } from "@/packages/components/c-form/core/helper/createFormItem.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import type { IFormItem } from "@/packages/components/c-form/core/types/formProps.ts";

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
   */
  public getShowFormItems(formData: T): FormItem<T>[] {
    return this.formItems.filter((column) => !column.isHidden(formData));
  }
}
