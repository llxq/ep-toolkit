interface EventType {
  eventName: string;
  params: any;
  callbacks: EventFnc[];
}

type EventFnc = (...args: any) => void;

export interface EventBusProps {
  on(eventName: string, callback: EventFnc, immediate: boolean): void;

  emit(eventName: string, ...args: any): void;

  off(eventName?: string | string[]): void;

  once(eventName: string, callback: EventFnc): void;
}

export class EventBus implements EventBusProps {
  private _eventList: EventType[] = [];

  // 重写toString方法

  private _toString = (callback: EventFnc): string =>
    Object.toString.call(callback);

  /**
   * 监听
   * @param {string} eventName 需要监听的名字
   * @param {Function} callback 监听触发的回调
   * @param immediate 是否立即执行
   * */
  public on(eventName: string, callback: EventFnc, immediate = false): void {
    const event: TUndefinable<EventType> = this._findEvent(eventName);
    if (event) {
      // 不比较引用。通过方法字符串去对比callback
      const fnc: TUndefinable<EventFnc> = event?.callbacks?.find(
        (fncItem: EventFnc) =>
          this._toString(fncItem) === this._toString(callback),
      );
      if (!fnc) {
        // 如果没有事件，需要往list中加一个
        event.callbacks.push(callback);
        immediate && callback(...event.params);
      }
    } else {
      // 如果没有事件，需要往list中加一个
      this._addEvent(eventName, "", [callback]);
    }
  }

  /**
   * 分发事件
   * @param {string} eventName 需要分发的监听的名字
   * @param { any } args 传递的参数
   * */

  public emit(eventName: string, ...args: any): Promise<void | void[]> {
    const event: TUndefinable<EventType> = this._findEvent(eventName);
    if (event) {
      event.params = args;
      return Promise.all(
        event.callbacks?.map((fnc: EventFnc) => fnc(...event.params)),
      );
    } else {
      // 如果没有事件，需要往list中加一个
      this._addEvent(eventName, args);
    }
    return Promise.resolve();
  }

  /**
   * 取消监听
   * @param {string | Array<string>} eventName 需要取消的监听名称
   * */
  public off(eventName?: string | string[]): void {
    if (typeof eventName === "string") {
      const index: number = this._eventList.findIndex(
        (event: EventType) => event.eventName === eventName,
      );
      if (index > -1) this._eventList.splice(index, 1);
    } else if (eventName instanceof Array) {
      eventName.map((m: string) => this.off(m));
    } else {
      this._eventList = [];
    }
  }

  /**
   * 执行一次的监听之后立即销毁
   * @param {string} eventName 需要监听的名字
   * @param {Function} callback 监听触发的回调
   * */
  public once(eventName: string, callback: EventFnc): void {
    this.emit(eventName, callback, true);
    this.off(eventName);
  }

  private _findEvent(eventName: string): TUndefinable<EventType> {
    return this._eventList.find(
      (event: EventType) => event.eventName === eventName,
    );
  }

  private _addEvent(
    eventName: string,
    params?: any,
    callbacks?: EventFnc[],
  ): void {
    this._eventList.push({
      eventName,
      params: params ?? "",
      callbacks: callbacks ?? [],
    });
  }
}
