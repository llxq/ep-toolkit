import { isPromise } from "@/helper/is";
import { ElLoading } from "element-plus";
import { type Ref, ref, watchPostEffect } from "vue";

/**
 * 用于优化异步加载体验
 * @param initialValue 默认值
 * @param isFull 是否为全屏加载
 */
export function useAsyncLoader(
  initialValue?: boolean,
  isFull?: boolean,
): [Ref<boolean>, (fn: () => Promise<void> | void) => Promise<void>] {
  const loading = ref(initialValue ?? false);
  let loadingInstance: Pick<
    ReturnType<typeof ElLoading.service>,
    "close"
  > | null;

  const setStatus = (status: boolean) => {
    loading.value = status;
  };

  const execute = (fn: () => Promise<void> | void) =>
    new Promise<void>((resolve) => {
      setStatus(true);
      const result = fn();
      if (!isPromise(result)) {
        setStatus(false);
        resolve();
      } else {
        result.finally(() => {
          setStatus(false);
          resolve();
        });
      }
    });

  if (isFull) {
    watchPostEffect(() => {
      if (loading.value) {
        loadingInstance = ElLoading.service({
          text: "加载中...",
        });
      } else {
        loadingInstance?.close();
      }
    });
  }

  return [loading, execute];
}
