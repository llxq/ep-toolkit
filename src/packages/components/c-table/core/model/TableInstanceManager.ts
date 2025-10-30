import type { TElTableRefInstance, TElTableInstance } from "@/helper/type.ts";
import { unref } from "vue";

export class TableInstanceManager {
  private _instance?: TElTableRefInstance;
  public get instance(): TUndefinable<TElTableInstance> {
    return unref(this._instance);
  }

  public setInstance(instance: TElTableRefInstance) {
    this._instance = instance;
  }
}
