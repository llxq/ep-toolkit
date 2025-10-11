import { EFormEvent } from "@/packages/components/c-form/core/constants/enum.ts";
import { resetValueStrategy } from "@/packages/components/c-form/core/helper/resetValueStrategy.ts";
import { FormConfigManager } from "@/packages/components/c-form/core/model/FormConfigManager.ts";
import { FormDataStore } from "@/packages/components/c-form/core/model/FormDataStore.ts";
import { FormInstanceManager } from "@/packages/components/c-form/core/model/FormInstanceManager.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import { FormItemManager } from "@/packages/components/c-form/core/model/FormItemManager.ts";
import type {
  ICFormProps,
  IFormItem,
} from "@/packages/components/c-form/core/types/formProps.ts";
import type { TTriggerEventName } from "@/packages/components/c-form/core/types/shared.ts";
import { EventBus } from "@/packages/utils";
import { isEmpty, isFunction, merge } from "lodash";

/**
 * 表单构造器，用于构造表单scheme和表单的各个事件等处理。
 */
export class FormBuilder<T extends TObj = TObj> {
  private readonly eventBus = new EventBus();

  /**
   * 是否初始化完成
   */
  public isInit = false;

  /**
   * 用于收集自动隐藏的字段
   */
  public hiddenProps: Set<string> = new Set();

  public formItemManager = new FormItemManager<T>();

  public formDataStore = new FormDataStore<T>();

  public formConfigManager = new FormConfigManager();

  public formInstanceManager = new FormInstanceManager();

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
  public get getShowFormItems(): FormItem<T>[] {
    return this.formItemManager.getShowFormItems(this.formData);
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
    const isAutoInit = config.isAutoInit ?? true;
    isAutoInit && this.init(columns ?? [], config);
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
    this.isInit = true;
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
    this.formDataStore.updateOriginFormData();
    this.eventBus.on(EFormEvent.CHANGE, () => {
      callBack(this.getFormatData<T>());
    });
  }

  /**
   * 表单查询事件
   */
  public onSearch(callBack: (formData: T) => void): void {
    this.eventBus.on(EFormEvent.SEARCH, () => {
      callBack(this.getFormatData<T>());
    });
  }

  /**
   * 根据传递进来的值对formData的值进行重置，如果key不存在则默认 undefined
   * @param trigger 是否触发查询/change
   * @param model 解析模式，auto 根据默认值数据类型进行处理，empty：都重置为 undefined，custom 自定义处理；
   * @param resetCallBack 自定义解析器；解析模式为 auto 的情况下，有些既定规则是不会走callBack的。custom 则全部走自定义解析器。如果在 custom 或者 auto 的情况下没有设置自定义解析器在，则默认都是 undefined
   */
  public reset(
    trigger: TTriggerEventName | TTriggerEventName[] = "all",
    model: "auto" | "empty" | "custom" = "auto",
    resetCallBack?: (
      prop: string | keyof T,
      value?: TAllType | T[keyof T],
    ) => TAllType,
  ) {
    const length = this.formItems.length;
    for (let i = 0; i < length; ++i) {
      const { tag, prop } = this.formItems[i];
      if (tag && prop) {
        const originValue = Reflect.get(this.formData, prop);
        if (model === "empty") {
          this.updateFormData(prop, void 0);
          continue;
        }
        // 如果 auto 并且没有对应的策略则走 原始值
        const _parser =
          resetCallBack ||
          (() => Reflect.get(this.formDataStore.originFormData, prop));
        if (model === "custom") {
          this.updateFormData(prop, _parser(prop, originValue));
          continue;
        }
        if (model === "auto") {
          const defaultParser = Reflect.get(resetValueStrategy, tag);
          // 特殊处理的组件
          if (defaultParser && isFunction(defaultParser)) {
            this.updateFormData(prop, defaultParser(originValue));
          } else {
            this.updateFormData(prop, _parser(prop, originValue));
          }
        }
      }
    }
    const triggerList = Array.isArray(trigger) ? trigger : [trigger];
    const isAll = triggerList.includes("all");
    if (triggerList.includes("change") || isAll) {
      void this.emit(EFormEvent.CHANGE);
    }
    if (triggerList.includes("search") || isAll) {
      void this.emit(EFormEvent.SEARCH);
    }
  }

  /**
   * 表单校验
   */
  public validate(): Promise<boolean> {
    return this.formInstanceManager.validate();
  }
}
