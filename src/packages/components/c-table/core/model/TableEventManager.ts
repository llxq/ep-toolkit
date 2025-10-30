import {
  type CTableEventKeys,
  EL_TABLE_EVENTS,
  PAGINATION_EVENT_PREFIX,
  PAGINATION_EVENTS,
} from "@/packages/components/c-table/core/constants/event.ts";
import type { TFunction } from "@/packages/components/c-table/core/types/shared.ts";

interface ITableEventStack {
  /**
   * 事件id
   */
  id: number;
  /**
   * 回调
   */
  callback: TFunction;
  /**
   * 是否暂停
   * @default false
   */
  paused: boolean;
}

// 用于生成事件回调对应的id
let id = new Date().getTime();

export class TableEventManager {
  public events: TObj<CTableEventKeys, ITableEventStack[]> = {};
  public idEventMap: Map<number, CTableEventKeys> = new Map();
  public emitFnc?: TFunction;

  /**
   * 根据id查找事件
   * @param id
   * @private
   */
  private findEventById(id: number): TUndefinable<ITableEventStack> {
    const eventName = this.idEventMap.get(id);
    if (eventName) {
      return this.events[eventName].find((stack) => stack.id === id);
    }
    return void 0;
  }

  /**
   * 获取绑定的事件
   * @param emit
   * @param eventKeys
   * @param eventParser
   * @private
   */
  private bindEvents<E extends string>(
    emit: (eventName: E, ...args: any[]) => void,
    eventKeys: string[],
    eventParser?: (eventName: E) => E | string,
  ) {
    if (!this.emitFnc) {
      this.emitFnc = emit;
    }
    if (!Array.isArray(eventKeys) || !eventKeys?.length) {
      return {};
    }
    const _eventParser = eventParser || ((eventName: E) => eventName);
    const registeredEventKeysMap = new Set(Object.keys(this.events));
    return eventKeys.reduce(
      (result: TObj<CTableEventKeys, TFunction>, eventName) => {
        // 未注册的事件不绑定
        if (!registeredEventKeysMap.has(eventName)) {
          return result;
        }
        Reflect.set(result, _eventParser(eventName as E), (...args: any[]) => {
          this.events[eventName].forEach((stack) => {
            // 暂停的事件不执行
            if (!stack.paused) {
              stack.callback(...args);
            }
            // emit 不受暂停影响
            emit(eventName as E, ...args);
          });
        });
        return result;
      },
      {},
    );
  }

  /**
   * 获取表格注册的事件
   * @param emit
   */
  public getTableRegisterEvents<E extends string>(
    emit: (eventName: E, ...args: any[]) => void,
  ) {
    // 表格的事件
    return this.bindEvents<E>(emit, EL_TABLE_EVENTS as unknown as E[]);
  }

  /**
   * 获取分页器触发的事件
   * @param emit
   */
  public getPaginationEvents<E extends string>(
    emit: (eventName: E, ...args: any[]) => void,
  ) {
    return this.bindEvents<E>(
      emit,
      PAGINATION_EVENTS as unknown as E[],
      (eventName) => {
        // 分页参数去掉前缀
        return eventName.replace(PAGINATION_EVENT_PREFIX, "");
      },
    );
  }

  /**
   * 暂停事件
   * @param eventNameOrId
   */
  public paused(eventNameOrId: CTableEventKeys): void;
  public paused(eventNameOrId: number): void;
  public paused(eventNameOrId: CTableEventKeys | number) {
    const isEvent = typeof eventNameOrId === "string";
    const stack = isEvent
      ? this.events[eventNameOrId].find((stack) => !stack.paused)
      : this.findEventById(eventNameOrId);
    if (stack) {
      stack.paused = true;
    }
  }

  /**
   * 恢复事件
   * @param eventNameOrId
   */
  public resume(eventNameOrId: CTableEventKeys): void;
  public resume(eventNameOrId: number): void;
  public resume(eventNameOrId: CTableEventKeys | number): void {
    const isEvent = typeof eventNameOrId === "string";
    const stack = isEvent
      ? this.events[eventNameOrId].find((stack) => stack.paused)
      : this.findEventById(eventNameOrId);
    if (stack) {
      stack.paused = false;
    }
  }

  /**
   * 移除事件
   * @param eventNameOrId
   */
  public remove(eventNameOrId: CTableEventKeys): void;
  public remove(eventNameOrId: number): void;
  public remove(eventNameOrId: CTableEventKeys | number): void {
    const isEvent = typeof eventNameOrId === "string";
    if (isEvent) {
      Reflect.deleteProperty(this.events, eventNameOrId);
    } else {
      const eventName = this.idEventMap.get(eventNameOrId);
      if (eventName) {
        const stacks = this.events[eventName];
        const index = stacks.findIndex((stack) => stack.id === eventNameOrId);
        if (index > -1) {
          stacks.splice(index, 1);
        }
      }
    }
  }

  public register(eventName: CTableEventKeys, callback: TFunction) {
    if (!Reflect.has(this.events, eventName)) {
      Reflect.set(this.events, eventName, []);
    }
    const nextId = ++id;
    this.events[eventName].push({
      id: nextId,
      callback,
      paused: false,
    });
    this.idEventMap.set(nextId, eventName);

    return {
      paused: () => this.paused(nextId),
      resume: () => this.resume(nextId),
      destroy: () => this.remove(nextId),
      id: nextId,
    };
  }

  /**
   * 触发事件
   * @param eventName
   * @param args
   */
  public trigger(eventName: CTableEventKeys, ...args: any[]): void {
    const events = this.events[eventName];
    if (events) {
      events.forEach((stack) => {
        stack.callback(...args);
        if (this.emitFnc) {
          this.emitFnc(eventName, ...args);
        }
      });
    }
  }

  public destroy() {
    this.events = {};
    this.idEventMap.clear();
    this.emitFnc = void 0;
  }
}
