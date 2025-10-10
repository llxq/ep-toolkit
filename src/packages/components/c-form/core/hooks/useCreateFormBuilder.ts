import { FormBuilder } from "@/packages/components/c-form/core/FormBuilder.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";
import type {
  ICFormProps,
  IFormItem,
} from "@/packages/components/c-form/core/types/formProps.ts";
import { type Ref, ref, type ShallowRef, unref } from "vue";

export interface ICreateFormBuilderReturn<T extends TObj> {
  formBuilder: FormBuilder<T>;
}

export interface ICreateFormBuilderConfig extends ICFormProps {
  // TODO 完善 table 的时候需要将该 any 变更回来
  baseTableRef?: Readonly<ShallowRef<TNullable<any>>> | Ref<any>;
}

/**
 * 创建一个formBuilder
 * @param fields
 * @param config
 * @example 泛形必须要传递，否者无法推导类型
 * const { formBuilder } = useCreateFormBuilder<{ searchKey: [string, string]; test: string; }>(
 *   [
 *     createBaseFormItem({
 *       tag: EFormComponentType.GROUP_SELECT_INPUT,
 *       label: "test",
 *       prop: "searchKey",
 *     }),
 *     createBaseFormItem({
 *       tag: EFormComponentType.SELECT,
 *       label: "test",
 *       prop: "searchKey",
 *     }),
 *   ]
 * );
 */
export const useCreateFormBuilder = <T extends TObj = TObj>(
  fields?: (IFormItem | FormItem)[],
  config?: ICreateFormBuilderConfig,
): ICreateFormBuilderReturn<T> => {
  const builder = new FormBuilder<T>(
    fields as (IFormItem<T> | FormItem<T>)[],
    config,
  );
  const formBuilder = ref<FormBuilder<T>>(builder) as unknown as Ref<
    FormBuilder<T>
  >;

  /* 如果传递了 baseTableRef，则会默认监听change事件，并且刷新表格内容 */
  if (config?.baseTableRef) {
    formBuilder.value.onChange(() => {
      config.baseTableRef?.value?.refresh();
    });
  }

  return {
    formBuilder: unref(formBuilder),
  };
};

/**
 * 创建一个动态的builder。
 * 注意：如果动态列中需要使用formData的数据，不能直接使用本方法返回的 formBuilder 对象，因为动态列会在函数返回之前被调用
 * @example 如果动态列中没有使用 formBuilder 相关内容请使用下列方法
 * const test = ref(1);
 * const { formBuilder } = useDynamicCreateFormBuilder<{ searchKey: [string, string] }>(() => {
 *   return [
 *     createBaseFormItem(() => {
 *       return {
 *         tag: EFormComponentType.GROUP_SELECT_INPUT,
 *         label: "test",
 *         prop: "searchKey",
 *         attrs: {
 *           placeholder: 1 === test.value ? "placeholder-a" : "placeholder-b",
 *         },
 *       }
 *     }),
 *   ]
 * });
 *
 * @example 如果动态列中使用了 formBuilder 相关内容请使用下列方法。（不能在初始化之前直接使用 formBuilder 实例）
 * const { formBuilder } = useDynamicCreateFormBuilder<{ searchKey: [string, string] }>(({ formData }) => {
 *   return [
 *     createBaseFormItem(() => {
 *       return {
 *         tag: EFormComponentType.GROUP_SELECT_INPUT,
 *         label: "test",
 *         prop: "searchKey",
 *         attrs: {
 *           placeholder: ESearchType.FRIEND_SEARCH_FIELD === formData.searchKey?.[1] ? "placeholder-a" : "placeholder-b",
 *         },
 *       }
 *     }),
 *   ]
 * });
 * @param getDynamicFields
 * @param config
 *  */
export const useDynamicCreateFormBuilder = <T extends TObj = TObj>(
  getDynamicFields?: (formBuilder: FormBuilder<T>) => (IFormItem | FormItem)[],
  config?: ICreateFormBuilderConfig,
): ICreateFormBuilderReturn<T> => {
  const { formBuilder } = useCreateFormBuilder<T>([], {
    ...config,
    isAutoInit: false,
  });
  formBuilder.init(
    (getDynamicFields?.(formBuilder) ?? []) as (IFormItem<T> | FormItem<T>)[],
  );

  return {
    formBuilder,
  };
};
