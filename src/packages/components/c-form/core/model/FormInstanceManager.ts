import type { ElForm, ElFormItem } from "element-plus";
import { type ComponentPublicInstance, type Ref, unref } from "vue";

/**
 * 表单实例管理
 */
export class FormInstanceManager<T = TObj> {
  private _instance?: Ref<TUndefinable<InstanceType<typeof ElForm>>>;
  /**
   * 表单的实例
   */
  public get instance(): TUndefinable<InstanceType<typeof ElForm>> {
    return unref(this._instance);
  }

  private componentInstanceRefs?: Ref<TObj<string, ComponentPublicInstance>>;

  /**
   * 初始化表单的实例
   * @param instance
   * @param componentInstanceRefs
   */
  public init(
    instance: Ref<TUndefinable<InstanceType<typeof ElForm>>>,
    componentInstanceRefs?: Ref<TObj<string, ComponentPublicInstance>>,
  ): void {
    this._instance = instance;
    this.componentInstanceRefs = componentInstanceRefs;
  }

  /**
   * 表单的校验
   */
  public validate(): Promise<boolean> {
    return this.instance?.validate() ?? Promise.resolve(false);
  }

  /**
   * 获取某个组件的实例
   * @param prop
   */
  public getFormItemInstanceByProp(
    prop: keyof T,
  ): TUndefinable<InstanceType<typeof ElFormItem>> {
    return this.componentInstanceRefs
      ? (Reflect.get(this.componentInstanceRefs, prop) as TUndefinable<
          InstanceType<typeof ElFormItem>
        >)
      : void 0;
  }
}
