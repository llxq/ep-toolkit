import { filterComponentEmptyProps } from "@/packages/components/c-form/core/helper/component.ts";
import type { ICFormProps } from "@/packages/components/c-form/core/types/formProps.ts";
import { merge, assign, omit } from "lodash";

/**
 * 表单配置管理
 */
export class FormConfigManager {
  /**
   * 表单配置
   */
  public config: ICFormProps = {} as ICFormProps;

  /**
   * 获取表单属性，剔除一些多余的属性。
   */
  public get getFormAttrs(): Partial<ICFormProps> {
    return filterComponentEmptyProps(
      omit(this.config, [
        "useRowLayout",
        "rowAttrs",
        "modelValue",
        "className",
      ]),
    );
  }

  /**
   * 初始化 config
   * @param config
   */
  public init(config: Partial<ICFormProps>): ICFormProps {
    merge(this.config, config);
    return this.config;
  }

  /**
   * 更新 config
   * @param value
   */
  public update(value: Partial<ICFormProps>): ICFormProps {
    assign(this.config, value);
    return this.config;
  }
}
