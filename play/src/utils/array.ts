import { createFormItem } from "@/packages/components/c-form/core/helper/createFormItem.ts";
import type { FormItem } from "@/packages/components/c-form/core/model/FormItem.ts";

export const repeatFormItems = <T extends TObj = TObj, U extends TObj = TObj>(
  formItems: FormItem<T, U>[],
  count = 1,
): FormItem<T, U>[] => {
  let nextCount = count;
  const loop = () => {
    formItems.forEach((formItem) => {
      formItems.push(
        createFormItem({
          tag: formItem.tag,
          label: `${formItem.prop as any}__${nextCount}`,
          prop: `${formItem.prop as any}__${nextCount}`,
          attrs: {
            ...formItem.attrs,
          },
          span: formItem.span,
        }) as FormItem<T, U>,
      );
    });
  };
  while (nextCount--) {
    loop();
  }
  return formItems;
};
