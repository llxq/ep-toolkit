import { cFormComponents } from "@/packages/components/c-form/components";
import type { EFormComponentType } from "@/packages/components/c-form/core/constants/enum.ts";
import { getComponentName } from "@/packages/components/c-form/core/helper/component.ts";
import type { TKeyofCustomFormComponentType } from "@/packages/components/c-form/core/helper/createCustomCFormItem.ts";
import {
  addCustomDefinition,
  clearCustomToTagName,
  getCustomComponentByTagName,
  hasCustomDefinitionByTagName,
  isCustomComponent,
} from "@/packages/components/c-form/core/helper/customCFormDefinition.ts";
import { getStrategy } from "@/packages/components/c-form/core/helper/defaultPraseStrategy.ts";
import type { IFormItem } from "@/packages/components/c-form/core/types/formProps.ts";
import type {
  IStyle,
  TEvent,
} from "@/packages/components/c-form/core/types/shared.ts";
import type { ColProps, FormItemProps } from "element-plus";
import { isFunction, isObject, merge } from "lodash";
import { markRaw } from "vue";

let id = 0;

export class FormItem<T extends TObj = TObj, U extends TObj = TObj>
  implements IFormItem<T>
{
  public readonly id = id++;

  private _customTagName?: string | TKeyofCustomFormComponentType;

  public tag!: EFormComponentType;

  public label!: string | ((formItem: FormItem) => string);

  public attrs?: Partial<U>;

  public changeEvent?: string;

  public className?: string;

  public elFormItemAttrs?: Partial<FormItemProps> & IStyle;

  public elColAttrs?: Partial<ColProps>;

  public hidden?: ((formData: TObj, field: IFormItem<T>) => boolean) | boolean;

  public on?: TEvent;

  public prop!: keyof T | string;

  public span?: number;

  public style?: Partial<CSSStyleDeclaration> | string;

  public format?: (
    data: T[keyof T],
    formData: T,
    column: IFormItem<T>,
  ) => TNullableUndefinable<TObj>;

  public visible = true;

  /**
   * 是否展示该列
   */
  public show = true;

  /**
   * 默认值，默认从策略里面获取，也可自定义。如未定义默认为 void 0
   * @see src/components/base-form/core/defaultPraseStrategy.ts
   */
  public defaultValue?: TAllType;

  /**
   * 当前对象的销毁函数
   * @private
   */
  private stopStacks = new Set<() => void>();

  public get getFormComponent() {
    if (!this.tag) {
      return this.tag;
    }
    if (this._customTagName || isCustomComponent(this.tag)) {
      return markRaw(getCustomComponentByTagName(this.tag) as TObj);
    }
    if (Reflect.has(cFormComponents, this.tag)) {
      return markRaw(cFormComponents[this.tag as EFormComponentType] as never);
    }
    return this.tag;
  }

  public constructor(props?: Partial<IFormItem<T>>) {
    props && this.initProps(props);
  }

  /**
   * 初始化属性
   * @param props
   */
  public initProps(props: Partial<IFormItem<T>>) {
    if (!props.prop) {
      this.show = true;
    }
    this.prop = props.prop || this.prop;
    this.update(props);
  }

  public update(props: Partial<IFormItem<T>>) {
    /* 处理tag */
    if (isObject(props.tag)) {
      // 如果组件有name的话，获取组件的名称
      const componentName = `vertical__${getComponentName(props.tag) || (props.prop as string)}`;
      // NOTICE：如果页面上同时存在多个formBuilder，并且自定义组件名称也是重复的，则不会重复注册。目前的设计暂不支持通过formItem去判断来源为哪一个formBuilder
      if (!hasCustomDefinitionByTagName(componentName)) {
        // 临时存储对应的组件定义
        addCustomDefinition(componentName, {
          component: props.tag,
        });
      }
      this._customTagName = componentName;
      props.tag = componentName as EFormComponentType;
    }
    merge(this, getStrategy<T>(props) || props);
  }

  /**
   * 校验当前是否可见。
   * @param formData
   */
  public validateIsHidden<F extends TObj>(formData: F): boolean {
    const isHidden = isFunction(this.hidden)
      ? !this.hidden(formData, this)
      : !this.hidden;
    return isHidden && this.show;
  }

  public initFormItemVisible(hiddenProps: Set<string>): void {
    this.visible = !hiddenProps.has(this.prop as string);
  }

  public addStopper(fn: () => void): void {
    this.stopStacks.add(fn);
  }

  public removeStopper(fn: () => void): void {
    fn();
    this.stopStacks.delete(fn);
  }

  /**
   * 实例销毁
   */
  public destroy(): void {
    this.stopStacks.forEach((fn) => fn());
    this.stopStacks.clear();
    // 组件销毁的时候清空对应的组件定义
    this._customTagName && clearCustomToTagName(this._customTagName);
  }
}
