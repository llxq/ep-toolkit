import type {
  IMenuCategory,
  IMenuItem,
  IMenuStore,
} from "@play/store/menu/type";
import { defineStore } from "pinia";

export const useMenuStore = defineStore("ep_toolkit_menu", {
  state: (): IMenuStore => ({
    menuList: [],
    flatMenuList: [],
    menuCodeMap: {},
  }),
  actions: {
    setMenuList(menuList: IMenuCategory[]) {
      this.menuList = menuList;
      this.flatMenuList = this.menuList.reduce((acc, item) => {
        if (item.menu) {
          acc.push(...item.menu);
        }
        return acc;
      }, [] as IMenuItem[]);
    },
    setMenuCodeMap(menuCodeMap: TObj<string, string>) {
      this.menuCodeMap = menuCodeMap;
    },
    fundMenuCode(codePath: string) {
      return this.menuCodeMap[codePath];
    },
    findMenuItem(path: string) {
      return this.flatMenuList.find((item) => item.path === path);
    },
  },
});
