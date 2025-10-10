import { DATE_SHORTCUTS } from "@/packages/components/c-form/core/constants/date.ts";
import { EFormComponentType } from "@/packages/components/c-form/core/constants/enum.ts";
import type { TKeyofCustomFormComponentType } from "@/packages/components/c-form/core/helper/createCustomCFormItem.ts";
import {
  getCustomComponentDefinition,
  isCustomComponent,
} from "@/packages/components/c-form/core/helper/customCFormDefinition.ts";
import type { ICFormNumberRangeAttrs } from "@/packages/components/c-form/core/types/formItemAttrs.ts";
import type { IFormItem } from "@/packages/components/c-form/core/types/formProps.ts";
import type { InputProps } from "element-plus";
import { isFunction, isObject, isString, merge, mergeWith } from "lodash";

const mergeEmptyAttrsValue = <T extends IFormItem, U extends T["attrs"]>(
  field: T,
  source: U,
) => {
  const originAttrs = field.attrs || (field.attrs = {} as U);
  mergeWith(
    originAttrs,
    source,
    (objValue: U[keyof U], srcValue: U[keyof U]) => {
      if (objValue && srcValue && isObject(objValue) && isObject(srcValue)) {
        return merge(srcValue, objValue);
      }
      return objValue ?? srcValue;
    },
  );
  return field;
};

/**
 * 列的默认解析策略（用于初始化一些默认值，减少使用时的字段）
 */
export const defaultParseStrategy: Record<
  EFormComponentType,
  (field: IFormItem) => IFormItem
> = {
  [EFormComponentType.RADIO]: (field) => field,
  [EFormComponentType.SWITCH]: (field) => field,
  [EFormComponentType.INPUT]: (field) => {
    const { label } = field;
    mergeEmptyAttrsValue(field, {
      placeholder: `请输入${label}`,
      clearable: true,
    });
    return field;
  },
  [EFormComponentType.SELECT]: (field) => {
    const { label, attrs: { multiple = false } = {} } = field;
    const mergeData = {
      placeholder: `请选择${label}`,
      clearable: true,
      width: "180px",
    };
    if (multiple) {
      Object.assign(mergeData, {
        collapseTags: true,
        collapseTagsTooltip: true,
        filterable: true,
      });
    }
    return mergeEmptyAttrsValue(field, mergeData);
  },
  [EFormComponentType.DATE]: (field) => {
    const { label } = field;
    return mergeEmptyAttrsValue(field, {
      type: "datetime",
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      format: "YYYY-MM-DD HH:mm",
      clearable: true,
      placeholder: `请选择${label}`,
      defaultValue: new Date(),
    });
  },
  [EFormComponentType.DATE_RANGE]: (field) =>
    merge(
      {
        defaultValue: [],
      },
      mergeEmptyAttrsValue(field, {
        type: "datetimerange",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        format: "YYYY-MM-DD HH:mm",
        rangeSeparator: "至",
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        clearable: true,
        autoAddSeconds: true,
        validateEvent: true,
        /* 默认选择时间的时候从开始时间的 00:00 到结束时间的 23:59 */
        useDefaultTimeToDay: true,
        /* 默认都带上快捷时间 */
        shortcuts: DATE_SHORTCUTS,
      }),
    ),
  [EFormComponentType.GROUP_SELECT_INPUT]: (field) =>
    merge(
      {
        defaultValue: [],
      },
      mergeEmptyAttrsValue(field, {
        clearable: true,
        placeholder: "请输入对应的内容",
      }),
    ),
  [EFormComponentType.SEARCH_INPUT]: (field) => {
    const { label } = field;
    return mergeEmptyAttrsValue(field, {
      placeholder: `请输入${label}`,
      clearable: true,
    });
  },
  [EFormComponentType.CASCADER]: (field) => {
    const { label, attrs = {}, prop } = field;
    const { props: { multiple = false } = {} } = attrs;
    const mergeData = {
      placeholder: `请选择${label}`,
      clearable: true,
      props: {
        value: "value",
      },
      width: "180px",
    };
    if (multiple) {
      Object.assign(mergeData, {
        collapseTags: true,
        collapseTagsTooltip: true,
        filterable: true,
      });
    }
    return merge(
      {
        format: (currentData: string[]) =>
          /* 如果是单选，则默认拿到最后一个值 */
          ({
            [prop]:
              !multiple && currentData && Array.isArray(currentData)
                ? currentData.at(-1)
                : currentData,
          }),
      },
      mergeEmptyAttrsValue(field, mergeData),
    );
  },
  [EFormComponentType.NUMBER_RANGE]: (field) => {
    const { label } = field;
    const publicAttrs: Partial<InputProps> = {
      clearable: true,
    };
    return merge(
      {
        defaultValue: [],
      },
      mergeEmptyAttrsValue(field, {
        minProps: {
          ...publicAttrs,
          placeholder: `最小${label}`,
        },
        maxProps: {
          ...publicAttrs,
          placeholder: `最大${label}`,
        },
        separator: "至",
        min: 0,
        max: Number.MAX_VALUE,
      } as ICFormNumberRangeAttrs),
    );
  },
  [EFormComponentType.DATE_RANGE_AND_SELECT_GROUP]: (field) => {
    const parseField =
      defaultParseStrategy[EFormComponentType.DATE_RANGE](field);

    return mergeEmptyAttrsValue(parseField, {
      selectOptions: {
        placeholder: "请选择",
      },
    });
  },
  [EFormComponentType.NUMBER_INPUT]: (field) => {
    const { label } = field;
    mergeEmptyAttrsValue(field, {
      placeholder: `请输入${label}`,
      clearable: true,
      min: 0,
    });
    return field;
  },
};

const isCustomComponentKey = (
  key: unknown,
): key is TKeyofCustomFormComponentType => typeof key === "string";

export const getStrategy = <T extends TObj>(
  field: Partial<IFormItem<T>>,
): TUndefinable<IFormItem<T>> => {
  const { tag } = field;
  if (isString(tag) && Reflect.has(defaultParseStrategy, tag)) {
    return Reflect.get(
      defaultParseStrategy,
      tag,
    )(field as IFormItem) as IFormItem<T>;
  }
  // 判断是否为自定义组件
  if (isCustomComponentKey(tag) && isCustomComponent(tag)) {
    const definition = getCustomComponentDefinition(tag);
    if (
      definition?.defaultPraseStrategy &&
      isFunction(definition.defaultPraseStrategy)
    ) {
      return definition.defaultPraseStrategy(
        field as IFormItem,
      ) as IFormItem<T>;
    }
  }
  return void 0;
};
