import { isAsyncComponent } from "@/helper/is";
import {
  type AsyncComponentLoader,
  type Component,
  createVNode,
  defineAsyncComponent,
  getCurrentInstance,
  h,
  nextTick,
  ref,
  render,
  type VNode,
  watch,
  watchEffect,
} from "vue";
import { useRoute } from "vue-router";

/**
 * 全屏弹框事件
 * NOTICE: 注意如果子组件有相同的事件分发上来也是可以直接关闭弹框的。
 */
export enum EDialogEvent {
  /**
   * 确认
   */
  CONFIRM = "dialog:confirm",
  /**
   * 取消
   */
  CANCEL = "dialog:cancel",
}

export type IEDialogEventValues = "dialog:confirm" | "dialog:cancel";

type PropsOf<T> = T extends Component<infer P> ? P : never;

const DIALOG_ROOT_ID = "__dialog_root__";

const getRoot = () => {
  let root = document.getElementById(DIALOG_ROOT_ID);
  if (!root) {
    root = document.createElement("div");
    root.id = DIALOG_ROOT_ID;
    document.body.appendChild(root);
  }
  return root;
};

const useMountDialog = () => {
  const appContext = getCurrentInstance()?.appContext;

  const unmount = (mountElement: HTMLDivElement) => {
    if (mountElement) {
      const root = getRoot();
      render(null, mountElement);
      root?.removeChild(mountElement);
    }
  };

  /**
   * 挂载全屏弹框
   * @param component
   * @param mountElement
   */
  const mount = (component: VNode, mountElement: HTMLDivElement) => {
    if (!component) {
      throw new Error("component is required");
    }
    const componentVNode = createVNode(component);
    componentVNode.appContext = appContext || componentVNode.appContext;
    const root = getRoot();
    root.appendChild(mountElement);
    render(componentVNode, mountElement);

    return {
      unmount,
    };
  };

  return {
    mount,
    unmount,
  };
};

let uid = 0;
const getNextUid = () => {
  const nextId = uid >= Number.MAX_SAFE_INTEGER ? (uid = 0) : ++uid;
  return `z-dialog-${nextId}`;
};

export class UseDialogError extends Error {}

export interface IOpenDialogOptions {
  /**
   * 是否在路由变化的时候不自动关闭弹框
   */
  notCloseBeforeRouteChange?: boolean;
}

/**
 * 获取首字母大写事件
 * @param event
 */
const getListenerName = (event: string) => {
  const [firstChar, ...rest] = event.toString();
  return `on${firstChar.toUpperCase() + rest.join("")}`;
};

const allIdStacks = ref<
  Map<TNumberOrString, { id: TNumberOrString; cleanup: () => void }[]>
>(new Map());
/**
 * 关闭所有弹框
 */
export const closeAllDialog = () => {
  allIdStacks.value.forEach((stacks) => {
    stacks.forEach((it) => it.cleanup());
  });
  allIdStacks.value.clear();
};

export const useOpenDialog = () => {
  const checkAppContext = getCurrentInstance()?.appContext;

  if (!checkAppContext) {
    console.warn("useOpenDialog must be called in setup");
  }
  const dialogId = getNextUid();
  const idStacks = ref<{ id: TNumberOrString; cleanup: () => void }[]>([]);
  watchEffect(() => {
    if (idStacks.value.length) {
      allIdStacks.value.set(dialogId, idStacks.value);
    } else {
      allIdStacks.value.delete(dialogId);
    }
  });

  const { mount } = useMountDialog();

  const route = useRoute();

  /**
   * 关闭弹框
   * @param id 弹框的唯一标识
   * @param notCloseBeforeAllInstance 是否不关闭弹框前的所有实例
   */
  const closeDialog = (
    id?: TNumberOrString,
    notCloseBeforeAllInstance?: boolean,
  ) => {
    if (id) {
      const index = idStacks.value.findIndex((it) => it.id === id);
      if (index > -1) {
        if (!notCloseBeforeAllInstance) {
          for (let i = index; i < idStacks.value.length; i++) {
            idStacks.value[i].cleanup();
          }
          idStacks.value.splice(index);
        } else {
          idStacks.value[index].cleanup();
          idStacks.value.splice(index, 1);
        }
      }
    } else {
      idStacks.value.forEach((it) => {
        it.cleanup();
      });
      idStacks.value = [];
    }
  };

  /**
   * 打开弹框
   * @param loader
   * @param props
   * @param closeId 如果想要手动关闭某个弹框，需要自行设置closeId
   * @param options
   * @example
   * const { openDialog, closeDialog } = useOpenDialog()
   * openDialog(xxxComponent, {xxProp: 1}, 'id_1')
   * // 两秒后手动关闭弹框
   * setTimeout(() => {
   *   closeDialog('id_1')
   * }, 2000)
   */
  const openDialog = async <V = TAllType, T extends Component = Component>(
    loader: AsyncComponentLoader<T> | T,
    props?: Partial<PropsOf<T>>,
    closeId?: TNumberOrString,
    options?: IOpenDialogOptions,
  ) => {
    const DialogInstance = isAsyncComponent(loader)
      ? defineAsyncComponent({
          loader,
          delay: 0, // 立即加载
        })
      : loader;
    await nextTick();
    const currentId = closeId ?? getNextUid();
    const mountElement = document.createElement("div");
    return new Promise<V>((resolve, reject) => {
      const unWatch = options?.notCloseBeforeRouteChange
        ? null
        : watch(
            () => route.fullPath,
            () => {
              closeDialog();
              reject();
            },
          );
      const { unmount: currentUnmount } = mount(
        h(DialogInstance as Component, {
          ...props,
          modelValue: true,
          "onUpdate:modelValue": (v: boolean) => {
            if (!v) {
              // 等待下个队列执行的时候在执行
              nextTick(() => {
                // 判断是否注册了关闭事件
                if (idStacks.value.find((it) => it.id === currentId)) {
                  closeDialog(currentId);
                  reject();
                }
              });
            }
          },
          [getListenerName(EDialogEvent.CONFIRM)]: (data: V) => {
            resolve(data);
            closeDialog();
          },
          [getListenerName(EDialogEvent.CANCEL)]: (data: V) => {
            reject(data);
            closeDialog();
          },
        }),
        mountElement,
      );
      idStacks.value.push({
        id: currentId,
        cleanup: () => {
          currentUnmount(mountElement);
          unWatch?.();
        },
      });
    });
  };

  /**
   * 不自动在路由关闭的时候关闭弹框
   */
  const openDialogIgnoreRouteChange = <
    V = TAllType,
    T extends Component = Component,
  >(
    loader: AsyncComponentLoader<T> | T,
    props?: Partial<PropsOf<T>>,
    closeId?: TNumberOrString,
    options?: IOpenDialogOptions,
  ) =>
    openDialog<V, T>(loader, props, closeId, {
      ...options,
      notCloseBeforeRouteChange: true,
    });

  return {
    openDialog,
    closeDialog,
    openDialogIgnoreRouteChange,
  };
};
