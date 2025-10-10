import { EFormComponentType } from "@/packages/components/c-form/core/constants/enum.ts";

/**
 * 重置值的解析策略
 */
export const resetValueStrategy: Partial<
  Record<EFormComponentType, (value: any) => any>
> = {
  [EFormComponentType.GROUP_SELECT_INPUT]: (value: string[]) => [
    "",
    value.at(-1),
  ],
  [EFormComponentType.DATE_RANGE_AND_SELECT_GROUP]: (value: string[]) => [
    "",
    "",
    value.at(-1),
  ],
};
