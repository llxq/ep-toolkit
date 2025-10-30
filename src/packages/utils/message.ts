import { ElMessageBox } from "element-plus";
import type { ElMessageBoxOptions } from "element-plus/es/components/message-box/src/message-box.type";

/**
 * 带loading的 confirm，适合处理一些确认之后需要执行异步操作的情况
 * @param content
 * @param callBack 异步操作
 * @param options
 *
 * @example
 * loadingConfirm("确定要删除吗?", async () => {
 *   await deleteApi({ id: 1 });
 *   console.log("删除成功");
 * }, { confirmButtonText: "确定删除", cancelButtonText: "我在想想" });
 */
export const loadingConfirm = async (
  content: string,
  callBack: () => Promise<void> | void,
  options?: ElMessageBoxOptions,
) => {
  try {
    await ElMessageBox.confirm(content, {
      title: options?.title || "提示",
      closeOnClickModal: false,
      ...options,
      beforeClose: async (action, instance, done) => {
        // 点击确定
        if (action === "confirm") {
          const setLoading = (loading: boolean) => {
            instance.confirmButtonLoading = loading;
            instance.cancelButtonLoading = loading;
          };
          try {
            setLoading(true);
            await callBack();
            done();
          } finally {
            setLoading(false);
          }
        } else {
          // loading 过程中不可手动关闭。
          if (instance.confirmButtonLoading || instance.cancelButtonLoading) {
            return;
          }
          done();
        }
      },
    });
    return true;
  } catch (e) {
    if (e === "cancel") {
      return false;
    }
  }
};
