import type { TRenderFunction } from "@/helper/type.ts";
import type { ICFormProps } from "@/packages/components/c-form/core/types/formProps.ts";
import type { ITableConfig } from "@/packages/components/c-table/core/types/tableConfig.ts";

export interface IEpToolkitTableConfig {
  /**
   * 表格通用空数据渲染，默认使用 element-plus el-table 的空数据渲染
   * @param _
   */
  tableEmptyRender?: TRenderFunction;
  /**
   * column empty 渲染
   */
  columnEmptyRender?: TRenderFunction;
}

export interface IEpToolkitConfig {
  /**
   * 表单的配置
   */
  formConfig?: Partial<ICFormProps>;
  /**
   * 表格的配置
   */
  tableConfig?: Partial<ITableConfig<TObj>> & IEpToolkitTableConfig;
}
