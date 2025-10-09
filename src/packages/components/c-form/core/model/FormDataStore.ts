import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import type { IFormItem } from "@/packages/components/c-form/core/types/formProps.ts";
import { cloneDeep, isPlainObject, set } from "lodash";

/**
 * 表单数据存储
 */
export class FormDataStore<T extends TObj> {
  /**
   * 表单数据
   */
  public formData: T = {} as T;

  /**
   * 初始化 formData
   */
  public init(formItems: (FormItem<T> | IFormItem<T>)[]): void {
    const propsSet = new Set();
    formItems.forEach((formItem) => {
      if (Reflect.has(formItem, "prop")) {
        const { prop } = formItem;
        if (propsSet.has(prop)) {
          throw new Error(`${prop as string} is already exists.`);
        } else {
          const { defaultValue } = formItem;
          Reflect.set(this.formData, prop, cloneDeep(defaultValue || void 0));
          propsSet.add(prop);
        }
      }
    });
  }

  /**
   * 修改formData的值
   * @param key
   * @param value
   */
  public update(
    key: keyof T | string | string[],
    value: T[keyof T] | unknown,
  ): void {
    set(this.formData, key as keyof T, value);
  }

  /**
   * 初始化formData的默认值
   * @param initialFormData
   * @param overwrite 是否覆盖所有值
   */
  public buildFormData(initialFormData: Partial<T>, overwrite?: boolean): void {
    if (overwrite) {
      this.formData = cloneDeep<T>((initialFormData ?? {}) as T);
    } else {
      // 修改formData的值
      Reflect.ownKeys(initialFormData).forEach((key) => {
        this.update(key as keyof T, Reflect.get(initialFormData, key));
      });
    }
  }

  /**
   * 获取格式化数据
   * @param columns
   */
  public getFormatData<X extends TObj = T>(columns: FormItem<T>[]): X {
    const cloneData = cloneDeep(this.formData ?? {});
    return columns.reduce((result: X, column) => {
      const { format, prop } = column;
      const data = Reflect.get(cloneData, prop) as never;
      if (format && typeof format === "function") {
        const formatValue = format(data, cloneData, column) as never;
        /* 只有对象才会合并，其他值则会自动丢弃 */
        if (formatValue && typeof isPlainObject(formatValue)) {
          Object.assign(result, formatValue);
        }
      } else {
        Reflect.set(result, prop, data);
      }
      return result;
    }, {} as X);
  }
}
