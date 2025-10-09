import { EFormEvent } from "@/packages/components/c-form/core/constants/enum.ts";
import { FormConfigManager } from "@/packages/components/c-form/core/model/FormConfigManager.ts";
import { FormDataStore } from "@/packages/components/c-form/core/model/FormDataStore.ts";
import { FormInstanceManager } from "@/packages/components/c-form/core/model/FormInstanceManager.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import { FormItemManager } from "@/packages/components/c-form/core/model/FormItemManager.ts";
import type {
  ICFormProps,
  IFormItem,
} from "@/packages/components/c-form/core/types/formProps.ts";
import { EventBus } from "@/packages/utils";
import { isEmpty, merge } from "lodash";

/**
 * 表单构造器，用于构造表单scheme和表单的各个事件等处理。
 */
export class FormBuilder<T extends TObj = TObj> {
  private readonly eventBus = new EventBus();

  /**
   * 用于收集自动隐藏的字段
   */
  public hiddenProps: Set<string> = new Set();

  public formItemManager = new FormItemManager<T>();

  public formDataStore = new FormDataStore<T>();

  public formConfigManager = new FormConfigManager();

  public formInstanceManager = new FormInstanceManager<T>();

  /**
   * 获取表单项
   */
  public get formItems(): FormItem<T>[] {
    return this.formItemManager.formItems;
  }

  /**
   * 获取表单数据
   */
  public get formData(): T {
    return this.formDataStore.formData;
  }

  /**
   * 获取当前可展示的列
   */
  public get getShowColumns(): FormItem<T>[] {
    return this.formItemManager.getShowColumns(this.formData, this.hiddenProps);
  }

  /**
   * 获取表单配置
   */
  public get config(): ICFormProps {
    return this.formConfigManager.config;
  }

  public constructor(
    columns?: (IFormItem<T> | FormItem<T>)[],
    config: ICFormProps = {},
  ) {
    this.init(columns ?? [], config);
  }

  /**
   * 初始化列数据
   * @param columns
   * @private
   */
  private parseFormItem(
    columns: (IFormItem<T> | FormItem<T>)[],
  ): (IFormItem<T> | FormItem<T>)[] {
    const { initialFormData } = this.config;
    if (!isEmpty(initialFormData)) {
      return columns.map((m) => {
        const { defaultValue, ...rest } = m;
        const prop = rest.prop;
        const initialFormDataValue = Reflect.get(initialFormData, prop);
        return {
          ...rest,
          defaultValue: Reflect.has(initialFormData, prop)
            ? initialFormDataValue
            : defaultValue,
        };
      });
    }
    return columns;
  }

  /**
   * 初始化
   * @param columns
   * @param config
   */
  public init(
    columns: (IFormItem<T> | FormItem<T>)[],
    config: ICFormProps = {},
  ): void {
    this.formConfigManager.init(
      merge(
        { startLoading: true, useRowLayout: false } as Partial<ICFormProps>,
        config,
      ),
    );
    if (columns.length) {
      this.formDataStore.init(
        this.formItemManager.init(this.parseFormItem(columns)),
      );
    }
  }

  /**
   * 用于给表单项值的增加默认填充内容
   * @param initialFormData
   * @param overwrite 是否覆盖所有值
   */
  public buildFormData(
    initialFormData: Partial<T>,
    overwrite?: boolean,
  ): FormBuilder<T> {
    this.formDataStore.buildFormData(initialFormData, overwrite);
    return this;
  }

  /**
   * 更新表单数据
   * @param key
   * @param value
   */
  public updateFormData(
    key: keyof T | string | string[],
    value: T[keyof T] | unknown,
  ): void {
    this.formDataStore.update(key, value);
  }

  /**
   * 获取格式化之后的数据
   */
  public getFormatData<X extends TObj = T>(): X {
    return this.formDataStore.getFormatData<X>(this.formItems);
  }

  /**
   * 发送事件
   * @param event
   */
  public async emit(event: EFormEvent): Promise<FormBuilder<T>> {
    await this.eventBus.emit(event);
    return this;
  }

  /**
   * 表单change事件触发
   * @param callBack
   */
  public onChange(callBack: (formData: T) => void): void {
    this.eventBus.on(EFormEvent.CHANGE, () => {
      /* 去除相关引用，只有通过 formBuilder 实例获取的变量才会更新视图 */
      callBack(this.getFormatData<T>());
    });
  }
}
