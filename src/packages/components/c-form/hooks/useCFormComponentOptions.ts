import { isPromise } from "@/helper/is.ts";
import type {
  TOptions,
  TOptionsReturn,
} from "@/packages/components/c-form/core/types/shared.ts";
import { isFunction } from "lodash";
import { nextTick, ref, watch } from "vue";

export const useCFormComponentOptions = <T extends { options: TOptionsReturn }>(
  props: T,
  initOptionsSuccessCallBack?: () => void,
) => {
  /* 为了解析 options 可能存在 function */
  const parseOptions = ref<TOptions>([]);

  const loadingOptions = ref(false);

  let isLoadSuccess = false;

  /**
   * 只有第一次完成才会通知
   */
  const updateOptions = (options: TOptions) => {
    parseOptions.value = options;
    loadingOptions.value = false;
    if (!isLoadSuccess) {
      isLoadSuccess = true;
      nextTick().then(() => {
        isFunction(initOptionsSuccessCallBack) && initOptionsSuccessCallBack();
      });
    }
  };

  watch(
    () => props.options,
    () => {
      if (isFunction(props.options)) {
        const result = props.options();
        if (isPromise<TOptions>(result)) {
          loadingOptions.value = true;
          result.then((options) => {
            updateOptions(options);
          });
        } else {
          updateOptions(result);
        }
      } else {
        updateOptions(props.options);
      }
    },
    { deep: true, immediate: true },
  );

  return {
    parseOptions,
    loadingOptions,
  };
};
