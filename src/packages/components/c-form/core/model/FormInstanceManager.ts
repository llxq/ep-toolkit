import type { ElForm } from "element-plus";
import { type Ref, unref } from "vue";

/**
 * 表单实例管理
 */
export class FormInstanceManager {
  private _instance?: Ref<TUndefinable<InstanceType<typeof ElForm>>>;
  /**
   * 表单的实例
   */
  public get instance(): TUndefinable<InstanceType<typeof ElForm>> {
    return unref(this._instance);
  }

  /**
   * 初始化表单的实例
   * @param instance
   */
  public init(instance: Ref<TUndefinable<InstanceType<typeof ElForm>>>): void {
    this._instance = instance;
  }

  /**
   * 表单的校验
   */
  public validate(): Promise<boolean> {
    return this.instance?.validate() ?? Promise.resolve(false);
  }
}
